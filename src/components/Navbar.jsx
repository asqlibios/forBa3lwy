import { useState } from "react";
import Cart from "../pages/Cart";

export default function Navbar({ cart = [], removeFromCart, updateQty }) {
  const [openCart, setOpenCart] = useState(false);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <nav
        className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-40"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
      >
        <h1
          className="text-2xl font-bold tracking-widest uppercase"
          style={{ letterSpacing: "0.2em" }}
        >
          SHOP
        </h1>

        <div className="flex gap-6 items-center">
          {["Women", "Men", "Kids"].map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm hidden md:block text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <button
            onClick={() => setOpenCart(true)}
            className="relative flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold
                       transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
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
        />
      )}
    </>
  );
}
