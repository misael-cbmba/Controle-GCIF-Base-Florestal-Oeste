const CACHE='gcif-operacao-v70';
const CORE=['./','./index.html','./styles.css','./app.js','./dashboard.js','./preventive.js','./cpcif.js','./manifest.json'];
self.addEventListener('install',event=>{
 self.skipWaiting();
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE).catch(()=>{})));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(cached=>{
  const fresh=fetch(event.request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(event.request,c))}return r}).catch(()=>cached);
  return cached||fresh;
 }));
});
