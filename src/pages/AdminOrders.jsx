import { useEffect, useState } from "react";
import { removeOrder, subscribeToOrders } from "../services/orders";

function formatDate(value) {
  if (!value) return "-";

  const date =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrency(value) {
  return `SAR ${Number(value ?? 0).toFixed(2)}`;
}

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">{order.name || "-"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.phone || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                City
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.city || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Payment Method
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.paymentMethod || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold text-gray-900">Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Qty</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(order.products || []).map((product, index) => (
                    <tr key={`${product.name}-${index}`}>
                      <td className="px-4 py-3 text-gray-900">
                        {product.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.qty ?? 0}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.size || "-"}
                      </td>
                    </tr>
                  ))}
                  {(!order.products || order.products.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Address
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 whitespace-pre-line">
                {order.address || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Notes
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 whitespace-pre-line">
                {order.notes || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTable({ orders, onViewDetails, onDeleteOrder, deletingId }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer Name</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">City</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Payment Method</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.name || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">{order.phone || "-"}</td>
                <td className="px-6 py-4 text-gray-600">{order.city || "-"}</td>
                <td className="px-6 py-4 text-gray-600">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {order.paymentMethod || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(order)}
                      className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteOrder(order.id)}
                      disabled={deletingId === order.id}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === order.id ? "Deleting..." : "Delete Order"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminOrders({ onSeen }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((nextOrders) => {
      setOrders(nextOrders);
      setLoading(false);
      setError("");
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading && onSeen) {
      onSeen();
    }
  }, [loading, onSeen, orders.length]);

  const handleDeleteOrder = async (orderId) => {
    try {
      setDeletingId(orderId);
      await removeOrder(orderId);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (deleteError) {
      console.error("Failed to delete order:", deleteError);
      setError("Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              View, inspect, and delete customer orders.
            </p>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-gray-500 shadow-sm">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-gray-500 shadow-sm">
            No orders found.
          </div>
        ) : (
          <OrdersTable
            orders={orders}
            onViewDetails={setSelectedOrder}
            onDeleteOrder={handleDeleteOrder}
            deletingId={deletingId}
          />
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
