import { useState } from "react";
import { PRODUCTS, getProductDisplayName, isOfferProduct } from "../data/products";
import { TAG_COLORS, getCategoryLabels, getTagLabels } from "../data/shop";

const IMAGE_FALLBACK =
  "https://placehold.co/300x360/f3f4f6/374151?text=Product";

const FEATURED_TAGS = ["Sale", "New", "Bestseller"];

function normalizeTag(tag) {
  if (!tag) return "";
  const value = String(tag).toLowerCase();

  if (value === "sale") return "Sale";
  if (value === "new") return "New";
  if (value === "bestseller" || value === "bestsellers" || value === "bestSellers".toLowerCase()) {
    return "Bestseller";
  }

  return tag;
}

function getArabicTagLabel(tag) {
  const labels = {
    Sale: "العروض",
    New: "وصل حديثًا",
    Bestseller: "الأكثر مبيعًا",
  };

  return labels[tag] || tag;
}

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
  const [expandedTags, setExpandedTags] = useState({});

  const inCart = (id) => cart.some((item) => String(item.id) === String(id));
  const categoryLabels = getCategoryLabels(language);
  const tagLabels = getTagLabels(language);
  const hasSearch = searchTerm.trim().length > 0;

  const sortLabels = {
    relevance: language === "ar" ? "الأقرب" : "Relevance",
    "price-asc": language === "ar" ? "السعر: الأقل أولًا" : "Price: Low to High",
    "price-desc": language === "ar" ? "السعر: الأعلى أولًا" : "Price: High to Low",
    newest: language === "ar" ? "الأحدث" : "Newest",
  };

  const shouldGroupByTags = !hasSearch && activeCategory === "All";

  const productGroups = FEATURED_TAGS.map((tag) => {
    const items = products.filter((product) => {
      if (tag === "Sale") return isOfferProduct(product);
      return normalizeTag(product.tag) === tag;
    });

    return { tag, items };
  }).filter((group) => group.items.length > 0);

  const renderProductCard = (product, index, extraClassName = "") => {
    const productName = getProductDisplayName(product, language);
    const displayTag = isOfferProduct(product) ? "Sale" : normalizeTag(product.tag);

    return (
      <button
        key={product.id}
        type="button"
        onClick={() => onProductClick(product)}
        className={`group cursor-pointer overflow-hidden rounded-xl bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${extraClassName}`}
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
              className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold text-white ${TAG_COLORS[displayTag] || "bg-black"}`}
            >
              {language === "ar"
                ? getArabicTagLabel(displayTag)
                : tagLabels[displayTag] || displayTag}
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
            SAR {Number(product.price).toFixed(2)}
          </p>
        </div>
      </button>
    );
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
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              {language === "ar" ? "التصنيفات" : "Categories"}
            </span>
            {searchCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onSearchCategoryChange?.(category)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  category === searchCategory
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
                }`}
              >
                {categoryLabels[category] || category}
              </button>
            ))}
          </div>

          <select
            value={sortOption}
            onChange={(event) => onSortOptionChange?.(event.target.value)}
            className="min-w-[180px] rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 outline-none"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
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
        </div>
      ) : shouldGroupByTags ? (
        <div className="space-y-12">
          {productGroups.map(({ tag, items }) => {
            const isExpanded = expandedTags[tag];
            const visibleItems = isExpanded ? items : items.slice(0, 5);
            const hasMore = items.length > 5;

            return (
              <section key={tag}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                      {language === "ar" ? "منتجات مشابهة" : "Similar Products"}
                    </p>
                    <h3 className="text-xl font-extrabold">
                      {language === "ar" ? getArabicTagLabel(tag) : tagLabels[tag] || tag}
                    </h3>
                  </div>

                  {hasMore && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTags((prev) => ({
                          ...prev,
                          [tag]: !prev[tag],
                        }))
                      }
                      className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
                    >
                      {isExpanded
                        ? language === "ar"
                          ? "عرض أقل"
                          : "Show Less"
                        : language === "ar"
                          ? "عرض المزيد"
                          : "Show More"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
                  {visibleItems.map((product, index) =>
                    renderProductCard(
                      product,
                      index,
                      !isExpanded && index >= 2 ? "hidden sm:block" : ""
                    )
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product, index) => renderProductCard(product, index))}
        </div>
      )}
    </div>
  );
}
