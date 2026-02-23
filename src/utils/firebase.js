import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB6j5d1-Yq3kGYEH6VBYjvbnG9tAQ4n8ik",
  authDomain: "pc-customization-notification.firebaseapp.com",
  projectId: "pc-customization-notification",
  messagingSenderId: "1082009526884",
  appId: "1:1082009526884:web:ea751558844c1b75ef3571",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Permission not granted");
      return null;
    }

    // 🔥 Register service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // 🔥 VERY IMPORTANT — wait until SW is active
    await navigator.serviceWorker.ready;

    console.log("Service worker ready:", registration);

    const token = await getToken(messaging, {
      vapidKey: "BNCYiQmqoi6HScKXdaScCaUnZI1R6ABurTnUYukh3u6svHLhfpO8GMl2iO1OBoH1OPkUH5eBMb-qOm-6FWDT_Hg",
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);

    return token;
  } catch (error) {
    console.log("FCM token error:", error);
  }
};

export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
};
