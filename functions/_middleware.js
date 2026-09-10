// Cloudflare Pages Middleware: functions/_middleware.js
import { isTangerRegion } from './api/utils.js'

function notFoundResponse() {
  return new Response('Not Found', {
    status: 404,
    statusText: 'Not Found',
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

export async function onRequest(context) {
  const { request, env, next } = context
  const url = new URL(request.url)
  const hostHeader = (request.headers.get('host') || '').toLowerCase()
  const hostname = hostHeader.split(':')[0]

  // =========================================================================
  // SUITE 0: ENFORCE HTTPS & CANONICAL DOMAIN REDIRECT
  // =========================================================================
  if (url.protocol === 'http:' || request.headers.get('x-forwarded-proto') === 'http') {
    const secureUrl = new URL(request.url)
    secureUrl.protocol = 'https:'
    return Response.redirect(secureUrl.toString(), 301)
  }

  if (hostname === 'www.bleuwiworld.shop') {
    const canonicalUrl = `https://bleuwiworld.shop${url.pathname}${url.search}`
    return Response.redirect(canonicalUrl, 301)
  }

  // =========================================================================
  // SUITE 3: DEV & PREVIEW DEPLOYMENT LINK BLOCKING
  // =========================================================================
  const hostParts = hostname.split('.')
  const tld = hostParts[hostParts.length - 1]
  const domain = hostParts[hostParts.length - 2]

  if (domain === 'pages' && tld === 'dev') {
    // Check if this is a preview / branch / commit deployment
    // e.g. <hash>.bleuwi-world.pages.dev, development.bleuwi-world.pages.dev
    const isPreviewDeployment = hostParts.length > 3

    if (isPreviewDeployment) {
      return notFoundResponse()
    }

    // Primary pages.dev URL (bleuwi-world.pages.dev)
    const customDomain = env.CUSTOM_DOMAIN ? env.CUSTOM_DOMAIN.trim() : ''
    const shouldBlockPagesDev = env.BLOCK_PAGES_DEV === 'true'

    if (shouldBlockPagesDev) {
      return new Response('Access Denied', {
        status: 403,
        statusText: 'Forbidden',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      })
    }

    if (customDomain && hostname !== customDomain.toLowerCase()) {
      const redirectUrl = `https://${customDomain}${url.pathname}${url.search}`
      return Response.redirect(redirectUrl, 301)
    }
  }

  // =========================================================================
  // PATH NORMALIZATION FOR PROBES & CASE-SENSITIVITY
  // =========================================================================
  let rawPath = url.pathname
  try {
    rawPath = decodeURIComponent(url.pathname)
  } catch (e) {}

  // Resolve multiple slashes, dot segments, and path traversal
  let normalized = rawPath
    .replace(/\/+/g, '/')
    .replace(/\/\.\//g, '/')
    .replace(/\/[^\/]+\/\.\.\//g, '/')
    .replace(/\/+$/, '')

  if (!normalized) normalized = '/'

  const lowerPath = normalized.toLowerCase()

  // Secret admin path: exact case check (default: /bleuwi-x7k9q2-control)
  const adminSecretPath = env.ADMIN_SECRET_PATH || '/bleuwi-x7k9q2-control'

  // =========================================================================
  // ALLOW BACKEND API ROUTES (/api/*) TO REACH PAGES FUNCTIONS DIRECTLY
  // Master Admin API endpoints (/api/admin/*) are strictly guarded with JWT & D1
  // =========================================================================
  if (normalized.startsWith('/api/')) {
    return next()
  }

  // =========================================================================
  // SUITE 1 & 2: FORBIDDEN ADMIN PATHS & BYPASS ATTEMPTS
  // =========================================================================
  const forbiddenAdminPaths = [
    '/admin',
    '/admin/login',
    '/administrator',
    '/dashboard',
    '/login',
    '/panel',
    '/cpanel',
    '/admin-login',
    '/admin_login',
    '/wp-admin',
    '/wp-login.php',
    '/admin.php',
    '/backend',
  ]

  const isForbiddenAdmin =
    forbiddenAdminPaths.some((p) => {
      return lowerPath === p || lowerPath.startsWith(`${p}/`)
    }) ||
    // Also catch raw encoded or double slash probes in original URL
    request.url.toLowerCase().includes('/admin%2f') ||
    request.url.toLowerCase().includes('//admin')

  if (isForbiddenAdmin) {
    return notFoundResponse()
  }

  // Block legacy ?view=admin probe parameter on public URLs
  if (url.searchParams.get('view') === 'admin' && normalized !== adminSecretPath) {
    return notFoundResponse()
  }

  // =========================================================================
  // SUITE 5: SECRET ADMIN PATH (STRICT CASE-SENSITIVE & TANGER REGION GEO-FENCE)
  // Must match exact case: /bleuwi-x7k9q2-control
  // Strictly restricted to Tanger-Tétouan-Al Hoceïma region. Outsiders receive 404!
  // =========================================================================
  if (normalized === adminSecretPath) {
    if (!isTangerRegion(request, env)) {
      return notFoundResponse()
    }
    return next(new Request(new URL('/', request.url), request))
  }

  // =========================================================================
  // SUITE 4: ALLOWED PUBLIC ROUTES
  // =========================================================================
  if (normalized === '/' || normalized === '/session-cards' || normalized === '/intro') {
    if (normalized !== '/') {
      return next(new Request(new URL('/', request.url), request))
    }
    return next()
  }

  // Allow backend API routes (/api/*)
  if (normalized.startsWith('/api/')) {
    return next()
  }

  // Allow static asset files with extensions (.js, .css, .png, .jpg, .ico, .svg, .json, .txt, .xml, .mp4, .webp)
  const isStaticFile = /\.[a-zA-Z0-9]+$/.test(normalized)
  if (isStaticFile) {
    return next()
  }

  // =========================================================================
  // SUITE 6: UNIFORM 404 FOR ALL NON-EXISTENT PAGES
  // Guarantees /admin and /this-page-does-not-exist-xyz123 are indistinguishable
  // =========================================================================
  return notFoundResponse()
}
