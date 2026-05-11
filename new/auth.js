import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../fireBase";

export function subscribeToAdminAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signInAdmin(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function signInUser(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function signUpUser({ fullName, email, password }) {
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (fullName?.trim()) {
    await updateProfile(credentials.user, {
      displayName: fullName.trim(),
    });
  }

  return auth.currentUser || credentials.user;
}

export async function sendUserPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutAdmin() {
  await signOut(auth);
}

export async function signOutUser() {
  await signOut(auth);
}
