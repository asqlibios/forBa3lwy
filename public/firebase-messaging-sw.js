/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBsV4UdP8nhER8x_X0KEHnBTMkSXHlDhKY",
  authDomain: "shop-4bfcb.firebaseapp.com",
  projectId: "shop-4bfcb",
  storageBucket: "shop-4bfcb.firebasestorage.app",
  messagingSenderId: "475424068128",
  appId: "1:475424068128:web:eaa1dc90d24fd3837ea245",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "طلب جديد";
  const body = payload.notification?.body || "تمت إضافة طلب جديد.";
  const link = payload.data?.link || "/";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
    data: { link },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.link || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(target);
      }

      return undefined;
    })
  );
});
