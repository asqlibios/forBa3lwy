import { useState, useEffect } from "react";

export default function ProductModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleAdd = () => {
    setVisible(false);
    setTimeout(() => onAdd(qty), 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background 0.25s",
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white w-96 max-w-[90vw] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.9) translateY(30px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.25s ease, opacity 0.25s ease",
        }}
      >
        <div className="relative">
          <img src={product.img} className="h-52 w-full object-cover" alt={product.name} />
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-white transition-all duration-150 hover:scale-110"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent" />
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-extrabold">{product.name}</h2>
            <p className="text-red-500 font-bold text-lg">${product.price.toFixed(2)}</p>
          </div>

          {/* Qty Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">Quantity</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-lg hover:bg-gray-100 transition-colors duration-150 font-bold"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-lg hover:bg-gray-100 transition-colors duration-150 font-bold"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-400">= ${(product.price * qty).toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm
                         hover:bg-gray-800 active:scale-95 transition-all duration-150"
            >
              Add to Cart
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-600
                         hover:bg-gray-50 active:scale-95 transition-all duration-150"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
