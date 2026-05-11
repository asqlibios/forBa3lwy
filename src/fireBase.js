import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBsV4UdP8nhER8x_X0KEHnBTMkSXHlDhKY",
  authDomain: "shop-4bfcb.firebaseapp.com",
  projectId: "shop-4bfcb",
  storageBucket: "shop-4bfcb.firebasestorage.app",
  messagingSenderId: "475424068128",
  appId: "1:475424068128:web:eaa1dc90d24fd3837ea245",
};

const app = initializeApp(firebaseConfig);
const adminApp = initializeApp(firebaseConfig, "admin-auth");

export const db = getFirestore(app);
export const auth = getAuth(app);
export const adminAuth = getAuth(adminApp);
export const messagingSupportPromise = isSupported().catch(() => false);
const messagingSupported = await messagingSupportPromise;
export const messaging = messagingSupported ? getMessaging(app) : null;
export { firebaseConfig };
