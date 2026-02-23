importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB6j5d1-Yq3kGYEH6VBYjvbnG9tAQ4n8ik",
  authDomain: "pc-customization-notification.firebaseapp.com",
  projectId: "pc-customization-notification",
  messagingSenderId: "1082009526884",
  appId: "1:1082009526884:web:ea751558844c1b75ef3571",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
