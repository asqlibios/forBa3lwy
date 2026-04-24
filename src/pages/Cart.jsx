import { useState, useEffect } from "react";

export default function Cart({ cart, onClose, removeFromCart, updateQty }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{
        background: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
        transition: "background 0.3s",
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white h-full w-96 max-w-full flex flex-col shadow-2xl"
        style={{
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-xl font-extrabold tracking-tight">
            Cart
            {cart.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({cart.reduce((s, i) => s + i.qty, 0)} items)
              </span>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-all duration-150"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="font-medium">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div
                key={item.id}
                className="flex gap-3 items-center border-b pb-4"
                style={{ animation: `fadeIn 0.25s ease ${i * 60}ms both` }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-red-500 font-bold text-sm">${item.price.toFixed(2)}</p>

                  {/* Qty inline controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 border rounded text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 border rounded text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <p className="font-bold text-sm">${(item.price * item.qty).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-150"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t bg-gray-50 space-y-3">
            <div className="flex justify-between font-extrabold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm
                               hover:bg-gray-800 active:scale-95 transition-all duration-150">
              Checkout →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
