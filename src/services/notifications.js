import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import {
  db,
  messaging,
  messagingSupportPromise,
} from "../fireBase";

const ADMIN_DEVICES_COLLECTION = "admin_devices";

export async function enableAdminNotifications(adminUser) {
  const supported = await messagingSupportPromise;

  if (!supported || !messaging) {
    throw new Error("Notifications are not supported in this browser.");
  }

  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    throw new Error("Missing VITE_FIREBASE_VAPID_KEY.");
  }

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Could not get FCM token.");
  }

  await setDoc(doc(db, ADMIN_DEVICES_COLLECTION, token), {
    token,
    userId: adminUser?.uid ?? "",
    email: adminUser?.email ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    platform: "web",
  });

  return token;
}

export function subscribeToForegroundMessages(callback) {
  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, callback);
}
