import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../fireBase";

const productsCollection = collection(db, "products");

function normalizeProduct(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    name: data.name ?? "",
    nameAr: data.nameAr ?? "",
    price: Number(data.price ?? 0),
    img: data.img ?? "",
    tag: data.tag ?? null,
    category: data.category ?? "Men",
    isOffer: Boolean(data.isOffer ?? data.tag === "Sale"),
    sizeTemplateCategory: data.sizeTemplateCategory ?? null,
    sizeTemplateId: data.sizeTemplateId ?? null,
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
        nameAr: product.nameAr ?? "",
        price: Number(product.price),
        img: product.img,
        tag: product.tag ?? null,
        category: product.category ?? "Men",
        isOffer: Boolean(product.isOffer ?? product.tag === "Sale"),
        sizeTemplateCategory: product.sizeTemplateCategory ?? null,
        sizeTemplateId: product.sizeTemplateId ?? null,
      })
    )
  );

  return products.map((product) => ({
    ...product,
    id: String(product.id),
    price: Number(product.price),
    tag: product.tag ?? null,
    isOffer: Boolean(product.isOffer ?? product.tag === "Sale"),
    sizeTemplateCategory: product.sizeTemplateCategory ?? null,
    sizeTemplateId: product.sizeTemplateId ?? null,
  }));
}

export async function createProduct(product) {
  const payload = {
    name: product.name,
    nameAr: product.nameAr ?? "",
    price: Number(product.price),
    img: product.img,
    tag: product.tag ?? null,
    category: product.category ?? "Men",
    isOffer: Boolean(product.isOffer),
    sizeTemplateCategory: product.sizeTemplateCategory ?? null,
    sizeTemplateId: product.sizeTemplateId ?? null,
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
    nameAr: product.nameAr ?? "",
    price: Number(product.price),
    img: product.img,
    tag: product.tag ?? null,
    category: product.category ?? "Men",
    isOffer: Boolean(product.isOffer),
    sizeTemplateCategory: product.sizeTemplateCategory ?? null,
    sizeTemplateId: product.sizeTemplateId ?? null,
  };

  await setDoc(doc(productsCollection, String(id)), payload, { merge: true });

  return {
    id: String(id),
    ...payload,
  };
}

export async function removeProduct(id) {
  await deleteDoc(doc(productsCollection, String(id)));
}
