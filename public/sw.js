const CACHE = "elfady-v3"
const STATIC = ["/sale", "/track", "/about"]

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

  // Navigation requests (the HTML document itself) must always prefer the
  // network: this app deploys frequently, and a cache-first document means a
  // returning visitor can get permanently stuck on an old HTML shell whose
  // JS chunk hashes no longer resolve once superseded by a newer deploy --
  // a real, live bug found this way (page frozen at the loading intro /
  // crashing to the 500 boundary, chunk 404s in a retry loop). Network-first
  // with a cache fallback keeps normal navigation fresh and still degrades
  // gracefully offline.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
          return res
        })
        .catch(() => caches.match(e.request).then(cached => cached ?? new Response("", { status: 408 })))
    )
    return
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached ?? fetch(e.request).catch(() => cached ?? new Response("", { status: 408 })))
  )
})
