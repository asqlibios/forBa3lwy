import { useState } from "react";

import Navbar from "./components/navbar";
import CategoryBar from "./components/CategoryBar";
import Hero from "./components/Hero";
import Products from "./components/Product";
import Footer from "./components/Footer";

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product, qty) => {
    const exists = cart.find((i) => i.id === product.id);

    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      );
    } else {
      setCart([...cart, { ...product, qty }]);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar cart={cart} />
      <CategoryBar />
      <Hero />
      <Products cart={cart} setCart={setCart} addToCart={addToCart} />
      <Footer />
    </div>
  );
}