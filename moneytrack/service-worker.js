var dataCacheName = 'AppData-v1';
var cacheName = 'BudgetApp';
var filesToCache = [
  'https://preview.c9users.io/almazankaze/my-projects/moneytrack/index.html',
  'https://preview.c9users.io/almazankaze/my-projects/moneytrack/index.js',
  'https://preview.c9users.io/almazankaze/my-projects/moneytrack/index.css',
  'https://preview.c9users.io/almazankaze/my-projects/moneytrack/manifest.json'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  return self.clients.claim();
});