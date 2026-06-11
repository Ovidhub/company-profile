import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAdminData, Order } from "../context/AdminDataContext";
import { formatPrice } from "../data/products";
import { ChevronRight, CreditCard, Truck, Shield, Check, MapPin, User, Mail, Phone, Lock, Lock as LockIcon, Building2, Banknote, Info } from "lucide-react";

type Step = 1 | 2 | 3;

const SHIPPING_METHODS = [
  { id: "std", label: "Standard Delivery", sub: "5-7 business days", price: 25, freeOver: 500 },
  { id: "exp", label: "Express Delivery", sub: "2-3 business days", price: 50 },
  { id: "pck", label: "Same Day Pickup (Abuja)", sub: "Pickup in 4 hours", price: 0 },
] as const;

type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

function luhnValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function expiryValid(expiry: string): boolean {
  const match = expiry.match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export default function CheckoutPage() {
  const { items, subtotal, tax, clearCart } = useCart();
  const navigate = useNavigate();
  const { publicPaymentMethods, addOrder } = useAdminData();
  const enabledMethods = publicPaymentMethods.filter((m) => m.enabled).sort((a, b) => a.order - b.order);
  const [selectedPayment, setSelectedPayment] = useState<string>(() => enabledMethods.find((m) => m.isDefault)?.id || enabledMethods[0]?.id || "");
  const [step, setStep] = useState<Step>(1);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("std");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "Nigeria",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
    saveInfo: true,
  });
  const [orderId] = useState(`DEE-${Date.now().toString().slice(-8)}`);

  const selectedMethod = enabledMethods.find((m) => m.id === selectedPayment);

  const shippingOption = SHIPPING_METHODS.find((m) => m.id === shippingMethod) || SHIPPING_METHODS[0];
  const shippingCost = "freeOver" in shippingOption && subtotal > shippingOption.freeOver ? 0 : shippingOption.price;
  const total = subtotal + shippingCost + tax;

  const update = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (!e[k]) return e;
      const { [k]: _removed, ...rest } = e;
      return rest;
    });
  };

  const validateStep = (s: Step): boolean => {
    const next: Record<string, string> = {};
    if (s === 1) {
      if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address";
      if (!form.firstName.trim()) next.firstName = "First name is required";
      if (!form.lastName.trim()) next.lastName = "Last name is required";
      if (!PHONE_RE.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    }
    if (s === 2) {
      if (!form.address.trim()) next.address = "Street address is required";
      if (!form.city.trim()) next.city = "City is required";
      if (!form.state.trim()) next.state = "State is required";
      if (!form.zip.trim()) next.zip = "ZIP / postal code is required";
    }
    if (s === 3) {
      if (!selectedMethod) next.payment = "Please select a payment method";
      if (selectedMethod?.type === "card") {
        if (!form.cardName.trim()) next.cardName = "Name on card is required";
        if (!luhnValid(form.cardNumber)) next.cardNumber = "Enter a valid card number";
        if (!expiryValid(form.expiry)) next.expiry = "Enter a valid expiry (MM/YY)";
        if (!/^\d{3,4}$/.test(form.cvv.trim())) next.cvv = "Enter a valid CVV";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToStep = (s: Step, from: Step) => {
    if (s > from && !validateStep(from)) return;
    setStep(s);
  };

  const handlePlaceOrder = () => {
    if (!validateStep(3) || !selectedMethod) return;

    // Card details are intentionally NOT stored — only a masked label is kept.
    const paymentLabel = selectedMethod.type === "card"
      ? `Card ending ${form.cardNumber.replace(/\D/g, "").slice(-4)}`
      : selectedMethod.name;

    const order: Order = {
      id: orderId,
      customer: {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
        country: form.country,
      },
      items: items.map((i) => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal,
      shipping: shippingCost,
      tax,
      total,
      status: "pending",
      paymentMethod: paymentLabel,
      date: new Date().toISOString().slice(0, 10),
    };

    addOrder(order);
    clearCart();
    navigate(`/order-confirmation?order=${orderId}`);
  };

  const steps = [
    { n: 1, label: "Information", icon: User },
    { n: 2, label: "Shipping", icon: Truck },
    { n: 3, label: "Payment", icon: CreditCard },
  ];

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 outline-none ${
      errors[field] ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-primary/20"
    }`;

  const fieldError = (field: string) =>
    errors[field] ? <p className="text-xs text-red-600 mt-1">{errors[field]}</p> : null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-custom pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-custom pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d1030] via-[#1b2058] to-[#111540] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-accent">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/cart" className="hover:text-accent">Cart</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">Checkout</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold">Secure <span className="text-accent">Checkout</span></h1>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {steps.map((s, i) => (
                <div key={s.n} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        step > s.n ? "bg-green-500 text-white" : step === s.n ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step > s.n ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs sm:text-sm mt-2 font-semibold ${step >= s.n ? "text-dark" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded ${step > s.n ? "bg-green-500" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-bold text-dark mb-1">Contact Information</h2>
                    <p className="text-sm text-gray-500 mb-6">We'll use this to send you order updates</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" maxLength={254} className={`${inputClass("email")} pl-10`} />
                        </div>
                        {fieldError("email")}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">First Name *</label>
                          <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="John" maxLength={60} className={inputClass("firstName")} />
                          {fieldError("firstName")}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Last Name *</label>
                          <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Doe" maxLength={60} className={inputClass("lastName")} />
                          {fieldError("lastName")}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234 800 000 0000" maxLength={20} className={`${inputClass("phone")} pl-10`} />
                        </div>
                        {fieldError("phone")}
                      </div>
                      <button onClick={() => goToStep(2, 1)} className="w-full mt-4 px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/30">
                        Continue to Shipping
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="text-xl font-bold text-dark mb-1">Shipping Address</h2>
                    <p className="text-sm text-gray-500 mb-6">Where should we deliver your order?</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Street Address *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main Street" maxLength={200} className={`${inputClass("address")} pl-10`} />
                        </div>
                        {fieldError("address")}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">City *</label>
                          <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Abuja" maxLength={80} className={inputClass("city")} />
                          {fieldError("city")}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">State *</label>
                          <input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="FCT" maxLength={80} className={inputClass("state")} />
                          {fieldError("state")}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">ZIP / Postal Code *</label>
                          <input value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="900001" maxLength={12} className={inputClass("zip")} />
                          {fieldError("zip")}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Country *</label>
                          <select value={form.country} onChange={(e) => update("country", e.target.value)} className={`${inputClass("country")} bg-white`}>
                            <option>Nigeria</option>
                            <option>Ghana</option>
                            <option>Kenya</option>
                            <option>South Africa</option>
                            <option>United States</option>
                            <option>United Kingdom</option>
                          </select>
                        </div>
                      </div>

                      {/* Shipping Method */}
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold text-dark mb-3">Shipping Method</h3>
                        <div className="space-y-2">
                          {SHIPPING_METHODS.map((m) => {
                            const isFree = m.price === 0 || ("freeOver" in m && subtotal > m.freeOver);
                            return (
                              <label key={m.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === m.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary"}`}>
                                <div className="flex items-center gap-3">
                                  <input type="radio" name="shipping" checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="accent-primary" />
                                  <div>
                                    <p className="font-semibold text-dark text-sm">{m.label}</p>
                                    <p className="text-xs text-gray-500">{m.sub}</p>
                                  </div>
                                </div>
                                <span className={`text-sm font-semibold ${isFree ? "text-green-600" : "text-dark"}`}>
                                  {isFree ? "FREE" : formatPrice(m.price)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <label className="flex items-center gap-2 mt-4 cursor-pointer">
                        <input type="checkbox" checked={form.saveInfo} onChange={(e) => update("saveInfo", e.target.checked)} className="accent-primary" />
                        <span className="text-sm text-gray-700">Save this information for next time</span>
                      </label>

                      <div className="flex gap-3 mt-4">
                        <button onClick={() => goToStep(1, 2)} className="px-6 py-3.5 border-2 border-gray-200 text-dark font-semibold rounded-lg hover:bg-gray-custom transition-all">
                          ← Back
                        </button>
                        <button onClick={() => goToStep(3, 2)} className="flex-1 px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/30">
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="text-xl font-bold text-dark mb-1">Payment Details</h2>
                    <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5"><Lock className="w-4 h-4 text-green-600" /> Your payment is encrypted and secure</p>

                    {/* Payment Method Tabs — pulled from admin */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {enabledMethods.length === 0 ? (
                        <p className="col-span-full text-sm text-gray-500 text-center py-4">No payment methods available. Please contact the seller.</p>
                      ) : (
                        enabledMethods.map((m) => {
                          const Icon = m.type === "bank_transfer" ? Building2 : m.type === "cash_on_delivery" ? Banknote : CreditCard;
                          return (
                            <button
                              key={m.id}
                              onClick={() => { setSelectedPayment(m.id); setErrors((e) => { const { payment: _p, ...rest } = e; return rest; }); }}
                              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                                selectedPayment === m.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
                              }`}
                            >
                              <Icon className={`w-6 h-6 mx-auto mb-1 ${selectedPayment === m.id ? "text-primary" : "text-gray-500"}`} />
                              <p className="text-sm font-semibold text-dark">{m.name}</p>
                            </button>
                          );
                        })
                      )}
                    </div>
                    {fieldError("payment")}

                    {/* Method-specific details */}
                    {selectedMethod?.type === "card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name on Card *</label>
                          <input value={form.cardName} onChange={(e) => update("cardName", e.target.value)} placeholder="JOHN DOE" maxLength={60} autoComplete="cc-name" className={inputClass("cardName")} />
                          {fieldError("cardName")}
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Card Number *</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value.replace(/[^\d ]/g, ""))} placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric" autoComplete="cc-number" className={`${inputClass("cardNumber")} pl-10`} />
                          </div>
                          {fieldError("cardNumber")}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Expiry Date *</label>
                            <input value={form.expiry} onChange={(e) => update("expiry", e.target.value)} placeholder="MM/YY" maxLength={5} inputMode="numeric" autoComplete="cc-exp" className={inputClass("expiry")} />
                            {fieldError("expiry")}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">CVV *</label>
                            <input type="password" value={form.cvv} onChange={(e) => update("cvv", e.target.value.replace(/\D/g, ""))} placeholder="123" maxLength={4} inputMode="numeric" autoComplete="cc-csc" className={inputClass("cvv")} />
                            {fieldError("cvv")}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMethod?.type === "bank_transfer" && (
                      <div className="p-4 bg-gray-custom rounded-lg space-y-1.5 text-sm">
                        <p className="font-semibold text-dark mb-2">Transfer the total to the account below, using your order number <span className="font-mono text-primary">{orderId}</span> as the payment reference:</p>
                        {selectedMethod.bankName && <p><span className="text-gray-500">Bank:</span> <span className="font-semibold text-dark">{selectedMethod.bankName}</span></p>}
                        {selectedMethod.accountName && <p><span className="text-gray-500">Account Name:</span> <span className="font-semibold text-dark">{selectedMethod.accountName}</span></p>}
                        {selectedMethod.accountNumber && <p><span className="text-gray-500">Account Number:</span> <span className="font-mono font-semibold text-dark">{selectedMethod.accountNumber}</span></p>}
                        {selectedMethod.swiftCode && <p><span className="text-gray-500">SWIFT:</span> <span className="font-mono text-dark">{selectedMethod.swiftCode}</span></p>}
                      </div>
                    )}

                    {selectedMethod?.type === "cash_on_delivery" && (
                      <div className="p-4 bg-gray-custom rounded-lg text-sm text-gray-700 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <p>{selectedMethod.codInstructions || "Pay in cash when your order is delivered."}</p>
                      </div>
                    )}

                    {selectedMethod && ["paystack", "flutterwave", "stripe", "paypal"].includes(selectedMethod.type) && (
                      <div className="p-4 bg-gray-custom rounded-lg text-sm text-gray-700 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <p>After placing your order you will be redirected to <span className="font-semibold text-dark">{selectedMethod.name}</span>'s secure checkout to complete payment. Card details are never entered on this site.</p>
                      </div>
                    )}

                    {selectedMethod?.type === "custom" && selectedMethod.customInstructions && (
                      <div className="p-4 bg-gray-custom rounded-lg text-sm text-gray-700 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <p>{selectedMethod.customInstructions}</p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button onClick={() => goToStep(2, 3)} className="px-6 py-3.5 border-2 border-gray-200 text-dark font-semibold rounded-lg hover:bg-gray-custom transition-all">
                        ← Back
                      </button>
                      <button onClick={handlePlaceOrder} disabled={!selectedMethod} className="flex-1 px-6 py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                        <LockIcon className="w-4 h-4" /> Place Order — {formatPrice(total)}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Your payment info is processed securely. We never store your card details.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-32 space-y-4">
                <h3 className="text-base font-bold text-dark">Order Summary</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-custom flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.categoryLabel}</p>
                        <p className="text-sm font-bold text-primary mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Shipping ({shippingOption.label})</span><span className="font-semibold">{shippingCost === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingCost)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Tax</span><span className="font-semibold">{formatPrice(tax)}</span></div>
                </div>
                <div className="border-t pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-dark">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
