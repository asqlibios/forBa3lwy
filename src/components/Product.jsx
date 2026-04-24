import { useState } from "react";
import ProductModal from "./ProductModal";

export default function Products({ addToCart }) {
  const products = [
    { id: 1, name: "Shirt", price: 9.99, img: "/img1.jpg" },
    { id: 2, name: "Jacket", price: 19.99, img: "/img1.jpg" },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-6 pb-10">
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} onClick={() => setSelected(p)}>
            <img src={p.img} />
            <p>{p.name}</p>
          </div>
        ))}
      </div>

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={(qty) => {
            addToCart(selected, qty);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}