const CATEGORIES = ["All", "Women", "Men", "Kids", "New In", "Sale", "Accessories", "Shoes", "Home & Living"];

export default function CategoryBar({ activeCategory = "All", onCategoryChange }) {
  return (
    <div className="bg-white border-b px-6 py-3 flex gap-6 overflow-x-auto text-sm font-medium sticky top-[68px] z-30 shadow-sm">
      {CATEGORIES.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`relative whitespace-nowrap transition-colors duration-200 pb-1 group
              ${isActive ? "text-black font-bold" : "text-gray-600 hover:text-black"}`}
          >
            {cat}
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-black rounded-full transition-all duration-300
                ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
