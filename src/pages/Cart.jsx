export default function Cart({ cart, onClose }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end">
      <div className="bg-white w-96 h-full p-4">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">السلة</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {cart.length === 0 ? (
          <p>السلة فاضية</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} className="border-b py-2">
              <p>{item.name}</p>
              <p>{item.qty} × ${item.price}</p>
            </div>
          ))
        )}

        <div className="mt-4 font-bold">
          المجموع: ${total.toFixed(2)}
        </div>

        <button className="bg-green-600 text-white w-full py-2 mt-4">
          تأكيد الطلب
        </button>
      </div>
    </div>
  );
}