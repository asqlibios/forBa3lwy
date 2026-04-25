import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../fireBase";

const ordersCollection = collection(db, "orders");

function normalizeOrder(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    name: data.name ?? "",
    phone: data.phone ?? "",
    city: data.city ?? "",
    address: data.address ?? "",
    notes: data.notes ?? "",
    products: Array.isArray(data.products) ? data.products : [],
    total: Number(data.total ?? 0),
    paymentMethod: data.paymentMethod ?? "WhatsApp",
    createdAt: data.createdAt ?? null,
  };
}

export async function createOrder(order) {
  const payload = {
    name: order.name,
    phone: order.phone,
    city: order.city ?? "",
    address: order.address,
    notes: order.notes ?? "",
    products: Array.isArray(order.products) ? order.products : [],
    total: Number(order.total ?? 0),
    paymentMethod: order.paymentMethod ?? "WhatsApp",
    createdAt: serverTimestamp(),
  };

  const newDoc = await addDoc(ordersCollection, payload);

  return {
    id: newDoc.id,
    ...payload,
  };
}

export async function removeOrder(id) {
  await deleteDoc(doc(db, "orders", String(id)));
}

export function subscribeToOrders(callback) {
  const ordersQuery = query(ordersCollection, orderBy("createdAt", "desc"));

  return onSnapshot(ordersQuery, (snapshot) => {
    callback(snapshot.docs.map(normalizeOrder));
  });
}
