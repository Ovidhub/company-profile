import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IMAGES } from "../../data/images";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate("/admin");
    else setError(result.message || "Invalid email or password. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1030] via-[#1b2058] to-[#111540] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1b2058] to-[#0d1030] text-white p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <Link to="/" className="relative z-10 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to website
          </Link>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Admin Control Center</h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Manage your entire website content, products, orders, and customer messages from one powerful dashboard.
            </p>
            <ul className="space-y-3 text-sm text-white/80">
              {["Edit hero sliders and content", "Manage products and inventory", "Track orders and revenue", "View customer messages", "Update testimonials"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />{f}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 text-xs text-white/50">
            © 2024 De-ebrightmarn Limited
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="p-8 sm:p-12">
          <div className="lg:hidden mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to website
            </Link>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <img src={IMAGES.logoFull} alt="De Ebrightmarn" className="h-10 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-dark mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to access the admin panel</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/30 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : <><Lock className="w-4 h-4" /> Sign In to Admin</>}
            </button>
          </form>

          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-xs font-semibold text-accent-dark uppercase tracking-wider mb-2">Demo Credentials (dev only)</p>
              <div className="space-y-1 text-xs text-gray-600 font-mono">
                <p>📧 admin@de-ebrightmarn.com / 🔑 admin123</p>
                <p>📧 editor@de-ebrightmarn.com / 🔑 editor123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
