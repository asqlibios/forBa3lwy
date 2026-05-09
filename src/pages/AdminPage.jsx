import { useState } from "react";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  TAG_COLORS,
  normalizeSearchText,
} from "../data/shop";
import {
  SIZE_TEMPLATE_CATEGORIES,
  SIZE_TEMPLATE_CATEGORY_LABELS,
} from "../data/sizing";

const EMPTY_FORM = {
  name: "",
  nameAr: "",
  price: "",
  category: "Men",
  tag: "",
  isOffer: false,
  img: "",
  sizeTemplateCategory: "",
  sizeTemplateId: "",
};

const IMAGE_FALLBACK =
  "https://placehold.co/300x360/f3f4f6/374151?text=Product";

function normalizeImageUrl(value) {
  const imageUrl = value.trim();

  if (!imageUrl) {
    return "";
  }

  const normalizedExtension = imageUrl.replace(/\.peg($|\?)/i, ".jpeg$1");

  if (
    normalizedExtension.startsWith("/") ||
    normalizedExtension.startsWith("http://") ||
    normalizedExtension.startsWith("https://") ||
    normalizedExtension.startsWith("data:")
  ) {
    return normalizedExtension;
  }

  return `/${normalizedExtension}`;
}

export default function AdminPage({
  products = [],
  sizeTemplates = [],
  isLoading = false,
  error = "",
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const normalizedSearch = normalizeSearchText(search);
  const availableTemplates = sizeTemplates.filter(
    (template) => template.category === form.sizeTemplateCategory
  );

  const filtered = products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      normalizeSearchText(product.name).includes(normalizedSearch) ||
      normalizeSearchText(product.nameAr).includes(normalizedSearch);
    const matchesCategory =
      filterCat === "All" || product.category === filterCat;

    return matchesSearch && matchesCategory;
  });

  const deleteCandidate = products.find(
    (product) => String(product.id) === String(deleteConfirm)
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

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.nameAr.trim() ||
      !form.price ||
      Number.isNaN(Number(form.price))
    ) {
      showToast("Please fill in both names and a valid price.", "error");
      return;
    }

    if (!onCreateProduct || !onUpdateProduct) {
      showToast("Firebase actions are not connected yet.", "error");
      return;
    }

    const imageUrl = normalizeImageUrl(form.img);

    const payload = {
      name: form.name.trim(),
      nameAr: form.nameAr.trim(),
      price: Number(form.price),
      category: form.category,
      tag: form.tag || null,
      isOffer: form.isOffer,
      sizeTemplateCategory: form.sizeTemplateCategory || null,
      sizeTemplateId:
        form.sizeTemplateCategory && form.sizeTemplateId
          ? form.sizeTemplateId
          : null,
      img:
        imageUrl ||
        `https://placehold.co/300x360/f3f4f6/374151?text=${encodeURIComponent(
          form.name.trim()
        )}`,
    };

    try {
      setIsSaving(true);

      if (editId !== null) {
        await onUpdateProduct(editId, payload);
        showToast(`"${payload.name}" updated successfully.`);
      } else {
        await onCreateProduct(payload);
        showToast(`"${payload.name}" added successfully.`);
      }

      resetForm();
    } catch (submitError) {
      console.error("Failed to save product:", submitError);
      showToast("Could not save product to Firebase.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      nameAr: product.nameAr || "",
      price: String(product.price),
      category: product.category,
      tag: product.tag || "",
      isOffer: Boolean(product.isOffer || product.tag === "Sale" || product.category === "Sale"),
      img: product.img,
      sizeTemplateCategory: product.sizeTemplateCategory || "",
      sizeTemplateId: product.sizeTemplateId || "",
    });
    setEditId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!onDeleteProduct) {
      showToast("Firebase delete action is not connected yet.", "error");
      return;
    }

    const product = products.find((item) => String(item.id) === String(id));

    try {
      setIsSaving(true);
      await onDeleteProduct(id);
      setDeleteConfirm(null);
      showToast(`"${product?.name ?? "Product"}" deleted.`, "error");
    } catch (deleteError) {
      console.error("Failed to delete product:", deleteError);
      showToast("Could not delete product from Firebase.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-black px-8 py-5 text-white shadow-lg">
        <div>
          <h1 className="text-xl font-extrabold tracking-widest uppercase">
            SHOP Admin Panel
          </h1>
          <p className="mt-0.5 text-xs text-gray-400">
            {products.length} products total
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(EMPTY_FORM);
          }}
          className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all duration-150 hover:bg-gray-100 active:scale-95"
        >
          Add Product
        </button>
      </div>

      {toast && (
        <div
          className={`fixed right-6 top-20 z-50 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {error}
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <h2 className="mb-5 text-lg font-extrabold text-gray-800">
              {editId !== null ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  English Name
                </label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Classic Shirt"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Arabic Name
                </label>
                <input
                  value={form.nameAr}
                  onChange={(event) =>
                    setForm({ ...form, nameAr: event.target.value })
                  }
                  placeholder="مثال: قميص كلاسيكي"
                  dir="rtl"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Price
                </label>
                <input
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  placeholder="e.g. 19.99"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Tag
                </label>
                <select
                  value={form.tag}
                  onChange={(event) =>
                    setForm({ ...form, tag: event.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {PRODUCT_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag || "No Tag"}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isOffer}
                  onChange={(event) =>
                    setForm({ ...form, isOffer: event.target.checked })
                  }
                  className="h-4 w-4 accent-red-500"
                />
                <span>
                  <span className="block text-sm font-bold text-red-700">
                    Show in Offers
                  </span>
                  <span className="block text-xs text-red-500">
                    يظهر المنتج داخل قسم العروض في المتجر
                  </span>
                </span>
              </label>
              <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500">
                      Managed Size Template
                    </label>
                    <p className="mt-1 text-xs text-gray-400">
                      Use this only for shirts and pants. Shoes keep their normal sizing.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                      Size Type
                    </label>
                    <select
                      value={form.sizeTemplateCategory}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          sizeTemplateCategory: event.target.value,
                          sizeTemplateId: "",
                        })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">No Template</option>
                      {SIZE_TEMPLATE_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {SIZE_TEMPLATE_CATEGORY_LABELS[category]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                      Size Template
                    </label>
                    <select
                      value={form.sizeTemplateId}
                      onChange={(event) =>
                        setForm({ ...form, sizeTemplateId: event.target.value })
                      }
                      disabled={!form.sizeTemplateCategory}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="">
                        {form.sizeTemplateCategory
                          ? "Select a reusable template"
                          : "Choose a size type first"}
                      </option>
                      {availableTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    {form.sizeTemplateCategory &&
                      availableTemplates.length === 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          No {SIZE_TEMPLATE_CATEGORY_LABELS[
                            form.sizeTemplateCategory
                          ]?.toLowerCase()} templates available yet.
                        </p>
                      )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Image URL
                </label>
                <input
                  value={form.img}
                  onChange={(event) =>
                    setForm({ ...form, img: event.target.value })
                  }
                  placeholder="https://... or /r.jpeg"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Local images must already be in public, for example /r.jpeg.
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : editId !== null
                    ? "Save Changes"
                    : "Add Product"}
              </button>
              <button
                onClick={resetForm}
                disabled={isSaving}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-150 hover:bg-gray-50 active:scale-95 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={filterCat}
            onChange={(event) => setFilterCat(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Products",
              value: products.length,
              color: "bg-black text-white",
            },
            {
              label: "Showing",
              value: filtered.length,
              color: "border bg-white text-black",
            },
            {
              label: "On Sale",
              value: products.filter(
                (product) =>
                  product.isOffer ||
                  product.tag === "Sale" ||
                  product.category === "Sale"
              ).length,
              color: "border border-red-100 bg-red-50 text-red-600",
            },
            {
              label: "New Arrivals",
              value: products.filter((product) => product.tag === "New").length,
              color: "border border-blue-100 bg-blue-50 text-blue-600",
            },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl px-5 py-4 ${stat.color}`}>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="mt-0.5 text-xs opacity-70">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                {["Product", "Category", "Sizing", "Price", "Tag", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors duration-100 hover:bg-gray-50/60"
                  >
                    <td className="flex items-center gap-3 px-5 py-3">
                      <img
                        src={product.img}
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = IMAGE_FALLBACK;
                        }}
                        className="h-12 w-10 rounded-lg bg-gray-100 object-cover"
                      />
                      <span className="max-w-[180px]">
                        <span className="block truncate font-semibold text-gray-800">
                          {product.name}
                        </span>
                        {product.nameAr && (
                          <span
                            className="block truncate text-xs text-gray-400"
                            dir="rtl"
                          >
                            {product.nameAr}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{product.category}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {product.sizeTemplateCategory ? (
                        <div>
                          <p className="font-medium text-gray-800">
                            {SIZE_TEMPLATE_CATEGORY_LABELS[
                              product.sizeTemplateCategory
                            ] || product.sizeTemplateCategory}
                          </p>
                          <p className="text-xs text-gray-400">
                            {sizeTemplates.find(
                              (template) =>
                                String(template.id) === String(product.sizeTemplateId)
                            )?.name || "Template not found"}
                          </p>
                        </div>
                      ) : product.category === "Shoes" ? (
                        <span className="text-xs font-semibold text-blue-600">
                          Universal shoe sizing
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">Default</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-bold text-red-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      {product.isOffer || product.tag === "Sale" || product.category === "Sale" ? (
                        <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                          Sale
                        </span>
                      ) : product.tag ? (
                        <span
                          className={`${TAG_COLORS[product.tag]} rounded-full px-2.5 py-0.5 text-xs font-bold text-white`}
                        >
                          {product.tag}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={isSaving}
                          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold transition-colors duration-150 hover:bg-gray-200 disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          disabled={isSaving}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors duration-150 hover:bg-red-100 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !isSaving && setDeleteConfirm(null)}
        >
          <div
            className="w-80 max-w-[90vw] rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="mb-1 text-lg font-extrabold">Delete Product?</h3>
            <p className="mb-5 text-sm text-gray-500">
              "{deleteCandidate?.name ?? "Product"}" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-red-600 active:scale-95 disabled:opacity-60"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-all duration-150 hover:bg-gray-50 active:scale-95 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
