import { PRODUCTS, getProductDisplayName, isOfferProduct } from "../data/products";
import { TAG_COLORS, getCategoryLabels, getTagLabels } from "../data/shop";

const IMAGE_FALLBACK =
  "https://placehold.co/300x360/f3f4f6/374151?text=Product";

export default function Products({
  cart,
  onProductClick,
  activeCategory = "All",
  products = PRODUCTS,
  isLoading = false,
  language = "ar",
  searchTerm = "",
  searchCategories = ["All"],
  searchCategory = "All",
  onSearchCategoryChange,
  sortOption = "relevance",
  onSortOptionChange,
}) {
  const inCart = (id) => cart.some((item) => String(item.id) === String(id));
  const categoryLabels = getCategoryLabels(language);
  const tagLabels = getTagLabels(language);
  const hasSearch = searchTerm.trim().length > 0;
  const sortLabels = {
    relevance: language === "ar" ? "الأقرب" : "Relevance",
    "price-asc": language === "ar" ? "السعر: الأقل أولًا" : "Price: Low to High",
    "price-desc":
      language === "ar" ? "السعر: الأعلى أولًا" : "Price: High to Low",
    newest: language === "ar" ? "الأحدث" : "Newest",
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {hasSearch
              ? language === "ar"
                ? "نتائج البحث"
                : "Search Results"
              : activeCategory === "All"
                ? language === "ar"
                  ? "منتجات مميزة"
                  : "Featured Products"
                : categoryLabels[activeCategory] || activeCategory}
          </h2>
          {hasSearch && (
            <p className="mt-1 text-sm text-gray-500">
              {language === "ar"
                ? `بحثت عن: "${searchTerm}"`
                : `Showing matches for "${searchTerm}"`}
            </p>
          )}
        </div>
        <span className="shrink-0 text-sm text-gray-400">
          {products.length} {language === "ar" ? "منتج" : "items"}
        </span>
      </div>

      {hasSearch && (
        <div
          className={`mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 sm:flex-row sm:items-center ${
            language === "ar" ? "sm:justify-end" : "sm:justify-start"
          }`}
          style={{
            opacity: 1,
            transform: "translateY(0)",
            animation: "searchToolsIn 0.28s ease",
          }}
        >
          <div
            className={`flex flex-wrap items-center gap-2 ${
              language === "ar" ? "sm:order-2 sm:justify-end" : "sm:order-1"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              {language === "ar" ? "التصنيفات" : "Categories"}
            </span>
            {searchCategories.map((category) => {
              const isActive = category === searchCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSearchCategoryChange?.(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-black"
                  }`}
                >
                  {categoryLabels[category] || category}
                </button>
              );
            })}
          </div>

          <div
            className={`flex items-center gap-3 ${
              language === "ar" ? "sm:order-1" : "sm:order-2"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              {language === "ar" ? "الترتيب" : "Sort By"}
            </span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(event) => onSortOptionChange?.(event.target.value)}
                className="min-w-[180px] appearance-none rounded-full border border-gray-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus:-translate-y-0.5 focus:border-black focus:shadow-lg"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400 transition-transform duration-200">
                ▾
              </span>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-24 text-center text-gray-400">
          <p className="text-lg font-medium">
            {language === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center text-gray-400">
          <p className="text-lg font-medium">
            {hasSearch
              ? language === "ar"
                ? "لم نجد منتجات تطابق بحثك."
                : "No products matched your search."
              : language === "ar"
                ? "لا توجد منتجات في هذا القسم بعد."
                : "No products in this category yet."}
          </p>
          {hasSearch && (
            <p className="mt-3 text-sm text-gray-500">
              {language === "ar"
                ? "جرّب اسم منتج أو قسم آخر."
                : "Try another product name or category."}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product, index) => {
            const productName = getProductDisplayName(product, language);
            const displayTag = isOfferProduct(product) ? "Sale" : product.tag;

            return (
            <button
              key={product.id}
              type="button"
              onClick={() => onProductClick(product)}
              className="group cursor-pointer overflow-hidden rounded-xl bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.img}
                  alt={productName}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = IMAGE_FALLBACK;
                  }}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
                />

                {displayTag && (
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold text-white ${TAG_COLORS[displayTag]}`}
                  >
                    {tagLabels[displayTag] || displayTag}
                  </span>
                )}

                {inCart(product.id) && (
                  <span className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                    {language === "ar" ? "في السلة" : "In Cart"}
                  </span>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
                  <span className="rounded-lg bg-black/60 px-4 py-2 text-sm font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    {language === "ar" ? "عرض المنتج" : "View Product"}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <p className="truncate text-sm font-semibold sm:text-base">{productName}</p>
                <p className="mb-1 text-xs text-gray-400">
                  {categoryLabels[product.category] || product.category}
                </p>
                <p className="text-base font-bold text-red-500 sm:text-lg">
                  SAR {product.price.toFixed(2)}
                </p>
              </div>
            </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes searchToolsIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
