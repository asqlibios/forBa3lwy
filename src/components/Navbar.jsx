import { useState } from "react";
import Cart from "../pages/Cart";

export default function Navbar({
  cart = [],
  removeFromCart,
  updateQty,
  clearCart,
  language = "ar",
  onLanguageChange,
  searchTerm = "",
  onSearchChange,
}) {
  const [openCart, setOpenCart] = useState(false);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <nav
        className="sticky top-0 z-40 flex flex-wrap items-center gap-4 bg-black px-6 py-4 text-white"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        dir="ltr"
      >
        <h1
          className="shrink-0 text-2xl font-bold tracking-widest uppercase"
          style={{ letterSpacing: "0.2em" }}
        >
          SHOP
        </h1>

        <div className="min-w-[220px] flex-1 sm:min-w-[280px]">
          <label className="group relative block">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange?.(event.target.value)}
              aria-label={language === "ar" ? "البحث في المنتجات" : "Search products"}
              placeholder={
                language === "ar"
                  ? "ابحث بالاسم أو القسم"
                  : "Search by name or category"
              }
              dir={language === "ar" ? "rtl" : "ltr"}
              className="h-11 w-full rounded-full border border-white/15 bg-white/10 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/35 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/14 hover:shadow-[0_10px_24px_rgba(255,255,255,0.08)] focus:-translate-y-0.5 focus:border-white/55 focus:bg-white/16 focus:shadow-[0_14px_30px_rgba(255,255,255,0.12)]"
              style={{
                paddingLeft: language === "ar" ? "1rem" : "3rem",
                paddingRight: language === "ar" ? "3rem" : "1rem",
              }}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-base text-white/60 transition-all duration-300 group-hover:scale-110 group-hover:text-white group-focus-within:scale-110 group-focus-within:text-white ${
                language === "ar" ? "right-4" : "left-4"
              }`}
            >
              ⌕
            </span>
          </label>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center rounded-full bg-white/10 p-1">
            <button
              type="button"
              onClick={() => onLanguageChange?.("ar")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                language === "ar"
                  ? "bg-white text-black"
                  : "text-white/75 hover:text-white"
              }`}
            >
              AR
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange?.("en")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                language === "en"
                  ? "bg-white text-black"
                  : "text-white/75 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setOpenCart(true)}
            className="relative flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95"
          >
            <span aria-hidden="true">🛒</span>
            <span>{language === "ar" ? "السلة" : "Cart"}</span>
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                style={{ animation: "pop 0.3s ease" }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0); }
          70% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>

      {openCart && (
        <Cart
          cart={cart}
          onClose={() => setOpenCart(false)}
          removeFromCart={removeFromCart}
          updateQty={updateQty}
          clearCart={clearCart}
          language={language}
        />
      )}
    </>
  );
}
