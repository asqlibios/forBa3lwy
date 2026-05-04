export const SHOP_CATEGORIES = [
  "All",
  "Women",
  "Men",
  "Kids",
  "New In",
  "Sale",
  "Accessories",
  "Shoes",
  "Home & Living",
];

export const PRODUCT_CATEGORIES = SHOP_CATEGORIES.filter(
  (category) => category !== "All"
);

export const PRODUCT_TAGS = ["", "Bestseller", "New", "Sale"];

export const TAG_COLORS = {
  Bestseller: "bg-orange-500",
  New: "bg-blue-500",
  Sale: "bg-red-500",
};

export const CATEGORY_LABELS = {
  ar: {
    All: "الكل",
    Women: "نسائي",
    Men: "رجالي",
    Kids: "أطفال",
    "New In": "وصل حديثًا",
    Sale: "عروض",
    Accessories: "إكسسوارات",
    Shoes: "أحذية",
    "Home & Living": "المنزل والمعيشة",
  },
  en: {
    All: "All",
    Women: "Women",
    Men: "Men",
    Kids: "Kids",
    "New In": "New In",
    Sale: "Sale",
    Accessories: "Accessories",
    Shoes: "Shoes",
    "Home & Living": "Home & Living",
  },
};

export const TAG_LABELS = {
  ar: {
    Bestseller: "الأكثر طلبًا",
    New: "جديد",
    Sale: "عرض",
  },
  en: {
    Bestseller: "Bestseller",
    New: "New",
    Sale: "Sale",
  },
};

export function normalizeSearchText(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function getCategoryLabels(language = "ar") {
  return CATEGORY_LABELS[language] || CATEGORY_LABELS.ar;
}

export function getTagLabels(language = "ar") {
  return TAG_LABELS[language] || TAG_LABELS.ar;
}

export function productMatchesQuery(product, query) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableFields = [
    product.name,
    product.nameAr,
    product.title,
    product.titleAr,
    product.description,
    product.descriptionAr,
    product.category,
    CATEGORY_LABELS.ar[product.category],
    CATEGORY_LABELS.en[product.category],
    product.tag,
    TAG_LABELS.ar[product.tag],
    TAG_LABELS.en[product.tag],
  ];

  return searchableFields.some((field) =>
    normalizeSearchText(field).includes(normalizedQuery)
  );
}
