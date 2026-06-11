import { useAdminData } from "../../context/AdminDataContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  TrendingUp, Package, ShoppingBag, MessageSquare, DollarSign, Clock,
  ArrowUpRight, Film, Image
} from "lucide-react";
import { formatPrice } from "../../data/products";

export default function AdminDashboard() {
  const stats = useAdminData();
  const { user } = useAuth();

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "primary", change: "+12.5%" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "accent", change: "+3 this week" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "primary", change: "Needs attention" },
    { label: "Products", value: stats.totalProducts, icon: Package, color: "accent", change: `${stats.products.filter(p => p.inStock).length} in stock` },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#1b2058] to-[#2a3078] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{user?.name} 👋</h1>
            <p className="text-white/70 mt-2 text-sm">Here's what's happening with your store today.</p>
          </div>
          <Link to="/admin/products" className="px-5 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-light transition-all inline-flex items-center gap-2 self-start sm:self-auto">
            Manage Products <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-${c.color}/10 text-${c.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {c.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-dark">{c.value}</p>
              <p className="text-sm text-gray-500 mt-1">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              { to: "/admin/hero", label: "Edit Hero Slider", icon: Film },
              { to: "/admin/products", label: "Manage Products", icon: Package },
              { to: "/admin/orders", label: "View Orders", icon: ShoppingBag },
              { to: "/admin/images", label: "Update Images", icon: Image },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.to} to={a.to} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-custom transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-dark">{a.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-primary hover:text-primary-light font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {stats.orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-custom transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {order.customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{order.customer.name}</p>
                    <p className="text-xs text-gray-500">{order.id} · {order.items.length} item(s)</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === "delivered" ? "bg-green-100 text-green-700" :
                    order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                    order.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-dark flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Recent Messages
          </h3>
          <Link to="/admin/messages" className="text-sm text-primary hover:text-primary-light font-medium">View all →</Link>
        </div>
        {stats.messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No messages yet</p>
        ) : (
          <div className="space-y-2">
            {stats.messages.slice(0, 3).map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-custom transition-colors">
                <div className="w-9 h-9 rounded-full bg-accent/20 text-accent-dark flex-shrink-0 flex items-center justify-center text-xs font-bold">
                  {msg.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-dark truncate">{msg.name}</p>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{msg.message}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{new Date(msg.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
