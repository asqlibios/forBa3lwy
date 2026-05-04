import { SHOP_CATEGORIES, getCategoryLabels } from "../data/shop";

export default function CategoryBar({
  activeCategory = "All",
  onCategoryChange,
  language = "ar",
}) {
  const labels = getCategoryLabels(language);

  return (
    <div className="sticky top-[68px] z-30 flex gap-6 overflow-x-auto border-b bg-white px-6 py-3 text-sm font-medium shadow-sm">
      {SHOP_CATEGORIES.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`group relative whitespace-nowrap pb-1 transition-colors duration-200 ${
              isActive ? "font-bold text-black" : "text-gray-600 hover:text-black"
            }`}
          >
            {labels[category] || category}
            <span
              className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-black transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
