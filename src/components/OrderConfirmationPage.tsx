import { Link, useSearchParams } from "react-router-dom";
import { Check, Package, Truck, Mail, ArrowRight, Sparkles, Home, Download } from "lucide-react";
import { useAdminData } from "../context/AdminDataContext";
import { formatPrice } from "../data/products";

export default function OrderConfirmationPage() {
  const [params] = useSearchParams();
  const { lastOrder, orders } = useAdminData();
  const orderId = params.get("order") || "DEE-00000000";
  const order = lastOrder?.id === orderId ? lastOrder : orders.find((o) => o.id === orderId);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-custom pt-20">
      {/* Success Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1030] via-[#1b2058] to-[#111540] text-white py-12">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Success Animation */}
          <div className="w-24 h-24 rounded-full bg-green-500 mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-green-500/40 animate-[bounce_1s_ease-out]">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/20 text-accent-light text-xs font-semibold uppercase tracking-[0.2em] rounded-full mb-4 border border-accent/30">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">
            Thank You for Your <span className="text-accent">Order!</span>
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Your order has been placed successfully. We've sent a confirmation email with all the details.
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
            <p className="text-xs text-white/60 uppercase tracking-wider">Order Number</p>
            <p className="text-2xl font-bold text-accent">{orderId}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* What's Next */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> What Happens Next?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Mail, title: "Email Confirmation", desc: "Receipt sent to your email within 5 minutes", color: "primary" },
                { icon: Package, title: "Order Processing", desc: "We prepare and pack your items (1-2 days)", color: "accent" },
                { icon: Truck, title: "On the Way", desc: "Tracking info sent once shipped", color: "primary" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`w-14 h-14 rounded-xl bg-${s.color}/10 text-${s.color} mx-auto mb-3 flex items-center justify-center`}>
                    <s.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-dark mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dark">Order Details</h2>
              <button className="text-sm text-primary hover:text-primary-light font-semibold flex items-center gap-1">
                <Download className="w-4 h-4" /> Download Invoice
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shipping Address</p>
                {order ? (
                  <>
                    <p className="text-sm text-dark font-medium">{order.customer.name}</p>
                    <p className="text-sm text-gray-600">{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip}</p>
                    <p className="text-sm text-gray-600">{order.customer.country}</p>
                    <p className="text-sm text-gray-600">{order.customer.phone}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">Details sent to your email</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                <p className="text-sm text-dark font-medium">💳 {order ? order.paymentMethod : "See confirmation email"}</p>
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Truck className="w-4 h-4 text-accent" />
                  <span className="text-gray-700">Estimated Delivery: <span className="font-semibold text-dark">{estimatedDelivery.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span></span>
                </div>
              </div>
            </div>

            {order && (
              <div className="mb-6 pb-6 border-b">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Items Ordered</p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-baseline mt-4 pt-3 border-t">
                  <span className="text-sm font-bold text-dark">Total Paid</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            )}

            {/* Track Order CTA */}
            <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white text-center sm:text-left">
                <h3 className="font-bold mb-1">Track Your Order</h3>
                <p className="text-sm text-white/80">Get real-time updates on your delivery</p>
              </div>
              <button className="px-5 py-2.5 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2 whitespace-nowrap">
                Track Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/shop" className="btn-primary justify-center">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/" className="btn-outline justify-center">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          {/* Help */}
          <div className="bg-gray-custom rounded-2xl p-6 text-center">
            <h3 className="font-bold text-dark mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">Our support team is available 24/7 to assist you</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/#contact" className="text-sm text-primary hover:text-primary-light font-semibold">📧 support@de-ebrightmarn.com</Link>
              <span className="text-gray-300">|</span>
              <Link to="/#contact" className="text-sm text-primary hover:text-primary-light font-semibold">📞 +234 (0) 123 456 7890</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
