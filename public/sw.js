const CACHE = "shahy-v1"
const STATIC = ["/", "/sale", "/track", "/about"]

self.addEventListener("install", e => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})))
})

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return
  const url = new URL(e.request.url)
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/")) return
  e.respondWith(
    caches.match(e.request).then(cached => cached ?? fetch(e.request).catch(() => cached ?? new Response("", { status: 408 })))
  )
})
