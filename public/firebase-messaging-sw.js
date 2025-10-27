// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAEy6EzaQlYeLN2RbPvXBHtFGilTY5QbbM",
  authDomain: "test-noti-de70b.firebaseapp.com",
  projectId: "test-noti-de70b",
  storageBucket: "test-noti-de70b.firebasestorage.app",
  messagingSenderId: "334961615160",
  appId: "1:334961615160:web:97c1a6a11041bfc62be1cd",
  measurementId: "G-5SKYCCD8NX"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  // Support both notification and data-only messages
  const notificationTitle = payload.data?.title || 'New Notification';
  const notificationOptions = {
    body: payload.data?.body || 'You have a new notification',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  // Navigate to a specific URL if provided in the notification data
  if (event.notification.data?.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    // Default: open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});