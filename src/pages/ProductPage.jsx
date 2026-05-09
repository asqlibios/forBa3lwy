import { useEffect, useState } from "react";
import { getProductDisplayName, isOfferProduct } from "../data/products";
import { TAG_COLORS } from "../data/shop";
import {
  getProductMeasurementKeys,
  getProductSizingMode,
  getTemplateCategoryLabel,
} from "../data/sizing";

const IMAGE_FALLBACK =
  "https://placehold.co/600x750/f3f4f6/374151?text=Product";

const PRODUCT_SPECS = {
  1: {
    sizes: [
      { label: "XS", chest: 84, length: 66, shoulder: 40 },
      { label: "S", chest: 88, length: 68, shoulder: 42 },
      { label: "M", chest: 96, length: 71, shoulder: 44 },
      { label: "L", chest: 104, length: 74, shoulder: 46 },
      { label: "XL", chest: 112, length: 77, shoulder: 48 },
    ],
    material: "100% Cotton",
    fit: "Regular Fit",
    care: "Machine wash 30C",
    origin: "Made in Portugal",
    description:
      "A timeless classic shirt crafted from breathable 100% cotton. Features a button-down collar and chest pocket.",
  },
  2: {
    sizes: [
      { label: "XS", chest: 90, length: 65, shoulder: 41 },
      { label: "S", chest: 96, length: 67, shoulder: 43 },
      { label: "M", chest: 104, length: 70, shoulder: 45 },
      { label: "L", chest: 112, length: 73, shoulder: 47 },
      { label: "XL", chest: 120, length: 76, shoulder: 49 },
    ],
    material: "Shell: 100% Polyester / Lining: 80% Down",
    fit: "Relaxed Fit",
    care: "Dry clean only",
    origin: "Made in China",
    description:
      "Stay warm without sacrificing style. This winter jacket features a quilted down lining and wind-resistant outer shell.",
  },
  3: {
    sizes: [
      { label: "XS", chest: 80, length: 88, shoulder: 36 },
      { label: "S", chest: 84, length: 91, shoulder: 37 },
      { label: "M", chest: 92, length: 94, shoulder: 39 },
      { label: "L", chest: 100, length: 97, shoulder: 41 },
      { label: "XL", chest: 108, length: 100, shoulder: 43 },
    ],
    material: "95% Viscose, 5% Elastane",
    fit: "Flowy Fit",
    care: "Hand wash cold",
    origin: "Made in Turkey",
    description:
      "Light and breezy summer dress with a floral silhouette. The viscose blend drapes beautifully and keeps you cool.",
  },
  4: {
    sizes: [
      { label: "XS", chest: 92, length: 64, shoulder: 43 },
      { label: "S", chest: 98, length: 66, shoulder: 45 },
      { label: "M", chest: 106, length: 69, shoulder: 47 },
      { label: "L", chest: 114, length: 72, shoulder: 49 },
      { label: "XL", chest: 122, length: 75, shoulder: 51 },
    ],
    material: "80% Cotton, 20% Polyester",
    fit: "Oversized Fit",
    care: "Machine wash 40C",
    origin: "Made in Bangladesh",
    description:
      "Ultra-soft fleece-lined hoodie for comfort. Features a kangaroo pocket and adjustable drawstring hood.",
  },
  5: {
    sizes: [
      { label: "XS", waist: 64, hip: 88, inseam: 76 },
      { label: "S", waist: 68, hip: 92, inseam: 77 },
      { label: "M", waist: 74, hip: 98, inseam: 78 },
      { label: "L", waist: 80, hip: 104, inseam: 79 },
      { label: "XL", waist: 86, hip: 110, inseam: 80 },
    ],
    material: "98% Cotton, 2% Elastane",
    fit: "Slim Fit",
    care: "Machine wash 30C",
    origin: "Made in Portugal",
    description:
      "Modern slim-cut trousers with a hint of stretch for ease of movement.",
  },
  6: {
    sizes: [
      { label: "EU 36", length: 23.0, width: 8.8 },
      { label: "EU 37", length: 23.7, width: 9.0 },
      { label: "EU 38", length: 24.3, width: 9.2 },
      { label: "EU 39", length: 25.0, width: 9.5 },
      { label: "EU 40", length: 25.7, width: 9.7 },
      { label: "EU 41", length: 26.3, width: 10.0 },
      { label: "EU 42", length: 27.0, width: 10.2 },
    ],
    material: "Upper: Leather / Sole: Rubber",
    fit: "True to size",
    care: "Wipe with damp cloth",
    origin: "Made in Vietnam",
    description:
      "Clean and versatile low-top sneakers with a cushioned insole and durable leather upper.",
  },
  7: {
    sizes: [{ label: "One Size", width: 30, height: 22, depth: 12 }],
    material: "PU Leather / Canvas Lining",
    fit: "Adjustable strap: 60-120 cm",
    care: "Wipe with dry cloth",
    origin: "Made in Italy",
    description:
      "Structured everyday handbag with a spacious compartment and secure magnetic clasp closure.",
  },
  8: {
    sizes: [{ label: "One Size", lens: 5.2, bridge: 1.8, arm: 14.5 }],
    material: "Frame: Acetate / Lens: UV400 Polycarbonate",
    fit: "Medium face fit",
    care: "Use microfibre cloth",
    origin: "Made in Italy",
    description:
      "Timeless square-frame sunglasses with full UV400 protection and lightweight construction.",
  },
  9: {
    sizes: [
      { label: "XS", chest: 88, length: 55, shoulder: 40 },
      { label: "S", chest: 94, length: 57, shoulder: 42 },
      { label: "M", chest: 102, length: 60, shoulder: 44 },
      { label: "L", chest: 110, length: 63, shoulder: 46 },
      { label: "XL", chest: 118, length: 66, shoulder: 48 },
    ],
    material: "100% Cotton Denim (12 oz)",
    fit: "Regular Fit",
    care: "Machine wash cold, inside out",
    origin: "Made in Mexico",
    description:
      "Classic raw-edge denim jacket with brass button closures and a versatile medium wash finish.",
  },
  10: {
    sizes: [
      { label: "XS", waist: 62, hip: 86, length: 98 },
      { label: "S", waist: 66, hip: 90, length: 100 },
      { label: "M", waist: 72, hip: 96, length: 102 },
      { label: "L", waist: 78, hip: 102, length: 104 },
      { label: "XL", waist: 84, hip: 108, length: 106 },
    ],
    material: "100% Satin Polyester",
    fit: "High-waist, Flared",
    care: "Hand wash cold, do not tumble dry",
    origin: "Made in Turkey",
    description:
      "Elegant floor-length satin skirt with a subtle sheen and fluid silhouette.",
  },
};

const PRODUCT_SPEC_TRANSLATIONS = {
  1: {
    material: "قطن 100%",
    fit: "قصة عادية",
    care: "غسيل آلي على 30 درجة",
    origin: "صنع في البرتغال",
    description:
      "قميص كلاسيكي بتصميم عملي مصنوع من قطن ناعم يسمح بالتهوية، مع ياقة بأزرار وجيب أمامي.",
  },
  2: {
    material: "الخارج: بوليستر 100% / البطانة: زغب 80%",
    fit: "قصة واسعة",
    care: "تنظيف جاف فقط",
    origin: "صنع في الصين",
    description:
      "جاكيت شتوي دافئ يجمع بين الراحة والأناقة، ببطانة مبطنة وهيكل خارجي مقاوم للرياح.",
  },
  3: {
    material: "فيسكوز 95%، إيلاستان 5%",
    fit: "قصة انسيابية",
    care: "غسيل يدوي بماء بارد",
    origin: "صنع في تركيا",
    description:
      "فستان صيفي خفيف بطابع زهري، بقماش فيسكوز ينسدل بنعومة ويمنحك إحساسا منعشا.",
  },
  4: {
    material: "قطن 80%، بوليستر 20%",
    fit: "قصة واسعة",
    care: "غسيل آلي على 40 درجة",
    origin: "صنع في بنغلاديش",
    description:
      "هودي مبطن بالفليس شديد النعومة للراحة اليومية، مع جيب أمامي ورباط قابل للتعديل.",
  },
  5: {
    material: "قطن 98%، إيلاستان 2%",
    fit: "قصة ضيقة",
    care: "غسيل آلي على 30 درجة",
    origin: "صنع في البرتغال",
    description:
      "بنطال بقصة عصرية ضيقة مع نسبة تمدد خفيفة تمنحك حركة أسهل طوال اليوم.",
  },
  6: {
    material: "الجزء العلوي: جلد / النعل: مطاط",
    fit: "مطابق للمقاس",
    care: "يمسح بقطعة قماش رطبة",
    origin: "صنع في فيتنام",
    description:
      "حذاء رياضي منخفض بتصميم بسيط وسهل التنسيق، مع نعل داخلي مريح وجلد متين.",
  },
  7: {
    material: "جلد صناعي / بطانة قماشية",
    fit: "حزام قابل للتعديل: 60-120 سم",
    care: "يمسح بقطعة قماش جافة",
    origin: "صنع في إيطاليا",
    description:
      "حقيبة يد يومية بتصميم ثابت ومساحة داخلية واسعة وإغلاق مغناطيسي آمن.",
  },
  8: {
    material: "الإطار: أسيتات / العدسات: بولي كربونات UV400",
    fit: "مناسبة للوجه المتوسط",
    care: "تستخدم قطعة قماش مايكروفايبر",
    origin: "صنع في إيطاليا",
    description:
      "نظارة شمسية مربعة كلاسيكية توفر حماية UV400 كاملة مع تصميم خفيف ومريح.",
  },
  9: {
    material: "دينم قطني 100% (12 أونصة)",
    fit: "قصة عادية",
    care: "غسيل آلي بارد من الداخل للخارج",
    origin: "صنع في المكسيك",
    description:
      "جاكيت جينز كلاسيكي بحواف خام وأزرار معدنية ولمسة لون متوسطة سهلة التنسيق.",
  },
  10: {
    material: "ساتان بوليستر 100%",
    fit: "خصر عال وقصة واسعة",
    care: "غسيل يدوي بارد، بدون تجفيف آلي",
    origin: "صنع في تركيا",
    description:
      "تنورة ساتان طويلة بلمعة ناعمة وقصة انسيابية تضيف لمسة أنيقة للإطلالة.",
  },
};

const SPEC_KEYS = {
  chest: "Chest",
  length: "Length",
  shoulder: "Shoulder",
  waist: "Waist",
  hip: "Hip",
  inseam: "Inseam",
  width: "Width",
  height: "Height",
  depth: "Depth",
  lens: "Lens Width",
  bridge: "Bridge",
  arm: "Arm Length",
};

const TEXT = {
  ar: {
    back: "العودة للمتجر",
    inCart: "في السلة",
    material: "الخامة",
    fit: "القياس",
    care: "العناية",
    selectSize: "اختر المقاس",
    selectSizeHint: "يرجى اختيار المقاس",
    sizeChart: "جدول المقاسات (سم)",
    size: "المقاس",
    measurementsHint: "كل القياسات بالسنتيمتر. اضغط على السطر لاختيار المقاس.",
    total: "الإجمالي",
    addToCart: "أضف إلى السلة",
    addedToCart: "تمت الإضافة إلى السلة",
    notAvailable: "غير متوفر",
    tags: {
      Bestseller: "الأكثر طلبًا",
      New: "جديد",
      Sale: "عرض",
    },
  },
  en: {
    back: "Back to Shop",
    inCart: "In Cart",
    material: "Material",
    fit: "Fit",
    care: "Care",
    selectSize: "Select Size",
    selectSizeHint: "Please select a size",
    sizeChart: "Size Chart (cm)",
    size: "Size",
    measurementsHint:
      "All measurements are in centimeters. Click a row to select that size.",
    total: "total",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart!",
    notAvailable: "N/A",
    tags: {
      Bestseller: "Bestseller",
      New: "New",
      Sale: "Sale",
    },
  },
};

const SPEC_KEY_LABELS = {
  ar: {
    chest: "الصدر",
    length: "الطول",
    shoulder: "الكتف",
    waist: "الخصر",
    hip: "الأرداف",
    inseam: "طول الساق",
    width: "العرض",
    height: "الارتفاع",
    depth: "العمق",
    lens: "عرض العدسة",
    bridge: "الجسر",
    arm: "طول الذراع",
  },
  en: SPEC_KEYS,
};

export default function ProductPage({
  product,
  sizeTemplates = [],
  onBack,
  addToCart,
  inCart,
  language = "ar",
}) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [visible, setVisible] = useState(false);
  const copy = TEXT[language] || TEXT.ar;
  const specLabels = SPEC_KEY_LABELS[language] || SPEC_KEY_LABELS.ar;
  const productName = getProductDisplayName(product, language);
  const displayTag = isOfferProduct(product) ? "Sale" : product.tag;
  const sizingMode = getProductSizingMode(product);
  const linkedTemplate = sizeTemplates.find(
    (template) => String(template.id) === String(product.sizeTemplateId)
  );

  const baseSpecs = PRODUCT_SPECS[product.id] || {
    sizes: [{ label: "One Size" }],
    material: copy.notAvailable,
    fit: copy.notAvailable,
    care: copy.notAvailable,
    origin: copy.notAvailable,
    description: productName,
  };
  const specs =
    language === "ar"
      ? { ...baseSpecs, ...PRODUCT_SPEC_TRANSLATIONS[String(product.id)] }
      : baseSpecs;
  const resolvedSizes =
    sizingMode === "shirt" || sizingMode === "pants"
      ? linkedTemplate?.sizes?.length
        ? linkedTemplate.sizes
        : baseSpecs.sizes
      : specs.sizes;
  const sizeKeys = getProductMeasurementKeys(
    resolvedSizes,
    linkedTemplate?.measurementKeys || []
  );
  const requiresSizeSelection = resolvedSizes.length > 1;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setSelectedSize(null);
    setQty(1);
    setAdded(false);
  }, [product.id]);

  const handleBack = () => {
    setVisible(false);
    setTimeout(onBack, 300);
  };

  const handleAdd = () => {
    if (!selectedSize && requiresSizeSelection) return;
    addToCart({ ...product, size: selectedSize || resolvedSizes[0]?.label }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-5 text-sm text-gray-500">
        <button
          onClick={handleBack}
          className="group flex items-center gap-1.5 font-medium transition-colors duration-150 hover:text-black"
        >
          <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">
            {language === "ar" ? "→" : "←"}
          </span>
          {copy.back}
        </button>
        <span>/</span>
        <span className="font-semibold text-black">{productName}</span>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-20 md:grid-cols-2">
        <div className="relative">
          <div
            className="overflow-hidden rounded-2xl bg-gray-100 shadow-lg"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src={product.img}
              alt={productName}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = IMAGE_FALLBACK;
              }}
              className="h-full w-full object-cover"
            />
          </div>
          {displayTag && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-bold text-white ${TAG_COLORS[displayTag]}`}
            >
              {copy.tags[displayTag] || displayTag}
            </span>
          )}
          {inCart && (
            <span className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white">
              {`✓ ${copy.inCart}`}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6 py-2">
          <div>
            <p className="mb-1 text-xs font-bold tracking-widest text-gray-400">
              {specs.origin}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
              {productName}
            </h1>
            <p className="mt-2 text-3xl font-bold text-red-500">
              SAR {product.price.toFixed(2)}
            </p>
          </div>

          <p className="leading-relaxed text-gray-600">{specs.description}</p>

          {(sizingMode === "shirt" || sizingMode === "pants") && linkedTemplate && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <span className="font-semibold">Template:</span> {linkedTemplate.name}
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold">Category:</span>{" "}
              {getTemplateCategoryLabel(linkedTemplate.category, language)}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🧵", label: copy.material, value: specs.material },
              { icon: "👕", label: copy.fit, value: specs.fit },
              { icon: "🫧", label: copy.care, value: specs.care },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center"
              >
                <div className="mb-1 text-xl">{icon}</div>
                <p className="text-xs font-semibold tracking-wide text-gray-400">
                  {label}
                </p>
                <p className="mt-0.5 text-xs font-medium leading-snug text-gray-700">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold tracking-wide">{copy.selectSize}</p>
              {requiresSizeSelection && !selectedSize && (
                <p className="text-xs font-medium text-red-400">
                  {copy.selectSizeHint}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {resolvedSizes.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s.label)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                    selectedSize === s.label
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {sizeKeys.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-bold tracking-wide">
                {copy.sizeChart}
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold tracking-wide text-gray-400">
                      <th className="px-4 py-3 text-left">{copy.size}</th>
                      {sizeKeys.map((k) => (
                        <th key={k} className="px-4 py-3 text-center">
                          {specLabels[k] || k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedSizes.map((s, i) => (
                      <tr
                        key={s.label}
                        onClick={() => setSelectedSize(s.label)}
                        className={`cursor-pointer border-t border-gray-50 transition-colors duration-100 ${
                          selectedSize === s.label
                            ? "bg-black text-white"
                            : i % 2 === 0
                            ? "bg-white hover:bg-gray-50"
                            : "bg-gray-50/50 hover:bg-gray-100"
                        }`}
                      >
                        <td className="px-4 py-3 font-bold">{s.label}</td>
                        {sizeKeys.map((k) => (
                          <td key={k} className="px-4 py-3 text-center">
                            {s[k]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                * {copy.measurementsHint}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center overflow-hidden rounded-xl border-2 border-gray-200">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-xl font-bold transition-colors duration-150 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center text-xl font-bold transition-colors duration-150 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-sm font-medium text-gray-400">
              SAR {(product.price * qty).toFixed(2)} {copy.total}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={requiresSizeSelection && !selectedSize}
            className={`w-full rounded-2xl py-4 text-base font-extrabold tracking-wide transition-all duration-200 ${
              added
                ? "scale-95 bg-green-500 text-white"
                : requiresSizeSelection && !selectedSize
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-black text-white hover:scale-[1.02] hover:bg-gray-800 active:scale-95"
            }`}
          >
            {added ? `✓ ${copy.addedToCart}` : copy.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
