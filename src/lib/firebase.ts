// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAEy6EzaQlYeLN2RbPvXBHtFGilTY5QbbM",
  authDomain: "test-noti-de70b.firebaseapp.com",
  projectId: "test-noti-de70b",
  storageBucket: "test-noti-de70b.firebasestorage.app",
  messagingSenderId: "334961615160",
  appId: "1:334961615160:web:97c1a6a11041bfc62be1cd",
  measurementId: "G-5SKYCCD8NX"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Get messaging instance (only in browser)
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  
  return getMessaging(app);
};

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const messaging = await getMessagingInstance();
      if (!messaging) {
        throw new Error("Messaging not supported");
      }

      // Get the FCM token
      // Replace YOUR_VAPID_KEY_HERE with your actual VAPID key from:
      // Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
      const token = await getToken(messaging, {
        vapidKey: "BPJS4iP0UqHSvHzImpkqWHFyCtzVxC_Bvc1nSdg2IY55X9PXTdZGWBbwNgyn--15aNGiOebPcz0i8MjYTGOHI0I",
      });

      return token;
    } else {
      console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = async () => {
  const messaging = await getMessagingInstance();
  if (!messaging) return;

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      resolve(payload);
    });
  });
};

export { app };