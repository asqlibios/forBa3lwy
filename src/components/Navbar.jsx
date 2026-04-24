import { useState } from "react";
import Cart from "../pages/Cart";

export default function Navbar({ cart = [] }) {
  const [openCart, setOpenCart] = useState(false);

  return (
    <>
      <nav className="bg-black text-white px-6 py-4 flex justify-between">
        <h1 className="text-2xl font-bold">شبس</h1>

        <div className="flex gap-6 items-center">
          <button onClick={() => setOpenCart(true)}>
            🛒 {cart.length}
          </button>
        </div>
      </nav>

      {openCart && (
        <Cart cart={cart} onClose={() => setOpenCart(false)} />
      )}
    </>
  );
}