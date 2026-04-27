const CACHE_NAME = 'mytahfiz-v1.1'; // Naikkan versi jika anda buat perubahan besar
const assets = [
  './',
  './index.html',
  './404.html',
  './manifest.json',
  './penyelenggaraan.html',
  './asset/favicon.png',
  './asset/background_image.png',
  // Tambah fail CSS/JS utama anda di bawah jika ada
  // './style.css',
];

// 1. Tahap INSTALL: Simpan aset penting dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Menyimpan aset statik ke dalam cache...');
      return cache.addAll(assets);
    })
  );
});

// 2. Tahap ACTIVATE: Buang cache lama jika ada update versi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// 3. Tahap FETCH: Ambil data dari cache supaya app laju & jimat data
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      // Jika ada dalam cache, guna cache. Jika tiada, buat fetch dari network.
      return cacheRes || fetch(event.request).then(fetchRes => {
        return fetchRes;
      });
    }).catch(() => {
      // Jika offline dan fail tiada dalam cache, boleh tunjukkan page offline
      if (event.request.url.indexOf('.html') > -1) {
        return caches.match('./404.html');
      }
    })
  );
});