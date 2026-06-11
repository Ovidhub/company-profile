import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, formatPrice } from "../data/products";
import { useAdminData } from "../context/AdminDataContext";
import { useCart } from "../context/CartContext";
import { Star, ShoppingCart, Heart, Eye, Search, Filter, X, ChevronRight, Truck, Shield, RotateCcw, Headphones, ShoppingBag } from "lucide-react";

export default function ShopPage() {
  const { addToCart } = useCart();
  const { categories } = useAdminData();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Build dynamic category list with product counts (filter out inactive)
  const displayCategories = useMemo(() => {
    return categories
      .filter((c) => c.active)
      .map((c) => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        description: c.description,
        count: c.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length,
      }));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let products = [...PRODUCTS];
    if (activeCategory !== "all") {
      products = products.filter((p) => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "price-low": products.sort((a, b) => a.price - b.price); break;
      case "price-high": products.sort((a, b) => b.price - a.price); break;
      case "rating": products.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return products;
  }, [activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1030] via-[#1b2058] to-[#111540] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1030]/95 via-[#1b2058]/85 to-[#0d1030]/60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Shop</span>
          </nav>
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-light text-xs font-semibold uppercase tracking-[0.2em] rounded-full mb-4 border border-accent/30">
              Online Shop
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
              Premium Tech for <span className="text-accent">Modern Living</span>
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Discover our curated collection of smartphones, laptops, audio gear, wearables, and smart home devices — all backed by our quality guarantee and expert support.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-accent" /><span>Free Shipping Over $500</span></div>
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /><span>2-Year Warranty</span></div>
              <div className="flex items-center gap-2"><RotateCcw className="w-5 h-5 text-accent" /><span>30-Day Returns</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b sticky top-20 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {displayCategories.map((cat) => {
              const Icon = cat.icon || ShoppingBag;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-custom text-dark/70 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  {cat.id !== "all" && <span className="text-xs opacity-70">({cat.count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-dark">{filteredProducts.length}</span> products
              {activeCategory !== "all" && <span> in <span className="font-semibold text-primary">{displayCategories.find(c => c.id === activeCategory)?.label}</span></span>}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-dark mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onView={() => setSelectedProduct(product)} onAdd={() => handleAddToCart(product)} added={addedId === product.id} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over $500" },
              { icon: Shield, title: "Secure Payment", desc: "100% protected checkout" },
              { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
              { icon: Headphones, title: "24/7 Support", desc: "Expert help anytime" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-dark">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Link to="/cart" className="fixed bottom-24 right-8 z-40 bg-primary text-white px-4 py-3 rounded-full shadow-xl shadow-primary/40 flex items-center gap-2 hover:bg-primary-light transition-all">
        <ShoppingBag className="w-5 h-5" />
        <span className="font-semibold text-sm">View Cart</span>
      </Link>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative bg-gray-custom p-8 flex items-center justify-center min-h-[300px]">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="max-w-full max-h-80 object-contain" />
                {selectedProduct.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white text-xs font-bold uppercase rounded-full">
                    {selectedProduct.badge}
                  </span>
                )}
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">{selectedProduct.categoryLabel}</span>
                <h2 className="text-2xl font-bold text-dark mt-1 mb-2">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? "fill-accent text-accent" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">{formatPrice(selectedProduct.price)}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                <ul className="space-y-2 mb-6">
                  {selectedProduct.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />{f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-3 h-3 rounded-full ${selectedProduct.inStock ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-sm font-medium ${selectedProduct.inStock ? "text-green-700" : "text-red-700"}`}>
                    {selectedProduct.inStock ? "In Stock — Ships within 24hrs" : "Currently Out of Stock"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={!selectedProduct.inStock}
                    onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                    className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button className="px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onView, onAdd, added }: { product: typeof PRODUCTS[0]; onView: () => void; onAdd: () => void; added: boolean }) {
  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="relative aspect-square overflow-hidden bg-gray-custom">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 bg-accent text-white text-[9px] sm:text-xs font-bold uppercase rounded-full">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onView} className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-all">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-accent hover:text-white transition-all">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      <div className="p-2.5 sm:p-4">
        <span className="text-[10px] sm:text-xs text-accent font-semibold uppercase tracking-wider">{product.categoryLabel}</span>
        <h3 className="font-bold text-dark mt-0.5 sm:mt-1 mb-1 sm:mb-2 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1 leading-tight">{product.name}</h3>
        <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-gray-300"}`} />
          ))}
          <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-2 mb-3 sm:mb-4">
          <span className="text-sm sm:text-xl font-bold text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button
          disabled={!product.inStock}
          onClick={onAdd}
          className={`w-full px-2 py-1.5 sm:px-4 sm:py-2.5 text-[11px] sm:text-sm font-semibold rounded-md sm:rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary-light"
          }`}
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
          {added ? "Added!" : product.inStock ? "Add" : "Notify"}
        </button>
      </div>
    </div>
  );
}
