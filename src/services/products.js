import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../fireBase";

const productsCollection = collection(db, "products");

function normalizeProduct(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    name: data.name ?? "",
    price: Number(data.price ?? 0),
    img: data.img ?? "",
    tag: data.tag ?? null,
    category: data.category ?? "Men",
  };
}

export async function fetchProducts() {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(normalizeProduct);
}

export async function seedProductsIfEmpty(products) {
  const snapshot = await getDocs(productsCollection);

  if (!snapshot.empty) {
    return snapshot.docs.map(normalizeProduct);
  }

  await Promise.all(
    products.map((product) =>
      setDoc(doc(productsCollection, String(product.id)), {
        name: product.name,
        price: Number(product.price),
        img: product.img,
        tag: product.tag ?? null,
        category: product.category ?? "Men",
      })
    )
  );

  return products.map((product) => ({
    ...product,
    id: String(product.id),
    price: Number(product.price),
    tag: product.tag ?? null,
  }));
}

export async function createProduct(product) {
  const payload = {
    name: product.name,
    price: Number(product.price),
    img: product.img,
    tag: product.tag ?? null,
    category: product.category ?? "Men",
  };

  const newDoc = await addDoc(productsCollection, payload);

  return {
    id: newDoc.id,
    ...payload,
  };
}

export async function editProduct(id, product) {
  const payload = {
    name: product.name,
    price: Number(product.price),
    img: product.img,
    tag: product.tag ?? null,
    category: product.category ?? "Men",
  };

  await updateDoc(doc(productsCollection, String(id)), payload);

  return {
    id: String(id),
    ...payload,
  };
}

export async function removeProduct(id) {
  await deleteDoc(doc(productsCollection, String(id)));
}
