import { PRODUCTS } from "../data/products";

const TAG_COLORS = {
  Bestseller: "bg-orange-500",
  New:        "bg-blue-500",
  Sale:       "bg-red-500",
};

export default function Products({
  cart,
  onProductClick,
  activeCategory = "All",
  products = PRODUCTS,
}) {
  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const inCart = (id) => cart.some((i) => i.id === id);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight">
          {activeCategory === "All" ? "Featured Products" : activeCategory}
        </h2>
        <span className="text-sm text-gray-400">{filtered.length} items</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-lg font-medium">No products in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onProductClick(p)}
              className="group cursor-pointer text-left bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full object-cover h-64 transition-transform duration-500 group-hover:scale-105"
                />

                {p.tag && (
                  <span className={`absolute top-2 left-2 ${TAG_COLORS[p.tag]} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                    {p.tag}
                  </span>
                )}

                {inCart(p.id) && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    ✓ In Cart
                  </span>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                    View Product
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p className="font-semibold text-base truncate">{p.name}</p>
                <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                <p className="text-red-500 font-bold text-lg">${p.price.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
