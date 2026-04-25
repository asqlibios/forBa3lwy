import { useState } from "react";

const CATEGORIES = [
  "Women",
  "Men",
  "Kids",
  "New In",
  "Sale",
  "Accessories",
  "Shoes",
  "Home & Living",
];
const TAGS = ["", "Bestseller", "New", "Sale"];

const TAG_COLORS = {
  Bestseller: "bg-orange-500",
  New: "bg-blue-500",
  Sale: "bg-red-500",
};

const EMPTY_FORM = { name: "", price: "", category: "Men", tag: "", img: "" };

export default function AdminPage({
  products = [],
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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(null), 2500);
  };

  const filtered = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const matchCat = filterCat === "All" || product.category === filterCat;
    return matchSearch && matchCat;
  });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || Number.isNaN(Number(form.price))) {
      showToast("Please fill in name and a valid price.", "error");
      return;
    }

    if (!onCreateProduct || !onUpdateProduct) {
      showToast("Firebase actions are not connected yet.", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      tag: form.tag || null,
      img:
        form.img.trim() ||
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
      price: String(product.price),
      category: product.category,
      tag: product.tag || "",
      img: product.img,
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
      <div className="bg-black text-white px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div>
          <h1 className="text-xl font-extrabold tracking-widest uppercase">
            SHOP Admin Panel
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            {products.length} products total
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(EMPTY_FORM);
          }}
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-100 active:scale-95 transition-all duration-150"
        >
          Add Product
        </button>
      </div>

      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl transition-all duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-extrabold mb-5 text-gray-800">
              {editId !== null ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Product Name
                </label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Classic Shirt"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Tag
                </label>
                <select
                  value={form.tag}
                  onChange={(event) =>
                    setForm({ ...form, tag: event.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  {TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag || "No Tag"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Image URL
                </label>
                <input
                  value={form.img}
                  onChange={(event) =>
                    setForm({ ...form, img: event.target.value })
                  }
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-150 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={filterCat}
            onChange={(event) => setFilterCat(event.target.value)}
            className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Products",
              value: products.length,
              color: "bg-black text-white",
            },
            {
              label: "Showing",
              value: filtered.length,
              color: "bg-white text-black border",
            },
            {
              label: "On Sale",
              value: products.filter((product) => product.tag === "Sale").length,
              color: "bg-red-50 text-red-600 border border-red-100",
            },
            {
              label: "New Arrivals",
              value: products.filter((product) => product.tag === "New").length,
              color: "bg-blue-50 text-blue-600 border border-blue-100",
            },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl px-5 py-4 ${stat.color}`}>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-xs opacity-70 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Product", "Category", "Price", "Tag", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider"
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
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/60 transition-colors duration-100"
                  >
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-10 h-12 object-cover rounded-lg bg-gray-100"
                      />
                      <span className="font-semibold text-gray-800 truncate max-w-[140px]">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{product.category}</td>
                    <td className="px-5 py-3 font-bold text-red-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-3">
                      {product.tag ? (
                        <span
                          className={`${TAG_COLORS[product.tag]} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}
                        >
                          {product.tag}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={isSaving}
                          className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150 disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          disabled={isSaving}
                          className="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-150 disabled:opacity-60"
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
            className="bg-white rounded-2xl p-6 shadow-2xl w-80 max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="font-extrabold text-lg mb-1">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-5">
              "
              {products.find(
                (product) => String(product.id) === String(deleteConfirm)
              )?.name}
              " will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isSaving}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 active:scale-95 transition-all duration-150 disabled:opacity-60"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isSaving}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-150 disabled:opacity-60"
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
