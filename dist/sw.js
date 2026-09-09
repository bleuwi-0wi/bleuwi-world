const CACHE_NAME = 'bleuwi-world-v2'
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

// Install event: Pre-cache static shell assets and immediately activate
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

// Activate event: Immediately wipe all old caches and take control of all open tabs
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

// Fetch event: Network-first for navigation & scripts/styles to guarantee instant updates
self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // 1. Navigation requests & code bundles (HTML, JS, CSS): Network-first with cache fallback
  const isCodeOrDoc = 
    request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname === '/'

  if (isCodeOrDoc) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone))
          }
          return networkResponse
        })
        .catch(() => caches.match(request) || caches.match('/index.html'))
    )
    return
  }

  // 2. Heavy Media & Images: Cache-first with network fallback
  const isMediaAsset = url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico|woff2|woff|mp4)$/i)

  if (isMediaAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse

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
