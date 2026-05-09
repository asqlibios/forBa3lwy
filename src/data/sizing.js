export const SIZE_TEMPLATE_CATEGORIES = ["shirt", "pants"];

export const SIZE_TEMPLATE_CATEGORY_LABELS = {
  shirt: "Shirts",
  pants: "Pants",
};

export const SIZE_TEMPLATE_CATEGORY_LABELS_AR = {
  shirt: "قمصان",
  pants: "بناطيل",
};

export function isTemplateScopedCategory(value) {
  return SIZE_TEMPLATE_CATEGORIES.includes(value);
}

export function getTemplateCategoryLabel(category, language = "en") {
  if (language === "ar") {
    return SIZE_TEMPLATE_CATEGORY_LABELS_AR[category] || category;
  }

  return SIZE_TEMPLATE_CATEGORY_LABELS[category] || category;
}

export function getProductSizingMode(product) {
  if (isTemplateScopedCategory(product?.sizeTemplateCategory)) {
    return product.sizeTemplateCategory;
  }

  if (product?.category === "Shoes") {
    return "shoes";
  }

  return "default";
}

export function getProductMeasurementKeys(sizes = [], preferredKeys = []) {
  if (preferredKeys.length > 0) {
    return preferredKeys;
  }

  const firstSize = sizes[0];

  if (!firstSize) {
    return [];
  }

  return Object.keys(firstSize).filter((key) => key !== "label");
}
