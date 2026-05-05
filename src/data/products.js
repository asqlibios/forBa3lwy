export const PRODUCT_TRANSLATIONS = {
  1: { nameAr: "قميص كلاسيكي" },
  2: { nameAr: "جاكيت شتوي" },
  3: { nameAr: "فستان صيفي" },
  4: { nameAr: "هودي كاجوال" },
  5: { nameAr: "بنطال ضيق" },
  6: { nameAr: "حذاء رياضي" },
  7: { nameAr: "حقيبة يد" },
  8: { nameAr: "نظارة شمسية" },
  9: { nameAr: "جاكيت جينز" },
  10: { nameAr: "تنورة ماكسي" },
  11: { nameAr: "تيشيرت أطفال" },
  12: { nameAr: "حذاء أطفال" },
  13: { nameAr: "بلوزة مزهرة" },
  14: { nameAr: "حذاء جري" },
  15: { nameAr: "وسادة ديكور" },
  16: { nameAr: "طقم شموع" },
  17: { nameAr: "حزام جلد" },
  18: { nameAr: "تيشيرت وصل حديثا" },
  19: { nameAr: "بوت بسعر مخفض" },
  20: { nameAr: "هودي أطفال" },
  21: { nameAr: "قميص مزخرف بقبعة" },
  22: { nameAr: "تيشيرت راغلان أبيض وأسود" },
  23: { nameAr: "قميص كاروهات رمادي" },
  24: { nameAr: "قميص أسود بأكمام قصيرة" },
  25: { nameAr: "قميص بقبعة رمادي" },
  26: { nameAr: "تيشيرت أسود بطبعة صغيرة" },
  27: { nameAr: "كوب قهوة أسود" },
};

export function getProductDisplayName(product, language = "ar") {
  if (language !== "ar") {
    return product.name;
  }

  return (
    product.nameAr ||
    PRODUCT_TRANSLATIONS[String(product.id)]?.nameAr ||
    product.name
  );
}

export function isOfferProduct(product) {
  return Boolean(product.isOffer || product.tag === "Sale" || product.category === "Sale");
}

export const PRODUCTS = [
  { id: 1, name: "Classic Shirt", nameAr: PRODUCT_TRANSLATIONS[1].nameAr, price: 9.99, img: "https://placehold.co/300x360/f3f4f6/374151?text=Shirt", tag: "Bestseller", category: "Men", isOffer: false },
  { id: 2, name: "Winter Jacket", nameAr: PRODUCT_TRANSLATIONS[2].nameAr, price: 19.99, img: "https://placehold.co/300x360/e0e7ff/3730a3?text=Jacket", tag: "New", category: "Men", isOffer: false },
  { id: 3, name: "Summer Dress", nameAr: PRODUCT_TRANSLATIONS[3].nameAr, price: 14.99, img: "https://placehold.co/300x360/fce7f3/be185d?text=Dress", tag: "Sale", category: "Women", isOffer: true },
  { id: 4, name: "Casual Hoodie", nameAr: PRODUCT_TRANSLATIONS[4].nameAr, price: 24.99, img: "https://placehold.co/300x360/d1fae5/065f46?text=Hoodie", tag: null, category: "Men", isOffer: false },
  { id: 5, name: "Slim Pants", nameAr: PRODUCT_TRANSLATIONS[5].nameAr, price: 17.99, img: "https://placehold.co/300x360/fef3c7/92400e?text=Pants", tag: "Sale", category: "Women", isOffer: true },
  { id: 6, name: "Sneakers", nameAr: PRODUCT_TRANSLATIONS[6].nameAr, price: 34.99, img: "https://placehold.co/300x360/ffe4e6/9f1239?text=Shoes", tag: "New", category: "Shoes", isOffer: false },
  { id: 7, name: "Handbag", nameAr: PRODUCT_TRANSLATIONS[7].nameAr, price: 29.99, img: "https://placehold.co/300x360/f0fdf4/14532d?text=Bag", tag: null, category: "Accessories", isOffer: false },
  { id: 8, name: "Sunglasses", nameAr: PRODUCT_TRANSLATIONS[8].nameAr, price: 12.99, img: "https://placehold.co/300x360/ede9fe/4c1d95?text=Glasses", tag: "Bestseller", category: "Accessories", isOffer: false },
  { id: 9, name: "Denim Jacket", nameAr: PRODUCT_TRANSLATIONS[9].nameAr, price: 27.99, img: "https://placehold.co/300x360/dbeafe/1e40af?text=Denim", tag: "New", category: "Men", isOffer: false },
  { id: 10, name: "Maxi Skirt", nameAr: PRODUCT_TRANSLATIONS[10].nameAr, price: 18.99, img: "https://placehold.co/300x360/fdf2f8/86198f?text=Skirt", tag: "Sale", category: "Women", isOffer: true },
  { id: 11, name: "Kids T-Shirt", nameAr: PRODUCT_TRANSLATIONS[11].nameAr, price: 7.99, img: "https://placehold.co/300x360/fff7ed/c2410c?text=Kids+T", tag: "New", category: "Kids" },
  { id: 12, name: "Kids Shoes", nameAr: PRODUCT_TRANSLATIONS[12].nameAr, price: 15.99, img: "https://placehold.co/300x360/ecfdf5/047857?text=Kids+Sh", tag: null, category: "Kids" },
  { id: 13, name: "Floral Blouse", nameAr: PRODUCT_TRANSLATIONS[13].nameAr, price: 13.99, img: "https://placehold.co/300x360/fdf4ff/a21caf?text=Blouse", tag: "Sale", category: "Women" },
  { id: 14, name: "Running Shoes", nameAr: PRODUCT_TRANSLATIONS[14].nameAr, price: 39.99, img: "https://placehold.co/300x360/f0f9ff/0369a1?text=Run+Sh", tag: "New", category: "Shoes" },
  { id: 15, name: "Throw Pillow", nameAr: PRODUCT_TRANSLATIONS[15].nameAr, price: 11.99, img: "https://placehold.co/300x360/fafaf9/57534e?text=Pillow", tag: null, category: "Home & Living" },
  { id: 16, name: "Candle Set", nameAr: PRODUCT_TRANSLATIONS[16].nameAr, price: 16.99, img: "https://placehold.co/300x360/fffbeb/b45309?text=Candle", tag: "Bestseller", category: "Home & Living" },
  { id: 17, name: "Leather Belt", nameAr: PRODUCT_TRANSLATIONS[17].nameAr, price: 8.99, img: "https://placehold.co/300x360/f5f5f4/292524?text=Belt", tag: null, category: "Accessories" },
  { id: 18, name: "New Arrivals Tee", nameAr: PRODUCT_TRANSLATIONS[18].nameAr, price: 5.99, img: "https://placehold.co/300x360/f0fdf4/166534?text=New+Tee", tag: "New", category: "New In" },
  { id: 19, name: "Sale Boots", nameAr: PRODUCT_TRANSLATIONS[19].nameAr, price: 22.99, img: "https://placehold.co/300x360/fff1f2/be123c?text=Boots", tag: "Sale", category: "Sale" },
  { id: 20, name: "Kids Hoodie", nameAr: PRODUCT_TRANSLATIONS[20].nameAr, price: 12.99, img: "https://placehold.co/300x360/eef2ff/3730a3?text=Kids+H", tag: "Bestseller", category: "Kids" },
  { id: 21, name: "Patterned Hooded Shirt", nameAr: PRODUCT_TRANSLATIONS[21].nameAr, price: 22, img: "/r.jpeg", tag: "New", category: "Men", isOffer: false },
  { id: 22, name: "Black Sleeve Raglan Tee", nameAr: PRODUCT_TRANSLATIONS[22].nameAr, price: 12, img: "/q.jpeg", tag: "New", category: "Men", isOffer: false },
  { id: 23, name: "Gray Plaid Shirt", nameAr: PRODUCT_TRANSLATIONS[23].nameAr, price: 20, img: "/w.jpeg", tag: "New", category: "Men", isOffer: false },
  { id: 24, name: "Black Short Sleeve Shirt", nameAr: PRODUCT_TRANSLATIONS[24].nameAr, price: 16, img: "/m.jpeg", tag: "New", category: "Men", isOffer: false },
  { id: 25, name: "Gray Hooded Shirt", nameAr: PRODUCT_TRANSLATIONS[25].nameAr, price: 24, img: "/n.jpeg", tag: "New", category: "Men", isOffer: false },
  { id: 26, name: "Black Graphic Tee", nameAr: PRODUCT_TRANSLATIONS[26].nameAr, price: 14, img: "/e.jpeg", tag: "New", category: "Men", isOffer: false },
  { id: 27, name: "Black Coffee Tumbler", nameAr: PRODUCT_TRANSLATIONS[27].nameAr, price: 10, img: "/batatVup.jpeg", tag: "New", category: "Accessories", isOffer: false },
];
