import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../fireBase";

function getProfileDoc(userId) {
  return doc(db, "userProfiles", String(userId));
}

export function subscribeToUserProfile(user, callback) {
  if (!user?.uid) {
    callback(null);
    return () => {};
  }

  return onSnapshot(getProfileDoc(user.uid), (snapshot) => {
    const data = snapshot.data() || {};

    callback({
      fullName: data.fullName || user.displayName || "",
      email: data.email || user.email || "",
      phone: data.phone || "",
      city: data.city || "",
      address: data.address || "",
      notes: data.notes || "",
      updatedAt: data.updatedAt || null,
    });
  });
}

export async function saveUserProfile(user, profile) {
  if (!user?.uid) {
    throw new Error("You must be signed in to save account details.");
  }

  const payload = {
    fullName: profile.fullName?.trim() || "",
    email: user.email || "",
    phone: profile.phone?.trim() || "",
    city: profile.city?.trim() || "",
    address: profile.address?.trim() || "",
    notes: profile.notes?.trim() || "",
    updatedAt: serverTimestamp(),
  };

  await setDoc(getProfileDoc(user.uid), payload, { merge: true });

  if (auth.currentUser?.uid === user.uid && payload.fullName) {
    await updateProfile(auth.currentUser, {
      displayName: payload.fullName,
    });
  }

  return payload;
}
