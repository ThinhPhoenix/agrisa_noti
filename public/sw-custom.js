// public/sw-custom.js - Service Worker for Push Notifications

// Handle push events
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || "Bạn có thông báo mới!",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    data: data.data || {},
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Agrisa Notification",
      options
    )
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there is already a window/tab open with the target URL
        for (let client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab with the target URL
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle service worker installation
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
