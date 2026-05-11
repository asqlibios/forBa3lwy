import { useEffect, useMemo, useState } from "react";
import { createOrder } from "../services/orders";

const WHATSAPP_NUMBER = "734743477";

const COPY = {
  ar: {
    cart: "السلة",
    empty: "السلة فارغة",
    items: "منتج",
    remove: "حذف",
    size: "المقاس",
    total: "المجموع",
    reviewOrder: "مراجعة الطلب",
    backToCart: "رجوع للسلة",
    close: "إغلاق",
    invoice: "تأكيد الطلب",
    accountDetails: "بيانات الحساب",
    orderSummary: "ملخص الطلب",
    whatsappConfirm: "تأكيد عبر واتساب",
    whatsappHint:
      "سيتم حفظ الطلب في لوحة الأدمن ثم فتح واتساب لتأكيد الطلب مباشرة.",
    itemCount: "عدد القطع",
    placeOrder: "تأكيد الطلب",
    placingOrder: "جارٍ حفظ الطلب...",
    successTitle: "تم إرسال طلبك بنجاح",
    successBody:
      "تم تأكيد الطلب وإفراغ السلة. سيتم فتح واتساب لإكمال الإرسال مباشرة.",
    signInRequired: "لازم تسجل دخول عشان تطلب.",
    completeAccount: "أكمل بيانات حسابك أولًا قبل تنفيذ الطلب.",
    openAccount: "فتح حسابي",
    inCart: "في السلة",
  },
  en: {
    cart: "Cart",
    empty: "Your cart is empty",
    items: "items",
    remove: "Remove",
    size: "Size",
    total: "Total",
    reviewOrder: "Review Order",
    backToCart: "Back to Cart",
    close: "Close",
    invoice: "Confirm Order",
    accountDetails: "Account Details",
    orderSummary: "Order Summary",
    whatsappConfirm: "Confirm by WhatsApp",
    whatsappHint:
      "The order will be saved in the admin dashboard, then WhatsApp will open for confirmation.",
    itemCount: "Items count",
    placeOrder: "Place Order",
    placingOrder: "Saving order...",
    successTitle: "Your order has been sent successfully",
    successBody:
      "The order was confirmed and the cart was cleared. WhatsApp will open to complete the send.",
    signInRequired: "You need to sign in before placing an order.",
    completeAccount: "Complete your account details before placing an order.",
    openAccount: "Open My Account",
    inCart: "In Cart",
  },
};

function formatCurrency(value) {
  return `SAR ${Number(value).toFixed(2)}`;
}

function buildWhatsAppMessage(customer, cart, total) {
  const lines = cart.map((item) => {
    const qtyText = item.qty > 1 ? ` x${item.qty}` : "";
    const sizeText = item.size ? ` - Size: ${item.size}` : "";
    return `${item.name}${qtyText}${sizeText} - ${formatCurrency(
      item.price * item.qty
    )}`;
  });

  return [
    `${customer.fullName} order:`,
    "",
    `Name: ${customer.fullName}`,
    `Phone: ${customer.phone}`,
    `City: ${customer.city}`,
    `Address: ${customer.address}`,
    customer.notes ? `Notes: ${customer.notes}` : null,
    "",
    ...lines,
    "",
    `Total: ${formatCurrency(total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function isAccountComplete(profile) {
  return Boolean(
    profile?.fullName?.trim() &&
      profile?.phone?.trim() &&
      profile?.city?.trim() &&
      profile?.address?.trim()
  );
}

function CartDrawer({
  cart,
  onClose,
  onProceed,
  onOpenAccount,
  removeFromCart,
  updateQty,
  total,
  language,
  checkoutError,
}) {
  const copy = COPY[language] || COPY.en;

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-xl font-extrabold tracking-tight">
          {copy.cart}
          {cart.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({cart.reduce((sum, item) => sum + item.qty, 0)} {copy.items})
            </span>
          )}
        </h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-all duration-150 hover:bg-gray-100 hover:text-black"
        >
          x
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
            <p className="font-medium">{copy.empty}</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div
              key={`${item.id}-${item.size ?? "default"}`}
              className="flex items-center gap-3 border-b pb-4"
              style={{ animation: `fadeIn 0.25s ease ${index * 60}ms both` }}
            >
              <img
                src={item.img}
                alt={item.name}
                className="h-16 w-16 rounded-lg border object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-sm font-bold text-red-500">
                  {formatCurrency(item.price)}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.size ?? "", item.qty - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded border text-sm transition-colors hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.size ?? "", item.qty + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded border text-sm transition-colors hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <p className="text-sm font-bold">
                  {formatCurrency(item.price * item.qty)}
                </p>
                {item.size && (
                  <p className="text-xs text-gray-400">
                    {copy.size}: {item.size}
                  </p>
                )}
                <button
                  onClick={() => removeFromCart(item.id, item.size ?? "")}
                  className="text-xs text-gray-400 transition-colors duration-150 hover:text-red-500"
                >
                  {copy.remove}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="space-y-3 border-t bg-gray-50 px-5 py-4">
          {checkoutError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p>{checkoutError}</p>
              {onOpenAccount && (
                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="mt-3 rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
                >
                  {copy.openAccount}
                </button>
              )}
            </div>
          )}
          <div className="flex justify-between text-lg font-extrabold">
            <span>{copy.total}</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button
            onClick={onProceed}
            className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-gray-800 active:scale-95"
          >
            {copy.reviewOrder}
          </button>
        </div>
      )}
    </div>
  );
}

function InvoicePage({
  cart,
  profile,
  total,
  isSubmitting,
  submitError,
  onBack,
  onConfirm,
  onClose,
  language,
}) {
  const copy = COPY[language] || COPY.en;
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
              {copy.backToCart}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {copy.close}
            </button>
          </div>
          <h2 className="text-2xl font-black text-gray-900">{copy.invoice}</h2>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] bg-white/70 p-5 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-5 text-xl font-bold text-gray-900">
              {copy.accountDetails}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs font-bold uppercase text-gray-400">Name</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {profile.fullName}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs font-bold uppercase text-gray-400">Phone</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {profile.phone}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs font-bold uppercase text-gray-400">City</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {profile.city}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs font-bold uppercase text-gray-400">Email</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white px-4 py-4">
              <p className="text-xs font-bold uppercase text-gray-400">Address</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                {profile.address}
              </p>
            </div>

            {profile.notes && (
              <div className="mt-4 rounded-2xl bg-white px-4 py-4">
                <p className="text-xs font-bold uppercase text-gray-400">Notes</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                  {profile.notes}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[28px] bg-[#f4ece4] p-5 shadow-sm ring-1 ring-black/5 lg:sticky lg:top-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {copy.orderSummary}
            </h3>

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
                        Qty: {item.qty}
                        {item.size ? ` | ${copy.size}: ${item.size}` : ""}
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
                  <span>{copy.total}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {copy.whatsappConfirm}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {copy.whatsappHint}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                    ✓
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white px-4 py-4 text-sm text-gray-600 shadow-sm">
                <div className="flex items-center justify-between">
                  <span>{copy.itemCount}</span>
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
                {isSubmitting ? copy.placingOrder : copy.placeOrder}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SuccessPage({ onClose, language }) {
  const copy = COPY[language] || COPY.en;

  return (
    <div className="min-h-full bg-[#f7f1eb]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8">
        <div className="w-full rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
            ✓
          </div>
          <h2 className="mt-5 text-2xl font-black text-gray-900">
            {copy.successTitle}
          </h2>
          <p className="mt-3 text-sm text-gray-600">{copy.successBody}</p>
          <button
            onClick={onClose}
            className="mt-6 rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            {copy.close}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart({
  cart,
  onClose,
  removeFromCart,
  updateQty,
  clearCart,
  currentUser = null,
  accountProfile = null,
  onRequireAuth,
  onOpenAccount,
  language = "ar",
}) {
  const copy = COPY[language] || COPY.en;
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

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

  const handleProceed = () => {
    setCheckoutError("");

    if (!currentUser) {
      handleClose();
      onRequireAuth?.();
      return;
    }

    if (!isAccountComplete(accountProfile)) {
      setCheckoutError(copy.completeAccount);
      return;
    }

    setStep("invoice");
  };

  const handleBackToCart = () => {
    setStep("cart");
    setSubmitError("");
  };

  const handleConfirmOrder = async () => {
    if (!currentUser || !isAccountComplete(accountProfile)) {
      setSubmitError(copy.completeAccount);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await createOrder({
        ...accountProfile,
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
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

      const message = buildWhatsAppMessage(accountProfile, cart, total);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;
      clearCart?.();
      setStep("success");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to create order:", error);
      setSubmitError(
        language === "ar"
          ? "تعذر حفظ الطلب الآن. حاول مرة ثانية."
          : "Unable to save the order right now. Please try again."
      );
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
        if (
          (step === "cart" || step === "success") &&
          event.target === event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      {step === "invoice" ? (
        <div className="min-h-full">
          <InvoicePage
            cart={cart}
            profile={accountProfile}
            total={total}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onBack={handleBackToCart}
            onConfirm={handleConfirmOrder}
            onClose={handleClose}
            language={language}
          />
        </div>
      ) : step === "success" ? (
        <div className="min-h-full">
          <SuccessPage onClose={handleClose} language={language} />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-0 flex h-full" dir="ltr">
          <div
            className="flex h-full w-96 max-w-full flex-col bg-white shadow-2xl"
            style={{
              transform: visible ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <CartDrawer
              cart={cart}
              onClose={handleClose}
              onProceed={handleProceed}
              onOpenAccount={() => {
                handleClose();
                onOpenAccount?.();
              }}
              removeFromCart={removeFromCart}
              updateQty={updateQty}
              total={total}
              language={language}
              checkoutError={checkoutError}
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
