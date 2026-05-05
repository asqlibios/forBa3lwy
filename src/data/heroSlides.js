export const HERO_BACKGROUNDS = [
  { value: "from-pink-500 to-orange-400", label: "Pink / Orange" },
  { value: "from-sky-500 to-indigo-500", label: "Sky / Indigo" },
  { value: "from-emerald-500 to-teal-400", label: "Emerald / Teal" },
  { value: "from-red-500 to-rose-500", label: "Red / Rose" },
  { value: "from-amber-500 to-red-500", label: "Amber / Red" },
  { value: "from-gray-900 to-gray-600", label: "Black / Gray" },
];

export const DEFAULT_HERO_SLIDES = [
  {
    id: "default-1",
    title: "#MothersDay",
    titleAr: "#عروض_الأمهات",
    subtitle: "Top picks this week",
    subtitleAr: "أكثر القطع طلبا هذا الأسبوع",
    buttonText: "Shop Now",
    buttonTextAr: "تسوق الآن",
    bg: "from-pink-500 to-orange-400",
    productIds: [],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "default-2",
    title: "#SummerVibes",
    titleAr: "#صيف_أنيق",
    subtitle: "New arrivals every day",
    subtitleAr: "وصل جديد كل يوم",
    buttonText: "Explore New In",
    buttonTextAr: "اكتشف الجديد",
    bg: "from-sky-500 to-indigo-500",
    productIds: [],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "default-3",
    title: "#CuratedStyle",
    titleAr: "#أزياء_مختارة",
    subtitle: "Up to 80% off",
    subtitleAr: "خصومات تصل إلى 80%",
    buttonText: "View Offers",
    buttonTextAr: "شاهد العروض",
    bg: "from-emerald-500 to-teal-400",
    productIds: [],
    isActive: true,
    sortOrder: 3,
  },
];

export function getHeroSlideCopy(slide, language = "ar") {
  if (language === "ar") {
    return {
      title: slide.titleAr || slide.title || "",
      subtitle: slide.subtitleAr || slide.subtitle || "",
      buttonText: slide.buttonTextAr || slide.buttonText || "",
    };
  }

  return {
    title: slide.title || slide.titleAr || "",
    subtitle: slide.subtitle || slide.subtitleAr || "",
    buttonText: slide.buttonText || slide.buttonTextAr || "",
  };
}
