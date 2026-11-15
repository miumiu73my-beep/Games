const CACHE='games-pwa-v1';
const PRECACHE=['./','./index.html','./manifest.webmanifest','./icons/icon.svg',"./%E3%82%AF%E3%82%99%E3%83%AB%E3%83%A1%E3%83%86%E3%83%B3%E3%83%AC%E3%83%83%E3%82%AF.html","./%E3%83%8F%E3%83%AA%E3%83%8D%E3%82%B9%E3%82%99%E3%83%9F%E3%81%AE%E3%81%8A%E3%81%8B%E3%81%88%E3%82%8A%E3%83%8F%E3%82%9A%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB.html","./%E3%83%92%E3%83%A1%E3%83%8F%E3%83%AA%E3%81%A8%E3%83%8F%E3%83%AA%E3%83%8D%E3%82%B9%E3%82%99%E3%83%9F%E3%81%AE%E3%81%8A%E3%81%9B%E3%82%8F%E3%81%88%E3%81%BB%E3%82%93.html","./%E3%83%92%E3%83%A1%E3%83%8F%E3%83%AA%E3%83%8F%E3%82%9A%E3%82%B9%E3%82%99%E3%83%AB.html","./%E9%87%8E%E8%8F%9C%E7%95%91%E3%81%9F%E3%82%99%E3%81%91%E7%89%A7%E5%A0%B4.html"];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('games-pwa-') && key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(!new URL(req.url).pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   if(req.mode==='navigate'){
     try{const response=await fetch(req);if(response.ok)cache.put(req,response.clone());return response;}
     catch{return await cache.match(req)||await cache.match('./index.html')||Response.error();}
   }
   const saved=await cache.match(req);if(saved)return saved;
   try{const res=await fetch(req);if(res.ok)cache.put(req,res.clone());return res;}
   catch{return Response.error();}
 })());
});