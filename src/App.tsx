import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminDataProvider } from "./context/AdminDataContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ShopPage from "./components/ShopPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";

// Admin imports
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminHero from "./components/admin/AdminHero";
import AdminProducts from "./components/admin/AdminProducts";
import AdminCategories from "./components/admin/AdminCategories";
import AdminOrders from "./components/admin/AdminOrders";
import AdminPaymentMethods from "./components/admin/AdminPaymentMethods";
import AdminMessages from "./components/admin/AdminMessages";
import AdminTestimonials from "./components/admin/AdminTestimonials";
import AdminImages from "./components/admin/AdminImages";
import ProtectedRoute from "./components/admin/ProtectedRoute";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // The target section renders right after navigation, but images loading
      // above it keep shifting the layout (and cancel smooth scrolling), so we
      // pin the section to the top with instant scrolls until things settle —
      // backing off the moment the user scrolls themselves.
      const id = hash.slice(1);
      const start = Date.now();
      let cancelled = false;
      const cancel = () => { cancelled = true; };
      window.addEventListener("wheel", cancel, { once: true, passive: true });
      window.addEventListener("touchmove", cancel, { once: true, passive: true });

      const settle = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          const offset = el.getBoundingClientRect().top;
          if (Math.abs(offset) > 8) {
            window.scrollTo({ top: window.scrollY + offset, behavior: "instant" as ScrollBehavior });
          }
          if (Date.now() - start < 3000) setTimeout(settle, 250);
        } else if (Date.now() - start < 2000) {
          setTimeout(settle, 100);
        }
      };
      settle();
      return () => {
        cancelled = true;
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchmove", cancel);
      };
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminDataProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              {/* Public site routes with main Header/Footer */}
              <Route
                path="/"
                element={
                  <div className="min-h-screen bg-white flex flex-col">
                    <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                    <main className="flex-1"><HomePage /></main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/shop"
                element={
                  <div className="min-h-screen bg-white flex flex-col">
                    <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                    <main className="flex-1"><ShopPage /></main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/cart"
                element={
                  <div className="min-h-screen bg-white flex flex-col">
                    <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                    <main className="flex-1"><CartPage /></main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/checkout"
                element={
                  <div className="min-h-screen bg-white flex flex-col">
                    <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                    <main className="flex-1"><CheckoutPage /></main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/order-confirmation"
                element={
                  <div className="min-h-screen bg-white flex flex-col">
                    <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                    <main className="flex-1"><OrderConfirmationPage /></main>
                    <Footer />
                  </div>
                }
              />

              {/* Admin routes - no main Header/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="payment" element={<AdminPaymentMethods />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="images" element={<AdminImages />} />
              </Route>
            </Routes>
          </CartProvider>
        </AdminDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
