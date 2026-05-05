import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../fireBase";

const heroSlidesCollection = collection(db, "heroSlides");

function normalizeHeroSlide(docSnapshot) {
  const data = docSnapshot.data();

  return {
    id: docSnapshot.id,
    title: data.title ?? "",
    titleAr: data.titleAr ?? "",
    subtitle: data.subtitle ?? "",
    subtitleAr: data.subtitleAr ?? "",
    buttonText: data.buttonText ?? "",
    buttonTextAr: data.buttonTextAr ?? "",
    bg: data.bg ?? "from-pink-500 to-orange-400",
    productIds: Array.isArray(data.productIds)
      ? data.productIds.map((id) => String(id))
      : [],
    isActive: data.isActive ?? true,
    sortOrder: Number(data.sortOrder ?? 0),
  };
}

function getPayload(slide) {
  return {
    title: slide.title ?? "",
    titleAr: slide.titleAr ?? "",
    subtitle: slide.subtitle ?? "",
    subtitleAr: slide.subtitleAr ?? "",
    buttonText: slide.buttonText ?? "",
    buttonTextAr: slide.buttonTextAr ?? "",
    bg: slide.bg ?? "from-pink-500 to-orange-400",
    productIds: Array.isArray(slide.productIds)
      ? slide.productIds.map((id) => String(id))
      : [],
    isActive: Boolean(slide.isActive),
    sortOrder: Number(slide.sortOrder ?? 0),
  };
}

export async function fetchHeroSlides() {
  const snapshot = await getDocs(heroSlidesCollection);

  return snapshot.docs
    .map(normalizeHeroSlide)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function createHeroSlide(slide) {
  const payload = getPayload(slide);
  const newDoc = await addDoc(heroSlidesCollection, payload);

  return {
    id: newDoc.id,
    ...payload,
  };
}

export async function editHeroSlide(id, slide) {
  const payload = getPayload(slide);

  await updateDoc(doc(heroSlidesCollection, String(id)), payload);

  return {
    id: String(id),
    ...payload,
  };
}

export async function removeHeroSlide(id) {
  await deleteDoc(doc(heroSlidesCollection, String(id)));
}
