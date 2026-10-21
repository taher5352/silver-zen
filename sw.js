/* Only this scope's public game files. Updates wait until existing app windows close. */
'use strict';
const PREFIX='silver-zen:'+self.registration.scope+':',CACHE=PREFIX+'rb1-20261021a';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(async response=>{
   if(response.ok){try{await(await caches.open(CACHE)).put(new URL('./',scope).href,response.clone());}catch(e){/* Storage failure must not hide an online response. */}}
   return response;
  }).catch(()=>caches.match(new URL('./',scope).href)));
 }else if(FILES.slice(2).some(f=>new URL(f,scope).pathname===u.pathname))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
