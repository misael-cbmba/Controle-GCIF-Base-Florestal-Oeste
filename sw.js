const CACHE='gcif-operacao-v79';
const CORE=['./','./index.html','./styles.css','./manifest.json'];
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
 const isCode=/\.(?:js|css)$/.test(url.pathname);
 if(event.request.mode==='navigate'||isCode){
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{
   if(r&&r.ok&&!isCode){const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));}
   return r;
  }).catch(()=>isCode?Response.error():caches.match('./index.html')));
  return;
 }
 event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
