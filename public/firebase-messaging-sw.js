importScripts(
    "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
  );
  
  firebase.initializeApp({
    apiKey: "AIzaSyDRKG40ff8S3qfjVHit3KB0gvYC2WRPmPE",
    authDomain: "eliteacademyeg-a7552.firebaseapp.com",
    projectId: "eliteacademyeg-a7552",
    storageBucket: "eliteacademyeg-a7552.appspot.com",
    messagingSenderId: "958297622504",
    appId: "1:958297622504:web:7bdd5201c7c93f6422465d",
    measurementId: "G-BNV4PJQZJ1",
  });
  
  const messaging = firebase.messaging();
  
  const shownNotifications = new Set();
  
  messaging.onBackgroundMessage(async function (payload) {
    const notificationId = payload.data.id;
    if (shownNotifications.has(notificationId)) {
      console.log("Duplicate notification ignored:", notificationId);
      return;
    }
  
    shownNotifications.add(notificationId);
  
    console.log("[sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "https://firebasestorage.googleapis.com/v0/b/eliteacademyeg-a7552.appspot.com/o/files%2Flogo512.png?alt=media",
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
  
  const version = 10;
  const currentCacheName = `static-cache-${version}`;
  
  self.addEventListener("install", (event) => {
    self.skipWaiting();
  
    event.waitUntil(async () => {
      const cachedNames = await caches.keys();
      for (const name of cachedNames) {
        await caches.delete(name);
      }
  
      caches.open(currentCacheName).then((cache) => {
        return cache.addAll(["/", "/index.html"]);
      });
    });
  });
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== currentCacheName) {
                return caches.delete(cacheName);
              }
            })
          );
        })
        .then(() => {
          console.log("Service worker has been activated and taking control.");
        })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    const request = event.request;
  
    if (request.method !== "GET" || request.url.includes("?")) {
      return;
    }
  
    const shouldCache = request.url.match(/\.css$|\.js$|\.png$|\.jpg$/);
  
    event.respondWith(
      caches.open(currentCacheName).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return fetch(request)
            .then((networkResponse) => {
              if (shouldCache && networkResponse.status === 200) {
                cache?.put?.(request.url, networkResponse.clone());
              }
  
              return networkResponse;
            })
            .catch(() => {
              return cachedResponse;
            });
        });
      })
    );
  });
  