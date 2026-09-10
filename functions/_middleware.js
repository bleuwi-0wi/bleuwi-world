// Cloudflare Pages Middleware: functions/_middleware.js
// 1. Blocks all dev / preview deployment URLs (*.bleuwi-world.pages.dev) -> 404 Not Found
// 2. Redirects or blocks primary pages.dev (bleuwi-world.pages.dev) to custom domain (bleuwiworld.shop)
// 3. Blocks known admin probe paths (/admin, /administrator, /dashboard, /login, /panel) -> 404 Not Found
// 4. Routes custom secret admin path (ADMIN_SECRET_PATH) without revealing admin presence
// 5. Preserves all public routes (/session-cards, /intro, /, /api/*, etc.) with SPA rewriting

export async function onRequest(context) {
  const { request, env, next } = context
  const url = new URL(request.url)
  const pathname = url.pathname.toLowerCase().replace(/\/+$/, '') || '/'
  const hostHeader = (request.headers.get('host') || '').toLowerCase()
  const hostname = hostHeader.split(':')[0]

  // =========================================================================
  // PART 3: DEV & PREVIEW DEPLOYMENT LINK BLOCKING
  // =========================================================================
  const hostParts = hostname.split('.')
  const tld = hostParts[hostParts.length - 1]
  const domain = hostParts[hostParts.length - 2]

  if (domain === 'pages' && tld === 'dev') {
    // Check if this is a preview / branch / commit deployment
    // e.g. <hash>.bleuwi-world.pages.dev, development.bleuwi-world.pages.dev
    // In Cloudflare Pages, preview URLs have 4 or more parts.
    const isPreviewDeployment = hostParts.length > 3

    if (isPreviewDeployment) {
      return new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      })
    }

    // Primary pages.dev URL (e.g. bleuwi-world.pages.dev)
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

    // If a custom domain is configured and we are on primary pages.dev,
    // redirect smoothly to the custom domain (Option A)
    if (customDomain && hostname !== customDomain.toLowerCase()) {
      const redirectUrl = `https://${customDomain}${url.pathname}${url.search}`
      return Response.redirect(redirectUrl, 301)
    }

  }

  // =========================================================================
  // PART 1: BLOCK ALL KNOWN ADMIN PATHS (STRICT 404 NOT FOUND)
  // Must look indistinguishable from non-existent endpoints.
  // No redirects, no 403 Forbidden, no admin hints whatsoever.
  // =========================================================================
  const forbiddenAdminPaths = [
    '/admin',
    '/administrator',
    '/dashboard',
    '/login',
    '/panel',
    '/cpanel',
    '/admin-login',
    '/admin_login',
    '/wp-admin',
    '/backend',
  ]

  const isForbiddenAdminProbe = forbiddenAdminPaths.some((forbidden) => {
    return pathname === forbidden || pathname.startsWith(`${forbidden}/`)
  })

  // Do not block API login (/api/auth/login) - only web page paths
  if (isForbiddenAdminProbe && !pathname.startsWith('/api/')) {
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  // Block legacy ?view=admin probe parameter on public URLs
  const adminSecretPath = (env.ADMIN_SECRET_PATH || '/bleuwi-x7k9q2-control').toLowerCase()
  if (url.searchParams.get('view') === 'admin' && pathname !== adminSecretPath) {
    return new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  // =========================================================================
  // PART 1 & PUBLIC ROUTING: SPA REWRITE TO /index.html
  // If requesting secret admin path or public routes (/session-cards, /intro),
  // rewrite request to /index.html so the frontend router handles it.
  // =========================================================================
  const isSpaRoute =
    pathname !== '/' &&
    pathname !== '/index.html' &&
    !pathname.startsWith('/api/') &&
    !isForbiddenAdminProbe &&
    (pathname === adminSecretPath ||
      pathname === '/session-cards' ||
      pathname === '/intro' ||
      !pathname.slice(1).includes('.'))

  if (isSpaRoute) {
    return next(new Request(new URL('/', request.url), request))
  }

  return next()
}



