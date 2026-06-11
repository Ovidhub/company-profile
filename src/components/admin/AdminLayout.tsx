import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdminData } from "../../context/AdminDataContext";
import { useState } from "react";
import {
  LayoutDashboard, Image, Package, MessageSquare, Quote, LogOut,
  Menu, X, ExternalLink, Bell, ShoppingBag, Film, Eye, FolderTree, CreditCard
} from "lucide-react";
import { IMAGES } from "../../data/images";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/hero", label: "Hero Slider", icon: Film },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, badgeKey: "pendingOrders" as const },
  { to: "/admin/payment", label: "Payment Methods", icon: CreditCard },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, badgeKey: "unreadMessages" as const },
  { to: "/admin/images", label: "Images", icon: Image },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const stats = useAdminData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-custom flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0d1030] text-white flex flex-col z-40 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={IMAGES.logoFull} alt="De Ebrightmarn" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-sm font-bold">
              {user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/60 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const badge = item.badgeKey ? (stats as any)[item.badgeKey] : 0;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-accent text-white text-xs font-bold">{badge}</span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">Quick Links</p>
            <Link to="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">
              <Eye className="w-4 h-4" /> View Site
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Link>
            <Link to="/shop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">
              <ShoppingBag className="w-4 h-4" /> View Shop
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-dark p-2">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-dark">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              {stats.unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-custom">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold">
                {user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <span className="text-sm font-medium text-dark">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
