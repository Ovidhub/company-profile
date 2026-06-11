import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronRight, Tag, Truck, Shield } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, shipping, tax, total, totalItems } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "DEE10") {
      setDiscount(subtotal * 0.1);
      setCouponMsg("✓ Coupon applied: 10% off!");
    } else if (coupon.toUpperCase() === "WELCOME") {
      setDiscount(50);
      setCouponMsg("✓ $50 off applied!");
    } else {
      setCouponMsg("✗ Invalid coupon code");
    }
  };

  const finalTotal = total - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-custom pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-dark mb-3">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet. Browse our premium tech collection!</p>
            <Link to="/shop" className="btn-primary inline-flex">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-custom pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d1030] via-[#1b2058] to-[#111540] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-accent">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Cart</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Shopping Cart <span className="text-accent">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/shop" className="flex-shrink-0 w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-custom">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <span className="text-xs text-accent font-semibold uppercase tracking-wider">{item.categoryLabel}</span>
                          <Link to="/shop"><h3 className="font-bold text-dark mt-1 hover:text-primary transition-colors">{item.name}</h3></Link>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(item.rating) ? "text-accent" : "text-gray-300"}`}>★</span>
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({item.reviews})</span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors h-8 w-8 flex-shrink-0">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-dark hover:bg-gray-custom transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold text-dark">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-dark hover:bg-gray-custom transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{formatPrice(item.price * item.quantity)}</div>
                          {item.quantity > 1 && <div className="text-xs text-gray-500">{formatPrice(item.price)} each</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/shop" className="btn-outline">
                  ← Continue Shopping
                </Link>
                <button onClick={clearCart} className="px-7 py-3 border-2 border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-all">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-32 space-y-5">
                <h3 className="text-lg font-bold text-dark">Order Summary</h3>

                {/* Coupon */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Have a coupon?</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        placeholder="DEE10 or WELCOME"
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <button onClick={applyCoupon} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-all">
                      Apply
                    </button>
                  </div>
                  {couponMsg && <p className={`text-xs mt-1.5 ${couponMsg.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>{couponMsg}</p>}
                  <p className="text-xs text-gray-400 mt-1">Try: DEE10 or WELCOME</p>
                </div>

                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-dark">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Shipping</span>
                    <span className="font-semibold text-dark">{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-dark">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-dark">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button onClick={() => navigate("/checkout")} className="w-full px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                  <Shield className="w-4 h-4 text-accent" />
                  Secure 256-bit SSL Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
