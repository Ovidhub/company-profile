import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, ShoppingBag, Search, type LucideIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { IMAGES } from "../data/images";

interface NavLink {
  label: string;
  href: string;
  isRoute: boolean;
  icon?: LucideIcon;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/", isRoute: true },
  { label: "About Us", href: "/#about", isRoute: false },
  { label: "Service", href: "/#service", isRoute: false },
  { label: "Shop", href: "/shop", isRoute: true, icon: ShoppingBag },
  { label: "Faq's", href: "/#faq", isRoute: false },
  { label: "Contact", href: "/#contact", isRoute: false },
];

export default function Header({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const isShopPage = location.pathname === "/shop";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolledOrShop = scrolled || isShopPage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolledOrShop
          ? "bg-white shadow-lg"
          : "bg-[#1b2058]/95 backdrop-blur-md shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={IMAGES.logoFull}
              alt="De Ebrightmarn"
              className={`h-auto max-h-12 w-auto transition-all ${
                isScrolledOrShop ? "" : "brightness-0 invert"
              }`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.isRoute ? location.pathname === link.href : false;
              const linkClass = `text-sm font-semibold tracking-wide transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full flex items-center gap-1.5 ${
                isActive
                  ? "text-primary"
                  : isScrolledOrShop
                  ? "text-primary/80 hover:text-primary"
                  : "text-white hover:text-accent"
              }`;
              return link.isRoute ? (
                <Link key={link.label} to={link.href} className={linkClass}>
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              );
            })}

            <Link
              to="/cart"
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                isScrolledOrShop
                  ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                  : "bg-white/10 text-white hover:bg-accent hover:text-white"
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">{totalItems}</span>
              )}
            </Link>

            <a
              href="/#contact"
              className="ml-2 px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-light transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50"
            >
              Get in Touch
            </a>
          </nav>

          {/* Right side: mobile action icons + menu toggle (all grouped on the right) */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              to="/shop"
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                isScrolledOrShop
                  ? "text-primary hover:bg-primary/10"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                isScrolledOrShop
                  ? "text-primary hover:bg-primary/10"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">{totalItems}</span>
              )}
            </Link>
            <button
              className={`p-2 ${isScrolledOrShop ? "text-primary" : "text-white"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = link.isRoute ? location.pathname === link.href : false;
              return link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-3 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                    isActive ? "text-primary bg-primary/10" : "text-primary/80 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-3 text-primary/80 hover:text-primary hover:bg-primary/5 font-semibold rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors"
            >
              <ShoppingCart className="w-4 h-4" /> View Cart
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-light transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Visit Shop
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
