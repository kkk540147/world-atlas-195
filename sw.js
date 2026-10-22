/* v2: network-first navigation so newly deployed GitHub Pages versions appear. */
const CACHE = 'world-atlas-195-v2';
const ASSETS = ['./index.html', './manifest.webmanifest', './assets/icon-192.png', './assets/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin)return;
  if(event.request.mode === 'navigate'){
    event.respondWith(fetch(event.request).then(resp=>{
      if(resp.ok){const snapshot=resp.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',snapshot)));}
      return resp;
    }).catch(()=>caches.match('./index.html')));
  } else {
    event.respondWith(caches.match(event.request).then(cached=>cached || fetch(event.request)));
  }
});
