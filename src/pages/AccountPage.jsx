import { useEffect, useMemo, useState } from "react";

const COPY = {
  ar: {
    title: "حسابي",
    profile: "حسابك",
    orders: "الطلبات",
    addresses: "العناوين",
    favorites: "المحفوظة",
    policies: "سياسة الاستبدال/الإسترجاع",
    support: "خدمة العملاء",
    feedback: "شاركنا رأيك / مقترحاتك",
    save: "حفظ البيانات",
    saving: "جارٍ الحفظ...",
    fullName: "الاسم الكامل",
    phone: "رقم الجوال",
    city: "المدينة",
    address: "العنوان",
    notes: "ملاحظات التوصيل",
    profileSaved: "تم حفظ بيانات الحساب بنجاح.",
    required: "الاسم ورقم الجوال والمدينة والعنوان مطلوبة للطلب.",
    completeProfile: "أكمل بياناتك حتى تتمكن من تنفيذ الطلب بسهولة.",
    ordersEmpty: "لا توجد طلبات مرتبطة بهذا الحساب حتى الآن.",
    favoritesHint: "صفحة المفضلة جاهزة، ونقدر نربطها بحفظ المنتجات بعد ذلك.",
    whatsapp: "واتساب",
    total: "الإجمالي",
  },
  en: {
    title: "My Account",
    profile: "Your Account",
    orders: "Orders",
    addresses: "Addresses",
    favorites: "Saved",
    policies: "Return / Exchange Policy",
    support: "Customer Support",
    feedback: "Share Feedback / Suggestions",
    save: "Save Details",
    saving: "Saving...",
    fullName: "Full name",
    phone: "Phone",
    city: "City",
    address: "Address",
    notes: "Delivery notes",
    profileSaved: "Account details saved successfully.",
    required: "Full name, phone, city, and address are required for orders.",
    completeProfile: "Complete your details to place orders smoothly.",
    ordersEmpty: "No orders are linked to this account yet.",
    favoritesHint: "Favorites page is ready and can be connected to saved products next.",
    whatsapp: "WhatsApp",
    total: "Total",
  },
};

const WHATSAPP_NUMBER = "734743477";

function formatCurrency(value) {
  return `SAR ${Number(value || 0).toFixed(2)}`;
}

function formatDate(createdAt, language) {
  const date =
    createdAt && typeof createdAt.toDate === "function"
      ? createdAt.toDate()
      : null;

  if (!date) {
    return language === "ar" ? "قيد المعالجة" : "Processing";
  }

  return new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 8.5 12 13 3 8.5" />
      <path d="M3 8.5 12 4l9 4.5V19l-9 4-9-4V8.5Z" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m12 21-1.45-1.32C5.4 15.03 2 11.94 2 8.15 2 5.06 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.06 22 8.15c0 3.79-3.4 6.88-8.55 11.54L12 21Z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3 5 6v6c0 5 3.4 9.74 7 11 3.6-1.26 7-6 7-11V6l-7-3Z" />
    </svg>
  );
}

function IconHeadset() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 12a8 8 0 1 1 16 0" />
      <path d="M4 13v4a2 2 0 0 0 2 2h2v-6H6a2 2 0 0 0-2 2Z" />
      <path d="M20 13v4a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

function IconMessage() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.8 0-3.47-.56-4.84-1.52L3 20l1.68-4.4A8.46 8.46 0 0 1 4 11.5 8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function AccountRow({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-5 text-right transition hover:bg-gray-50"
    >
      <span className="text-gray-500">
        <IconChevron />
      </span>
      <div className="flex items-center gap-3 text-gray-900">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-gray-500">{icon}</span>
      </div>
    </button>
  );
}

export default function AccountPage({
  currentUser,
  profile,
  orders = [],
  language = "ar",
  isSaving = false,
  onSave,
}) {
  const copy = COPY[language] || COPY.en;
  const [openSection, setOpenSection] = useState("profile");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      fullName: profile?.fullName || currentUser?.displayName || "",
      phone: profile?.phone || "",
      city: profile?.city || "",
      address: profile?.address || "",
      notes: profile?.notes || "",
    });
  }, [currentUser, profile]);

  const isProfileComplete = useMemo(
    () =>
      Boolean(
        form.fullName.trim() &&
          form.phone.trim() &&
          form.city.trim() &&
          form.address.trim()
      ),
    [form]
  );

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!isProfileComplete) {
      setError(copy.required);
      return;
    }

    try {
      await onSave?.(form);
      setMessage(copy.profileSaved);
    } catch (saveError) {
      setError(saveError?.message || "Unable to save account details.");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#faf8f5] pb-24"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="border-b border-gray-200 bg-white px-4 py-5 text-center">
        <h1 className="text-xl font-bold text-gray-900">{copy.title}</h1>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="border-b border-gray-200 bg-white px-4 py-5">
          <p className="text-xl font-black text-gray-900">
            {form.fullName || currentUser?.displayName || currentUser?.email}
          </p>
          <p className="mt-2 text-sm text-gray-500">{currentUser?.email}</p>
          {!isProfileComplete && (
            <p className="mt-3 text-xs font-semibold text-amber-700">
              {copy.completeProfile}
            </p>
          )}
        </div>

        <AccountRow
          label={copy.orders}
          icon={<IconBox />}
          onClick={() => setOpenSection((value) => (value === "orders" ? "" : "orders"))}
        />
        {openSection === "orders" && (
          <div className="border-b border-gray-200 bg-white px-4 py-4">
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">{copy.ordersEmpty}</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-gray-900">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt, language)}
                      </p>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      {order.products.slice(0, 2).map((item) => (
                        <p key={`${order.id}-${item.id}-${item.size || "default"}`}>
                          {item.name} x{item.qty}
                        </p>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-gray-200 pt-3 text-sm font-bold text-gray-900">
                      {copy.total}: {formatCurrency(order.total)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <AccountRow
          label={copy.addresses}
          icon={<IconPin />}
          onClick={() =>
            setOpenSection((value) => (value === "addresses" ? "" : "addresses"))
          }
        />
        {openSection === "addresses" && (
          <div className="border-b border-gray-200 bg-white px-4 py-4">
            <p className="text-sm leading-7 text-gray-600">
              {form.address || copy.completeProfile}
            </p>
          </div>
        )}

        <AccountRow
          label={copy.favorites}
          icon={<IconHeart />}
          onClick={() =>
            setOpenSection((value) => (value === "favorites" ? "" : "favorites"))
          }
        />
        {openSection === "favorites" && (
          <div className="border-b border-gray-200 bg-white px-4 py-4">
            <p className="text-sm text-gray-500">{copy.favoritesHint}</p>
          </div>
        )}

        <AccountRow
          label={copy.policies}
          icon={<IconShield />}
          onClick={() =>
            setOpenSection((value) => (value === "policies" ? "" : "policies"))
          }
        />
        {openSection === "policies" && (
          <div className="border-b border-gray-200 bg-white px-4 py-4">
            <p className="text-sm leading-7 text-gray-600">
              نراعي حفظ بياناتك فقط لأغراض الطلب والتوصيل وخدمة العملاء.
            </p>
          </div>
        )}

        <AccountRow
          label={copy.profile}
          icon={<IconMessage />}
          onClick={() =>
            setOpenSection((value) => (value === "profile" ? "" : "profile"))
          }
        />
        {openSection === "profile" && (
          <form onSubmit={handleSubmit} className="border-b border-gray-200 bg-white px-4 py-4">
            <div className="grid gap-4">
              <input
                value={form.fullName}
                onChange={handleChange("fullName")}
                placeholder={copy.fullName}
                className="h-12 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
              <input
                value={currentUser?.email || ""}
                disabled
                className="h-12 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500 outline-none"
              />
              <input
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder={copy.phone}
                className="h-12 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
              <input
                value={form.city}
                onChange={handleChange("city")}
                placeholder={copy.city}
                className="h-12 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-black"
              />
              <textarea
                value={form.address}
                onChange={handleChange("address")}
                rows={3}
                placeholder={copy.address}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
              <textarea
                value={form.notes}
                onChange={handleChange("notes")}
                rows={3}
                placeholder={copy.notes}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {(message || error) && (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                  error
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {error || message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="mt-4 w-full rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {isSaving ? copy.saving : copy.save}
            </button>
          </form>
        )}

        <div className="grid grid-cols-2 gap-4 px-4 py-5">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-4 text-sm font-semibold text-gray-800"
          >
            <IconHeadset />
            {copy.support}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-4 text-sm font-semibold text-gray-800"
          >
            <IconMessage />
            {copy.feedback}
          </a>
        </div>
      </div>
    </div>
  );
}
