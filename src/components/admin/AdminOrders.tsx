import { useState } from "react";
import { useAdminData, Order } from "../../context/AdminDataContext";
import { formatPrice } from "../../data/products";
import { ChevronDown, X, MapPin, Phone, Mail, Trash2, ShoppingBag, Eye } from "lucide-react";

const STATUSES: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, removeOrder } = useAdminData();
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "primary", key: "all" as const },
          { label: "Pending", value: stats.pending, color: "gray-500", key: "pending" as const },
          { label: "Processing", value: stats.processing, color: "yellow-600", key: "processing" as const },
          { label: "Shipped", value: stats.shipped, color: "blue-600", key: "shipped" as const },
          { label: "Delivered", value: stats.delivered, color: "green-600", key: "delivered" as const },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`bg-white rounded-xl p-4 border text-left transition-all ${
              filter === s.key ? "border-primary shadow-md ring-2 ring-primary/20" : "border-gray-100 hover:border-primary/30"
            }`}
          >
            <p className={`text-2xl font-bold text-${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-custom border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-custom/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary font-bold">{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-dark">{o.customer.name}</p>
                    <p className="text-xs text-gray-500">{o.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.items.reduce((s, i) => s + i.quantity, 0)} item(s)</td>
                  <td className="px-4 py-3 font-bold text-primary">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{o.date}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                        className={`appearance-none pr-7 pl-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${STATUS_COLORS[o.status]}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewingOrder(o)} className="p-1.5 text-primary hover:bg-primary/10 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (confirm("Delete this order?")) removeOrder(o.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setViewingOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-dark">Order Details</h2>
                <p className="text-xs font-mono text-primary">{viewingOrder.id}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-1.5 text-gray-500 hover:text-dark">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status & Date */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[viewingOrder.status]}`}>
                  {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">{viewingOrder.date}</span>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer</h3>
                <p className="font-semibold text-dark">{viewingOrder.customer.name}</p>
                <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                  <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {viewingOrder.customer.email}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {viewingOrder.customer.phone}</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h3>
                <p className="text-sm text-dark flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {viewingOrder.customer.address}, {viewingOrder.customer.city}, {viewingOrder.customer.state} {viewingOrder.customer.zip}, {viewingOrder.customer.country}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items</h3>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-custom rounded-lg">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(viewingOrder.subtotal)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{viewingOrder.shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(viewingOrder.shipping)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatPrice(viewingOrder.tax)}</span></div>
                <div className="flex justify-between font-bold text-dark pt-2 border-t"><span>Total</span><span className="text-primary text-lg">{formatPrice(viewingOrder.total)}</span></div>
              </div>

              <div className="text-xs text-gray-500">Payment: {viewingOrder.paymentMethod}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
