const CACHE_NAME = 'bleuwi-world-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
]

// Install event: Pre-cache static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event: Network-first for navigation/HTML, Cache-first for images/fonts/static
self.addEventListener('fetch', (event) => {
  const request = event.request

  // Only handle GET requests
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // 1. Navigation requests (HTML pages): Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return networkResponse
        })
        .catch(() => caches.match('/index.html') || caches.match(request))
    )
    return
  }

  // 2. Static assets (images, fonts, stylesheets, scripts): Stale-while-revalidate or Cache-first
  const isStaticAsset = 
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico|woff2|woff|css|js)$/i)

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch background update
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse))
            }
          }).catch(() => {})
          return cachedResponse
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return networkResponse
        })
      })
    )
    return
  }

  // Default network fetch
  event.respondWith(fetch(request))
})
