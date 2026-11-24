var CACHE='rtt-v4';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){
  return Promise.all(FILES.map(function(f){return fetch(new Request(f,{cache:'reload'})).then(function(r){if(!r.ok)throw new Error(f);return c.put(f,r);});}));
}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(e.request,{ignoreSearch:true}).then(function(hit){
      var net=fetch(e.request,{cache:'no-cache'}).then(function(res){if(res&&res.ok)c.put(e.request,res.clone());return res;}).catch(function(){return hit||c.match('index.html');});
      return hit||net;
    });
  }));
});
