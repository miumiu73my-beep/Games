/* Scoped to the /Games/ installation; never touches other projects' caches. */
const CACHE = "games-pwa-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pwa-nav.js",
  "./icons/icon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./%E3%82%AF%E3%82%99%E3%83%AB%E3%83%A1%E3%83%86%E3%83%B3%E3%83%AC%E3%83%83%E3%82%AF.html",
  "./%E3%83%8F%E3%83%AA%E3%83%8D%E3%82%B9%E3%82%99%E3%83%9F%E3%81%AE%E3%81%8A%E3%81%8B%E3%81%88%E3%82%8A%E3%83%8F%E3%82%9A%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB.html",
  "./%E3%83%92%E3%83%A1%E3%83%8F%E3%83%AA%E3%81%A8%E3%83%8F%E3%83%AA%E3%83%8D%E3%82%B9%E3%82%99%E3%83%9F%E3%81%AE%E3%81%8A%E3%81%9B%E3%82%8F%E3%81%88%E3%81%BB%E3%82%93.html",
  "./%E3%83%92%E3%83%A1%E3%83%8F%E3%83%AA%E3%83%8F%E3%82%9A%E3%82%B9%E3%82%99%E3%83%AB.html",
  "./%E9%87%8E%E8%8F%9C%E7%95%91%E3%81%9F%E3%82%99%E3%81%91%E7%89%A7%E5%A0%B4.html"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("games-pwa-") && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === "navigate") {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone()).catch(() => {});
        return response;
      } catch {
        return await cache.match(request, {ignoreSearch:true}) ||
          await cache.match("./index.html") || Response.error();
      }
    }
    const saved = await cache.match(request);
    if (saved) return saved;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch { return Response.error(); }
  })());
});
