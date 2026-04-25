import { useEffect, useMemo, useState } from "react";
import { createOrder } from "../services/orders";

const WHATSAPP_NUMBER = "734743477";

function formatCurrency(value) {
  return `SAR ${Number(value).toFixed(2)}`;
}

function buildWhatsAppMessage(customer, cart, total) {
  const lines = cart.map((item) => {
    const qtyText = item.qty > 1 ? ` x${item.qty}` : "";
    const sizeText = item.size ? ` - المقاس: ${item.size}` : "";
    return `${item.name}${qtyText}${sizeText} - ${formatCurrency(
      item.price * item.qty
    )}`;
  });

  return [
    `${customer.name} طلب:`,
    "",
    `الاسم: ${customer.name}`,
    `الرقم: ${customer.phone}`,
    `المدينة: ${customer.city}`,
    `العنوان: ${customer.address}`,
    customer.notes ? `معلومات إضافية: ${customer.notes}` : null,
    "",
    ...lines,
    "",
    `المجموع: ${formatCurrency(total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function CartDrawer({
  cart,
  customerName,
  onCustomerNameChange,
  onClose,
  onProceed,
  removeFromCart,
  updateQty,
  total,
}) {
  return (
    <>
      <div className="flex justify-between items-center px-5 py-4 border-b">
        <h2 className="text-xl font-extrabold tracking-tight">
          Cart
          {cart.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({cart.reduce((sum, item) => sum + item.qty, 0)} items)
            </span>
          )}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-all duration-150"
        >
          x
        </button>
      </div>

      <div className="px-5 pt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          اسم العميل
        </label>
        <input
          value={customerName}
          onChange={(event) => onCustomerNameChange(event.target.value)}
          placeholder="مثال: فلان"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <p className="font-medium">Your cart is empty</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div
              key={`${item.id}-${item.size ?? "default"}`}
              className="flex gap-3 items-center border-b pb-4"
              style={{ animation: `fadeIn 0.25s ease ${index * 60}ms both` }}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover border"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-red-500 font-bold text-sm">
                  {formatCurrency(item.price)}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-6 h-6 border rounded text-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    -
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
                <p className="font-bold text-sm">
                  {formatCurrency(item.price * item.qty)}
                </p>
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

      {cart.length > 0 && (
        <div className="px-5 py-4 border-t bg-gray-50 space-y-3">
          <div className="flex justify-between font-extrabold text-lg">
            <span>المجموع</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button
            onClick={onProceed}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-95 transition-all duration-150"
          >
            عرض الفاتورة
          </button>
        </div>
      )}
    </>
  );
}

function InvoicePage({
  cart,
  customer,
  errors,
  total,
  isSubmitting,
  submitError,
  onBack,
  onChange,
  onConfirm,
  onClose,
}) {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-full bg-[#f7f1eb]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              رجوع للسلة
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              إغلاق
            </button>
          </div>
          <h2 className="text-2xl font-black text-gray-900">تفاصيل الفاتورة</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-start" dir="rtl">
          <section className="rounded-[28px] bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-5 text-xl font-bold text-gray-900">
              بيانات العميل
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  الاسم
                </label>
                <input
                  value={customer.name}
                  onChange={(event) => onChange("name", event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                  placeholder="ادخل الاسم"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  الرقم
                </label>
                <input
                  value={customer.phone}
                  onChange={(event) => onChange("phone", event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                  placeholder="ادخل رقم هاتفك"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                المدينة
              </label>
              <input
                value={customer.city}
                onChange={(event) => onChange("city", event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                placeholder="ادخل المدينة"
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                العنوان
              </label>
              <textarea
                value={customer.address}
                onChange={(event) => onChange("address", event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 resize-none"
                placeholder="اكتب العنوان بالتفصيل"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                معلومات إضافية (اختياري)
              </label>
              <textarea
                value={customer.notes}
                onChange={(event) => onChange("notes", event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 resize-none"
                placeholder="أي تفاصيل إضافية تحب تضيفها"
              />
            </div>
          </section>

          <section className="rounded-[28px] bg-[#f4ece4] p-5 shadow-sm ring-1 ring-black/5 lg:sticky lg:top-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">تأكيد الطلب</h3>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size ?? "default"}`}
                    className="flex items-center gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        الكمية: {item.qty}
                        {item.size ? ` | المقاس: ${item.size}` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>سلة التسوق</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>خصم</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>تكلفة التوصيل</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-lg font-black text-gray-900">
                  <span>المجموع</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">تأكيد عبر واتساب</p>
                    <p className="mt-1 text-xs text-gray-500">
                      سيتم حفظ الفاتورة في لوحة الأدمن ثم فتح واتساب للتأكيد
                    </p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                    ✓
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>عدد القطع</span>
                  <span className="font-semibold text-gray-900">{itemCount}</span>
                </div>
              </div>

              {submitError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[#3f6f9f] py-4 text-base font-bold text-white transition-all duration-150 hover:bg-[#345f88] active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? "جاري حفظ الطلب..." : "تأكيد الطلب"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Cart({ cart, onClose, removeFromCart, updateQty }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState("cart");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSubmitError("");
  };

  const handleProceed = () => {
    setStep("invoice");
  };

  const handleBackToCart = () => {
    setStep("cart");
  };

  const handleConfirmOrder = async () => {
    const nextErrors = {};

    if (!customer.name.trim()) nextErrors.name = "الاسم مطلوب";
    if (!customer.phone.trim()) nextErrors.phone = "الرقم مطلوب";
    if (!customer.city.trim()) nextErrors.city = "المدينة مطلوبة";
    if (!customer.address.trim()) nextErrors.address = "العنوان مطلوب";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await createOrder({
        ...customer,
        products: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          qty: Number(item.qty),
          size: item.size ?? "",
          img: item.img ?? "",
        })),
        total,
        paymentMethod: "WhatsApp",
      });

      const message = buildWhatsAppMessage(customer, cart, total);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to create order:", error);
      setSubmitError("تعذر حفظ الطلب الآن. حاول مرة ثانية.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${step === "invoice" ? "overflow-y-auto" : ""}`}
      style={{
        background: visible ? "rgba(15,23,42,0.45)" : "rgba(15,23,42,0)",
        transition: "background 0.3s",
      }}
      onClick={(event) => {
        if (step === "cart" && event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      {step === "invoice" ? (
        <div className="min-h-full">
          <InvoicePage
            cart={cart}
            customer={customer}
            errors={errors}
            total={total}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onBack={handleBackToCart}
            onChange={handleCustomerChange}
            onConfirm={handleConfirmOrder}
            onClose={handleClose}
          />
        </div>
      ) : (
        <div className="flex h-full justify-end">
          <div
            className="bg-white h-full w-96 max-w-full flex flex-col shadow-2xl"
            style={{
              transform: visible ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <CartDrawer
              cart={cart}
              customerName={customer.name}
              onCustomerNameChange={(value) => handleCustomerChange("name", value)}
              onClose={handleClose}
              onProceed={handleProceed}
              removeFromCart={removeFromCart}
              updateQty={updateQty}
              total={total}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
