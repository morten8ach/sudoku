// Et navn på vores "cache" (lager). Hvis vi ændrer det, hentes alt på ny.
const CACHE_NAVN = 'sudoku-v15';

// Listen over filer der skal gemmes lokalt, så appen virker offline
const FILER_DER_SKAL_GEMMES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './fonts/lora-regular.woff2',
  './fonts/lora-bold.woff2'
];

// 1) INSTALLATION: Når service worker'en installeres første gang,
//    henter vi alle filerne og gemmer dem.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAVN).then(cache => {
      return cache.addAll(FILER_DER_SKAL_GEMMES);
    })
  );
});

// 2) AKTIVERING: Når en ny version aktiveres, slettes gamle caches
//    så vi ikke fylder telefonen med gamle filer.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(navne => {
      return Promise.all(
        navne.map(navn => {
          if (navn !== CACHE_NAVN) {
            return caches.delete(navn);
          }
        })
      );
    })
  );
});

// 3) FETCH: Hver gang browseren beder om en fil, tjekker vi først
//    cachen. Hvis filen er gemt, bruger vi den (= virker offline).
//    Hvis ikke, henter vi den fra nettet.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(svar => {
      return svar || fetch(event.request);
    })
  );
});
