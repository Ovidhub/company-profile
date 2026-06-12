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
      // Section content can render after async data loads — retry briefly.
      const id = hash.slice(1);
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          // Images above may still be loading and shift the layout — correct once more.
          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 900);
        } else if (attempts++ < 20) {
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
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
