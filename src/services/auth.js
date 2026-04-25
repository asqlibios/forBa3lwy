import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../fireBase";

export function subscribeToAdminAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signInAdmin(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function signOutAdmin() {
  await signOut(auth);
}
