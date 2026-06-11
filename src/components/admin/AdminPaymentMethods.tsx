import { useState } from "react";
import { useAdminData } from "../../context/AdminDataContext";
import { PaymentMethod, PaymentMethodType } from "../../data/paymentMethods";
import {
  Plus, Edit2, Save, X, Trash2, CreditCard, Building2, Wallet,
  Banknote, Star, Eye, EyeOff, Shield, ArrowUp, ArrowDown,
  Sparkles, Globe
} from "lucide-react";

const TYPE_OPTIONS: { value: PaymentMethodType; label: string; icon: any; description: string }[] = [
  { value: "paystack", label: "Paystack", icon: CreditCard, description: "Nigerian payment gateway — cards, bank transfer, USSD" },
  { value: "flutterwave", label: "Flutterwave", icon: Globe, description: "Pan-African payments — cards, mobile money, bank transfer" },
  { value: "stripe", label: "Stripe", icon: CreditCard, description: "International credit/debit card payments" },
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2, description: "Direct bank transfer to corporate account" },
  { value: "cash_on_delivery", label: "Cash on Delivery", icon: Banknote, description: "Pay cash when order arrives" },
  { value: "paypal", label: "PayPal", icon: Wallet, description: "PayPal checkout" },
  { value: "card", label: "Credit/Debit Card", icon: CreditCard, description: "Generic card payment gateway" },
  { value: "custom", label: "Custom Method", icon: Sparkles, description: "Custom payment method (crypto, mobile money, etc.)" },
];

function getTypeInfo(type: PaymentMethodType) {
  return TYPE_OPTIONS.find((t) => t.value === type) || TYPE_OPTIONS[0];
}

function getTypeIcon(type: PaymentMethodType) {
  const info = getTypeInfo(type);
  return info.icon;
}

export default function AdminPaymentMethods() {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PaymentMethod>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const sortedMethods = [...paymentMethods].sort((a, b) => a.order - b.order);

  const startEdit = (m: PaymentMethod) => { setEditingId(m.id); setEditForm(m); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = () => {
    if (editingId) {
      updatePaymentMethod(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleAdd = (data: Omit<PaymentMethod, "id" | "order">) => {
    addPaymentMethod(data);
    setShowAddForm(false);
  };

  const moveMethod = (id: string, direction: "up" | "down") => {
    const ids = sortedMethods.map((m) => m.id);
    const idx = ids.indexOf(id);
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= ids.length) return;
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    // Reuse the reorder pattern — for now just swap orders
    setPaymentMethodsCustom(ids);
  };

  // Custom reorder helper
  const setPaymentMethodsCustom = (ids: string[]) => {
    sortedMethods.forEach((m) => {
      const newOrder = ids.indexOf(m.id);
      if (newOrder !== -1 && newOrder !== m.order) {
        updatePaymentMethod(m.id, { order: newOrder });
      }
    });
  };

  const stats = {
    total: paymentMethods.length,
    enabled: paymentMethods.filter((m) => m.enabled).length,
    default: paymentMethods.filter((m) => m.isDefault).length,
    online: paymentMethods.filter((m) => ["paystack", "flutterwave", "stripe", "paypal"].includes(m.type)).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Configure payment gateways and bank details for your online shop</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Payment Method
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-dark">{stats.total}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-accent">{stats.online}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Online</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-primary">{stats.default}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Default</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <PaymentMethodForm
          onCancel={() => setShowAddForm(false)}
          onSubmit={(data) => handleAdd(data as any)}
        />
      )}

      {/* Edit Form */}
      {editingId && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary" /> Editing: {editForm.name}
            </h3>
            <button onClick={cancelEdit} className="p-1.5 text-gray-500"><X className="w-5 h-5" /></button>
          </div>
          <PaymentMethodFields form={editForm} setForm={setEditForm} />
          <div className="flex gap-2 pt-2 border-t">
            <button onClick={saveEdit} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={cancelEdit} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">Cancel</button>
          </div>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-3">
        {sortedMethods.map((method, idx) => {
          const TypeIcon = getTypeIcon(method.type);
          return (
            <div
              key={method.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                editingId === method.id ? "border-primary shadow-md" : "border-gray-100 hover:border-primary/30"
              }`}
            >
              <div className="p-5 flex items-center gap-4">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveMethod(method.id, "up")}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveMethod(method.id, "down")}
                    disabled={idx === sortedMethods.length - 1}
                    className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  method.enabled ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-400"
                }`}>
                  <TypeIcon className="w-7 h-7" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-dark">{method.name}</h3>
                    {method.isDefault && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-accent text-white rounded flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" /> Default
                      </span>
                    )}
                    {method.type === "bank_transfer" && method.accountNumber && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {method.accountNumber}
                      </span>
                    )}
                    {!method.enabled && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded">Disabled</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{method.description || getTypeInfo(method.type).description}</p>
                  {/* Bank details preview */}
                  {method.type === "bank_transfer" && method.bankName && (
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">{method.bankName}</span> · {method.accountName}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!method.isDefault && method.enabled && (
                    <button
                      onClick={() => setDefaultPaymentMethod(method.id)}
                      className="px-3 py-1.5 border border-accent text-accent text-xs font-semibold rounded-lg hover:bg-accent hover:text-white transition-colors"
                      title="Set as default"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => updatePaymentMethod(method.id, { enabled: !method.enabled })}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                    title={method.enabled ? "Disable" : "Enable"}
                  >
                    {method.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(method)} className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete "${method.name}"?\n\nThis will remove it from the checkout options.`)) removePaymentMethod(method.id); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {paymentMethods.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-dark mb-1">No payment methods yet</h3>
          <p className="text-sm text-gray-500 mb-4">Add at least one payment method to start accepting orders</p>
          <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4 inline" /> Add First Payment Method
          </button>
        </div>
      )}
    </div>
  );
}

// === ADD FORM ===
function PaymentMethodForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (data: Omit<PaymentMethod, "id" | "order">) => void }) {
  const [form, setForm] = useState<Partial<PaymentMethod>>({
    name: "",
    type: "paystack",
    enabled: true,
    isDefault: false,
    description: "",
    icon: "💳",
    publicKey: "",
    secretKey: "",
  });

  const handleSubmit = () => {
    if (!form.name?.trim()) {
      alert("Method name is required");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      type: form.type || "paystack",
      enabled: form.enabled ?? true,
      isDefault: form.isDefault ?? false,
      description: form.description?.trim() || "",
      icon: form.icon,
      bankName: form.bankName,
      accountName: form.accountName,
      accountNumber: form.accountNumber,
      routingNumber: form.routingNumber,
      swiftCode: form.swiftCode,
      bankAddress: form.bankAddress,
      publicKey: form.publicKey,
      secretKey: form.secretKey,
      codInstructions: form.codInstructions,
      customInstructions: form.customInstructions,
    } as any);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-primary/30 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-dark flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> New Payment Method
        </h3>
        <button onClick={onCancel} className="p-1.5 text-gray-500"><X className="w-5 h-5" /></button>
      </div>
      <PaymentMethodFields form={form} setForm={setForm} />
      <div className="flex gap-2 pt-2 border-t">
        <button onClick={handleSubmit} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Method
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">Cancel</button>
      </div>
    </div>
  );
}

// === SHARED FORM FIELDS ===
function PaymentMethodFields({ form, setForm }: { form: Partial<PaymentMethod>; setForm: (f: Partial<PaymentMethod>) => void }) {
  return (
    <div className="space-y-4">
      {/* Type Selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Type *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = form.type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, type: opt.value, icon: getDefaultIcon(opt.value) })}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  selected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${selected ? "text-primary" : "text-gray-500"}`} />
                <p className={`text-sm font-semibold ${selected ? "text-primary" : "text-dark"}`}>{opt.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Display Name *</label>
          <input
            type="text"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Paystack, GTBank Transfer"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
          <input
            type="text"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Customer-facing description"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Bank Transfer Fields */}
      {(form.type === "bank_transfer") && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Bank Account Details
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Bank Name *</label>
              <input type="text" value={form.bankName || ""} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="e.g. GTBank" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Account Name *</label>
              <input type="text" value={form.accountName || ""} onChange={(e) => setForm({ ...form, accountName: e.target.value })} placeholder="e.g. De-Ebrightmarn Limited" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Account Number *</label>
              <input type="text" value={form.accountNumber || ""} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} placeholder="e.g. 0123456789" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Routing / Sort Code</label>
              <input type="text" value={form.routingNumber || ""} onChange={(e) => setForm({ ...form, routingNumber: e.target.value })} placeholder="e.g. 058" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">SWIFT / BIC Code</label>
              <input type="text" value={form.swiftCode || ""} onChange={(e) => setForm({ ...form, swiftCode: e.target.value })} placeholder="e.g. GTBINGLA" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Bank Address (optional)</label>
              <input type="text" value={form.bankAddress || ""} onChange={(e) => setForm({ ...form, bankAddress: e.target.value })} placeholder="e.g. Plot 123, Ahmadu Bello Way, VI, Lagos" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Gateway API Keys */}
      {(form.type === "paystack" || form.type === "flutterwave" || form.type === "stripe" || form.type === "paypal") && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" /> API Credentials
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Public Key</label>
              <input type="text" value={form.publicKey || ""} onChange={(e) => setForm({ ...form, publicKey: e.target.value })} placeholder="pk_test_..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Secret / Private Key</label>
              <input type="password" value={form.secretKey || ""} onChange={(e) => setForm({ ...form, secretKey: e.target.value })} placeholder="sk_test_..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-mono" />
            </div>
          </div>
          <p className="text-xs text-blue-700 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Keys are stored locally in your browser. Use test keys for development.
          </p>
        </div>
      )}

      {/* Cash on Delivery Instructions */}
      {form.type === "cash_on_delivery" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-green-800 uppercase tracking-wider flex items-center gap-2">
            <Banknote className="w-4 h-4" /> Cash on Delivery Settings
          </p>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Instructions for Customers</label>
            <textarea
              value={form.codInstructions || ""}
              onChange={(e) => setForm({ ...form, codInstructions: e.target.value })}
              rows={3}
              placeholder="e.g. Available within Abuja FCT. Please have exact amount ready."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Custom Method */}
      {form.type === "custom" && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Custom Method Instructions
          </p>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Payment Instructions</label>
            <textarea
              value={form.customInstructions || ""}
              onChange={(e) => setForm({ ...form, customInstructions: e.target.value })}
              rows={3}
              placeholder="e.g. Send USDT to address 0x123... and email us the transaction hash."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Active / Default Toggles */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.enabled ?? true}
            onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium text-gray-700">Active (show in checkout)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefault ?? false}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium text-gray-700">Set as default payment method</span>
        </label>
      </div>
    </div>
  );
}

function getDefaultIcon(type: PaymentMethodType): string {
  const map: Record<PaymentMethodType, string> = {
    paystack: "💳",
    flutterwave: "🌍",
    stripe: "💎",
    bank_transfer: "🏦",
    cash_on_delivery: "💵",
    paypal: "💰",
    card: "💳",
    custom: "✨",
  };
  return map[type] || "💳";
}
