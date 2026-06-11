import { Link } from "react-router-dom";
import { PRODUCTS, formatPrice } from "../data/products";
import { Star, ShoppingCart, ShoppingBag, Sparkles } from "lucide-react";

export default function FeaturedShop() {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #1b2058 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="tag-pill-accent inline-flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" /> Online Shop
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight mt-4">
            Shop Premium Tech <span className="text-primary">From De-ebrightmarn</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Browse our curated collection of smartphones, laptops, audio gear, and smart home devices. Free shipping on orders over $500.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
          {featured.map((product) => (
            <Link
              key={product.id}
              to="/shop"
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-custom">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-white text-xs font-bold uppercase rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-accent font-semibold uppercase tracking-wider">{product.categoryLabel}</span>
                <h3 className="font-bold text-dark mt-1 mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-gray-300"}`} />
                  ))}
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Shop CTA Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1b2058] via-[#2a3078] to-[#1b2058] rounded-3xl p-8 sm:p-12 text-center text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          </div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent-light text-xs font-semibold uppercase tracking-[0.2em] rounded-full mb-4 border border-accent/30">
              <Sparkles className="w-3.5 h-3.5" /> Premium Quality Guaranteed
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold mb-3">
              Ready to Upgrade Your <span className="text-accent">Tech Setup?</span>
            </h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              From the latest smartphones to professional audio gear — find everything you need with fast delivery, secure checkout, and our 2-year warranty.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/shop" className="px-8 py-3.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-light transition-all shadow-xl shadow-accent/30 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Visit Online Shop
              </Link>
              <Link to="/cart" className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-all flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> View Cart
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <span>✓ Free Shipping Over $500</span>
              <span>✓ 2-Year Warranty</span>
              <span>✓ 30-Day Returns</span>
              <span>✓ Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
