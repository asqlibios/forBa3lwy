import { useState } from "react";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data/products";

const CATEGORIES = ["Women", "Men", "Kids", "New In", "Sale", "Accessories", "Shoes", "Home & Living"];
const TAGS = ["", "Bestseller", "New", "Sale"];

const TAG_COLORS = {
  Bestseller: "bg-orange-500",
  New: "bg-blue-500",
  Sale: "bg-red-500",
};

const EMPTY_FORM = { name: "", price: "", category: "Men", tag: "", img: "" };

export default function AdminPage({ products, setProducts }) {
  // If no external state is passed, use local state seeded from INITIAL_PRODUCTS
  const [localProducts, setLocalProducts] = useState(INITIAL_PRODUCTS);
  const list = products ?? localProducts;
  const setList = setProducts ?? setLocalProducts;

  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = list.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price || isNaN(Number(form.price))) {
      showToast("Please fill in name and a valid price.", "error");
      return;
    }

    if (editId !== null) {
      setList((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, ...form, price: parseFloat(form.price), tag: form.tag || null }
            : p
        )
      );
      showToast(`"${form.name}" updated successfully.`);
    } else {
      const newProduct = {
        id: Date.now(),
        ...form,
        price: parseFloat(form.price),
        tag: form.tag || null,
        img:
          form.img.trim() ||
          `https://placehold.co/300x360/f3f4f6/374151?text=${encodeURIComponent(form.name)}`,
      };
      setList((prev) => [...prev, newProduct]);
      showToast(`"${form.name}" added successfully.`);
    }

    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: String(p.price), category: p.category, tag: p.tag || "", img: p.img });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const p = list.find((x) => x.id === id);
    setList((prev) => prev.filter((x) => x.id !== id));
    setDeleteConfirm(null);
    showToast(`"${p.name}" deleted.`, "error");
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-black text-white px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div>
          <h1 className="text-xl font-extrabold tracking-widest uppercase">SHOP — Admin Panel</h1>
          <p className="text-gray-400 text-xs mt-0.5">{list.length} products total</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-100 active:scale-95 transition-all duration-150"
        >
          + Add Product
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl transition-all duration-300
            ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-extrabold mb-5 text-gray-800">
              {editId !== null ? "✏️ Edit Product" : "➕ Add New Product"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Product Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Classic Shirt"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Price (USD) *</label>
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 19.99"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tag</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  {TAGS.map((t) => <option key={t} value={t}>{t || "— No Tag —"}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Image URL (optional)</label>
                <input
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="https://... (leave blank for auto-placeholder)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all duration-150"
              >
                {editId !== null ? "Save Changes" : "Add Product"}
              </button>
              <button
                onClick={cancelForm}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search products..."
            className="flex-1 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: list.length, color: "bg-black text-white" },
            { label: "Showing", value: filtered.length, color: "bg-white text-black border" },
            { label: "On Sale", value: list.filter(p => p.tag === "Sale").length, color: "bg-red-50 text-red-600 border border-red-100" },
            { label: "New Arrivals", value: list.filter(p => p.tag === "New").length, color: "bg-blue-50 text-blue-600 border border-blue-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl px-5 py-4 ${s.color}`}>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Product", "Category", "Price", "Tag", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors duration-100">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-10 h-12 object-cover rounded-lg bg-gray-100" />
                      <span className="font-semibold text-gray-800 truncate max-w-[140px]">{p.name}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.category}</td>
                    <td className="px-5 py-3 font-bold text-red-500">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      {p.tag ? (
                        <span className={`${TAG_COLORS[p.tag]} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}>
                          {p.tag}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-150"
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

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-2xl w-80 max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className="font-extrabold text-lg mb-1">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-5">
              "{list.find((p) => p.id === deleteConfirm)?.name}" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 active:scale-95 transition-all duration-150"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-150"
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
