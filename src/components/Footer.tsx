import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUp, ShoppingBag } from "lucide-react";
import { IMAGES } from "../data/images";
import { SERVICES } from "../data/services";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Services", href: "/#service" },
  { label: "Shop", href: "/shop" },
  { label: "Partnerships", href: "/#Team" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0d1030] text-white relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <Link to="/">
                <img src={IMAGES.logoFull} alt="De Ebrightmarn" className="h-auto max-h-14 w-auto brightness-0 invert" />
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Established in 2024, De-ebrightmarn Limited Company is a dynamic, multi-sector enterprise committed to driving innovation and excellence across diverse industries.
            </p>
            <Link to="/shop" className="inline-flex items-center text-accent text-sm font-medium hover:text-accent-light transition-colors mb-4">
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Visit Our Shop
            </Link>
            <br />
            <a href="/#about" className="inline-flex items-center text-accent text-sm font-medium hover:text-accent-light transition-colors">
              Read More
              <svg className="ml-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/shop") ? (
                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />{link.label}
                    </Link>
                  ) : link.href.startsWith("/#") ? (
                    <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />{link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />{link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-6">Our Services</h4>
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.id}>
                    <a href="/#service" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                      <Icon className="w-4 h-4 text-accent flex-shrink-0" /> {service.shortTitle}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span className="text-gray-400 text-sm">Abuja, Nigeria</span></li>
              <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span className="text-gray-400 text-sm">+234 (0) 123 456 7890</span></li>
              <li className="flex items-start gap-3"><Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span className="text-gray-400 text-sm">info@de-ebrightmarn.com</span></li>
            </ul>
            <div className="flex gap-3 mt-6">
              {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                <a key={social} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors" aria-label={social}>
                  <span className="text-xs uppercase font-bold text-white/70">{social.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; 2024 De-Ebrightmarn. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-xl hover:bg-accent-light transition-all hover:-translate-y-1" aria-label="Scroll to top">
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
