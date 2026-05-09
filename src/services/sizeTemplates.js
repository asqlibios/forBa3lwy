import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../fireBase";
import { isTemplateScopedCategory } from "../data/sizing";

const sizeTemplatesCollection = collection(db, "size_templates");

function normalizeMeasurementKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeTemplateSizes(sizes = [], measurementKeys = []) {
  return sizes
    .map((size) => {
      const normalizedSize = {
        label: String(size?.label || "").trim(),
      };

      measurementKeys.forEach((key) => {
        normalizedSize[key] = String(size?.[key] ?? "").trim();
      });

      return normalizedSize;
    })
    .filter((size) => size.label);
}

function normalizeTemplatePayload(template) {
  const measurementKeys = Array.from(
    new Set(
      (template.measurementKeys || [])
        .map(normalizeMeasurementKey)
        .filter(Boolean)
    )
  );
  const category = isTemplateScopedCategory(template.category)
    ? template.category
    : "shirt";

  return {
    name: String(template.name || "").trim(),
    category,
    measurementKeys,
    sizes: normalizeTemplateSizes(template.sizes, measurementKeys),
  };
}

function normalizeTemplate(docSnapshot) {
  const data = docSnapshot.data();
  const payload = normalizeTemplatePayload(data);

  return {
    id: docSnapshot.id,
    ...payload,
  };
}

export async function fetchSizeTemplates() {
  const snapshot = await getDocs(sizeTemplatesCollection);
  return snapshot.docs.map(normalizeTemplate);
}

export async function createSizeTemplate(template) {
  const payload = normalizeTemplatePayload(template);
  const newDoc = await addDoc(sizeTemplatesCollection, payload);

  return {
    id: newDoc.id,
    ...payload,
  };
}

export async function editSizeTemplate(id, template) {
  const payload = normalizeTemplatePayload(template);
  await setDoc(doc(sizeTemplatesCollection, String(id)), payload, {
    merge: true,
  });

  return {
    id: String(id),
    ...payload,
  };
}

export async function removeSizeTemplate(id) {
  await deleteDoc(doc(sizeTemplatesCollection, String(id)));
}
