import { useState } from "react";

export default function ProductModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white w-96 p-5 rounded-xl space-y-4">

        <img src={product.img} className="h-48 w-full object-cover" />

        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-red-500">${product.price}</p>

        {/* quantity */}
        <div className="flex gap-3 items-center">
          <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>

        <button
          onClick={() => onAdd(qty)}
          className="bg-black text-white w-full py-2 rounded"
        >
          تأكيد الطلب
        </button>

        <button
          onClick={onClose}
          className="bg-gray-300 w-full py-2 rounded"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}