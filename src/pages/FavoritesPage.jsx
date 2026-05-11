const COPY = {
  ar: {
    title: "المفضلة",
    subtitle: "هنا بتظهر المنتجات اللي تحفظها لاحقًا.",
    empty: "ما عندك منتجات مفضلة إلى الآن.",
  },
  en: {
    title: "Favorites",
    subtitle: "Saved products will appear here later.",
    empty: "You do not have any favorite products yet.",
  },
};

export default function FavoritesPage({ language = "ar" }) {
  const copy = COPY[language] || COPY.en;

  return (
    <div
      className="min-h-screen bg-[#faf8f5] px-4 py-10"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
            {copy.title}
          </p>
          <h1 className="mt-3 text-3xl font-black text-gray-900">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm text-gray-500">{copy.subtitle}</p>
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-sm text-gray-500">
            {copy.empty}
          </div>
        </div>
      </div>
    </div>
  );
}
