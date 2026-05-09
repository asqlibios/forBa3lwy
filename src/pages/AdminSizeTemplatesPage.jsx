import { useMemo, useState } from "react";
import {
  SIZE_TEMPLATE_CATEGORIES,
  SIZE_TEMPLATE_CATEGORY_LABELS,
} from "../data/sizing";

const EMPTY_TEMPLATE = {
  name: "",
  category: "shirt",
  measurementKeysText: "chest, length, shoulder",
  sizes: [
    { id: "size-1", label: "S", chest: "", length: "", shoulder: "" },
    { id: "size-2", label: "M", chest: "", length: "", shoulder: "" },
    { id: "size-3", label: "L", chest: "", length: "", shoulder: "" },
  ],
};

let sizeRowCounter = 4;

function createSizeRowId() {
  const id = `size-${sizeRowCounter}`;
  sizeRowCounter += 1;
  return id;
}

function normalizeMeasurementKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseMeasurementKeys(text) {
  return Array.from(
    new Set(text.split(",").map(normalizeMeasurementKey).filter(Boolean))
  );
}

function buildSizeRow(measurementKeys, seed = {}) {
  const nextRow = {
    id: seed.id || createSizeRowId(),
    label: seed.label || "",
  };

  measurementKeys.forEach((key) => {
    nextRow[key] = seed[key] ?? "";
  });

  return nextRow;
}

function formatTemplateForEdit(template) {
  const measurementKeys = template.measurementKeys || [];

  return {
    name: template.name,
    category: template.category,
    measurementKeysText: measurementKeys.join(", "),
    sizes: (template.sizes || []).map((size) =>
      buildSizeRow(measurementKeys, size)
    ),
  };
}

export default function AdminSizeTemplatesPage({
  templates = [],
  products = [],
  isLoading = false,
  error = "",
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) {
  const [form, setForm] = useState(EMPTY_TEMPLATE);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const measurementKeys = parseMeasurementKeys(form.measurementKeysText);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      return categoryFilter === "all" || template.category === categoryFilter;
    });
  }, [categoryFilter, templates]);

  const usageCountByTemplateId = useMemo(() => {
    return products.reduce((accumulator, product) => {
      if (!product.sizeTemplateId) {
        return accumulator;
      }

      const key = String(product.sizeTemplateId);
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});
  }, [products]);

  const deleteCandidate = templates.find(
    (template) => String(template.id) === String(deleteConfirm)
  );

  const showToastMessage = (msg, type = "success") => {
    setToast({ msg, type });
    window.clearTimeout(showToastMessage.timeoutId);
    showToastMessage.timeoutId = window.setTimeout(() => setToast(null), 2500);
  };

  const resetForm = () => {
    setForm(EMPTY_TEMPLATE);
    setEditId(null);
    setShowForm(false);
  };

  const syncSizesToMeasurementKeys = (nextKeys) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.map((size) => buildSizeRow(nextKeys, size)),
    }));
  };

  const handleMeasurementKeyChange = (value) => {
    const nextKeys = parseMeasurementKeys(value);
    setForm((current) => ({ ...current, measurementKeysText: value }));
    syncSizesToMeasurementKeys(nextKeys);
  };

  const handleSizeChange = (index, field, value) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.map((size, sizeIndex) =>
        sizeIndex === index ? { ...size, [field]: value } : size
      ),
    }));
  };

  const addSizeRow = () => {
    setForm((current) => ({
      ...current,
      sizes: [...current.sizes, buildSizeRow(measurementKeys)],
    }));
  };

  const removeSizeRow = (index) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.filter((_, sizeIndex) => sizeIndex !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToastMessage("Template name is required.", "error");
      return;
    }

    if (measurementKeys.length === 0) {
      showToastMessage("Add at least one measurement field.", "error");
      return;
    }

    const validSizes = form.sizes
      .map((size) => buildSizeRow(measurementKeys, size))
      .filter((size) => size.label.trim());

    if (validSizes.length === 0) {
      showToastMessage("Add at least one size row.", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      measurementKeys,
      sizes: validSizes,
    };

    try {
      setIsSaving(true);

      if (editId !== null) {
        await onUpdateTemplate(editId, payload);
        showToastMessage(`"${payload.name}" updated successfully.`);
      } else {
        await onCreateTemplate(payload);
        showToastMessage(`"${payload.name}" created successfully.`);
      }

      resetForm();
    } catch (submitError) {
      console.error("Failed to save size template:", submitError);
      showToastMessage("Could not save size template.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (template) => {
    setForm(formatTemplateForEdit(template));
    setEditId(template.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      setIsSaving(true);
      await onDeleteTemplate(id);
      setDeleteConfirm(null);
      showToastMessage("Template deleted.", "error");
    } catch (deleteError) {
      console.error("Failed to delete size template:", deleteError);
      showToastMessage("Could not delete size template.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-black px-8 py-5 text-white shadow-lg">
        <div>
          <h1 className="text-xl font-extrabold tracking-widest uppercase">
            Size Template Manager
          </h1>
          <p className="mt-0.5 text-xs text-gray-400">
            {templates.length} reusable templates
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm(EMPTY_TEMPLATE);
          }}
          className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all duration-150 hover:bg-gray-100 active:scale-95"
        >
          New Template
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

      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {error}
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <h2 className="mb-5 text-lg font-extrabold text-gray-800">
              {editId !== null ? "Edit Size Template" : "Create Size Template"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Template Name
                </label>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="e.g. Oversized Fit"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Template Category
                </label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {SIZE_TEMPLATE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {SIZE_TEMPLATE_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Measurement Fields
                </label>
                <input
                  value={form.measurementKeysText}
                  onChange={(event) =>
                    handleMeasurementKeyChange(event.target.value)
                  }
                  placeholder="chest, length, shoulder"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Use comma-separated keys. Example: waist, hip, inseam.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600">
                  Sizes
                </h3>
                <button
                  onClick={addSizeRow}
                  type="button"
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Add Size Row
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Size
                      </th>
                      {measurementKeys.map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500"
                        >
                          {key}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {form.sizes.map((size, index) => (
                      <tr key={size.id}>
                        <td className="px-4 py-3">
                          <input
                            value={size.label}
                            onChange={(event) =>
                              handleSizeChange(index, "label", event.target.value)
                            }
                            placeholder="S"
                            className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </td>
                        {measurementKeys.map((key) => (
                          <td key={key} className="px-4 py-3">
                            <input
                              value={size[key] ?? ""}
                              onChange={(event) =>
                                handleSizeChange(index, key, event.target.value)
                              }
                              placeholder="0"
                              className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeSizeRow(index)}
                            type="button"
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : editId !== null
                    ? "Save Changes"
                    : "Create Template"}
              </button>
              <button
                onClick={resetForm}
                disabled={isSaving}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-black px-5 py-4 text-white">
              <p className="text-2xl font-extrabold">{templates.length}</p>
              <p className="mt-0.5 text-xs opacity-70">All Templates</p>
            </div>
            {SIZE_TEMPLATE_CATEGORIES.map((category) => (
              <div
                key={category}
                className="rounded-xl border border-gray-200 bg-white px-5 py-4"
              >
                <p className="text-2xl font-extrabold text-gray-900">
                  {templates.filter((template) => template.category === category).length}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {SIZE_TEMPLATE_CATEGORY_LABELS[category]}
                </p>
              </div>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Template Categories</option>
            {SIZE_TEMPLATE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {SIZE_TEMPLATE_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                {["Template", "Category", "Sizes", "Linked Products", "Actions"].map(
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
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    Loading templates...
                  </td>
                </tr>
              ) : filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    No templates found.
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{template.name}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Fields: {(template.measurementKeys || []).join(", ")}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {SIZE_TEMPLATE_CATEGORY_LABELS[template.category] ||
                        template.category}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {(template.sizes || []).map((size) => size.label).join(", ")}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {usageCountByTemplateId[String(template.id)] || 0}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(template)}
                          disabled={isSaving}
                          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold hover:bg-gray-200 disabled:opacity-60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(template.id)}
                          disabled={isSaving}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
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
            <h3 className="mb-1 text-lg font-extrabold">Delete Template?</h3>
            <p className="mb-2 text-sm text-gray-500">
              "{deleteCandidate?.name ?? "Template"}" will be permanently removed.
            </p>
            <p className="mb-5 text-xs text-amber-600">
              Linked products will keep working, but their template reference will be cleared.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {isSaving ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
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
