import { useMemo, useState } from "react";
import { HERO_BACKGROUNDS } from "../data/heroSlides";
import { getProductDisplayName } from "../data/products";

const EMPTY_FORM = {
  title: "",
  titleAr: "",
  subtitle: "",
  subtitleAr: "",
  buttonText: "Shop Now",
  buttonTextAr: "تسوق الآن",
  bg: HERO_BACKGROUNDS[0].value,
  productIds: [],
  isActive: true,
  sortOrder: 1,
};

export default function AdminHeroPage({
  slides = [],
  products = [],
  isLoading = false,
  error = "",
  onCreateSlide,
  onUpdateSlide,
  onDeleteSlide,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const sortedSlides = useMemo(
    () => [...slides].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)),
    [slides]
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(null), 2500);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  const toggleProduct = (productId) => {
    const id = String(productId);
    const exists = form.productIds.includes(id);

    setForm({
      ...form,
      productIds: exists
        ? form.productIds.filter((item) => item !== id)
        : [...form.productIds, id],
    });
  };

  const handleSubmit = async () => {
    if (
      !form.title.trim() ||
      !form.titleAr.trim() ||
      !form.subtitle.trim() ||
      !form.subtitleAr.trim()
    ) {
      showToast("Please fill in Arabic and English titles.", "error");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      titleAr: form.titleAr.trim(),
      subtitle: form.subtitle.trim(),
      subtitleAr: form.subtitleAr.trim(),
      buttonText: form.buttonText.trim() || "Shop Now",
      buttonTextAr: form.buttonTextAr.trim() || "تسوق الآن",
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      setIsSaving(true);

      if (editId) {
        await onUpdateSlide(editId, payload);
        showToast("Hero offer updated.");
      } else {
        await onCreateSlide(payload);
        showToast("Hero offer added.");
      }

      resetForm();
    } catch (submitError) {
      console.error("Failed to save hero offer:", submitError);
      showToast("Could not save hero offer.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (slide) => {
    setForm({
      title: slide.title || "",
      titleAr: slide.titleAr || "",
      subtitle: slide.subtitle || "",
      subtitleAr: slide.subtitleAr || "",
      buttonText: slide.buttonText || "Shop Now",
      buttonTextAr: slide.buttonTextAr || "تسوق الآن",
      bg: slide.bg || HERO_BACKGROUNDS[0].value,
      productIds: Array.isArray(slide.productIds)
        ? slide.productIds.map((id) => String(id))
        : [],
      isActive: slide.isActive !== false,
      sortOrder: Number(slide.sortOrder) || 0,
    });
    setEditId(slide.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      setIsSaving(true);
      await onDeleteSlide(id);
      showToast("Hero offer deleted.", "error");
    } catch (deleteError) {
      console.error("Failed to delete hero offer:", deleteError);
      showToast("Could not delete hero offer.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
              Store Hero
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Hero Offers
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({ ...EMPTY_FORM, sortOrder: sortedSlides.length + 1 });
            }}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-gray-800 active:scale-95"
          >
            Add Hero Offer
          </button>
        </div>

        {toast && (
          <div
            className={`fixed right-6 top-20 z-50 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl ${
              toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {toast.msg}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {error}
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <h3 className="mb-5 text-lg font-extrabold text-gray-800">
              {editId ? "Edit Hero Offer" : "Add Hero Offer"}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="English Title"
                value={form.title}
                onChange={(value) => setForm({ ...form, title: value })}
                placeholder="#BataiMug"
              />
              <Field
                label="Arabic Title"
                value={form.titleAr}
                onChange={(value) => setForm({ ...form, titleAr: value })}
                placeholder="#عرض_الأكواب"
                dir="rtl"
              />
              <Field
                label="English Subtitle"
                value={form.subtitle}
                onChange={(value) => setForm({ ...form, subtitle: value })}
                placeholder="Fresh picks for your table"
              />
              <Field
                label="Arabic Subtitle"
                value={form.subtitleAr}
                onChange={(value) => setForm({ ...form, subtitleAr: value })}
                placeholder="اختيارات مميزة لطاولتك"
                dir="rtl"
              />
              <Field
                label="English Button"
                value={form.buttonText}
                onChange={(value) => setForm({ ...form, buttonText: value })}
                placeholder="Shop Now"
              />
              <Field
                label="Arabic Button"
                value={form.buttonTextAr}
                onChange={(value) => setForm({ ...form, buttonTextAr: value })}
                placeholder="تسوق الآن"
                dir="rtl"
              />

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Background
                </label>
                <select
                  value={form.bg}
                  onChange={(event) => setForm({ ...form, bg: event.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {HERO_BACKGROUNDS.map((background) => (
                    <option key={background.value} value={background.value}>
                      {background.label}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="Sort Order"
                type="number"
                value={form.sortOrder}
                onChange={(value) => setForm({ ...form, sortOrder: value })}
                placeholder="1"
              />

              <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm({ ...form, isActive: event.target.checked })
                  }
                  className="h-4 w-4 accent-black"
                />
                <span className="text-sm font-bold text-gray-800">
                  Active on storefront
                </span>
              </label>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Products in this hero
              </p>
              <div className="grid max-h-72 gap-3 overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const checked = form.productIds.includes(String(product.id));

                  return (
                    <label
                      key={product.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-2 transition-colors ${
                        checked ? "border-black" : "border-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(product.id)}
                        className="h-4 w-4 accent-black"
                      />
                      <img
                        src={product.img}
                        alt={product.name}
                        className="h-12 w-10 rounded-lg object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-gray-900">
                          {product.name}
                        </span>
                        <span className="block truncate text-xs text-gray-400" dir="rtl">
                          {getProductDisplayName(product, "ar")}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-gray-800 active:scale-95 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : editId ? "Save Changes" : "Add Offer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-150 hover:bg-gray-50 active:scale-95 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {isLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-400">
              Loading hero offers...
            </div>
          ) : sortedSlides.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-400">
              No hero offers yet.
            </div>
          ) : (
            sortedSlides.map((slide) => (
              <div
                key={slide.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div
                  className={`bg-gradient-to-r ${slide.bg} px-5 py-4 text-white`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                        #{slide.sortOrder} {slide.isActive ? "Active" : "Hidden"}
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold">
                        {slide.title}
                      </h3>
                      <p className="text-sm opacity-90">{slide.subtitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(slide)}
                        disabled={isSaving}
                        className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur transition-colors hover:bg-white/30 disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        disabled={isSaving}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 p-4">
                  {slide.productIds.length === 0 ? (
                    <span className="text-sm text-gray-400">
                      No products selected.
                    </span>
                  ) : (
                    slide.productIds.map((id) => {
                      const product = products.find(
                        (item) => String(item.id) === String(id)
                      );

                      return (
                        <span
                          key={id}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                        >
                          {product?.name ?? "Missing product"}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", dir }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
