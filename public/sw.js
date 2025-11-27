// public/sw-custom.js - Service Worker for Push Notifications (iOS Compatible)

self.addEventListener("push", (event) => {
    let data = {};
    
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        console.warn("Push payload not JSON:", e);
    }

    const title = data.title || "Agrisa Notification";

    const options = {
        body: data.body || "Bạn có thông báo mới!",
        icon: "/icon-192x192.png",
        // ⚠ iOS không hỗ trợ badge → bỏ hẳn dòng này
        data: data.data || {},
        // ⚠ iOS không hỗ trợ requireInteraction → bỏ
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url
        ? new URL(event.notification.data.url, self.location.origin).href
        : self.location.origin;

    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url === urlToOpen && "focus" in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow(urlToOpen);
            })
    );
});

// Install
self.addEventListener("install", () => {
    self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
});
