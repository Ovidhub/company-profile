import { useState } from "react";
import { useAdminData } from "../../context/AdminDataContext";
import { Category, AVAILABLE_ICONS } from "../../data/products";
import { ShoppingBag, Plus, Edit2, Save, X, Trash2, Tag, ArrowUp, ArrowDown, FolderTree, Eye, EyeOff, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(AVAILABLE_ICONS.map((i) => [i.name, i.icon]));

const FALLBACK_ICON = ShoppingBag;

function CategoryIcon({ iconName, className = "w-5 h-5" }: { iconName?: string; className?: string }) {
  const Icon = (iconName && ICON_MAP[iconName]) || FALLBACK_ICON;
  return <Icon className={className} />;
}

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, removeCategory, reorderCategories, products } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const productCountFor = (catId: string) => products.filter((p) => p.category === catId).length;

  const startEdit = (c: Category) => { setEditingId(c.id); setEditForm(c); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = () => {
    if (editingId) { updateCategory(editingId, editForm); setEditingId(null); setEditForm({}); }
  };

  const handleAdd = (data: Omit<Category, "id" | "order">) => {
    addCategory(data);
    setShowAddForm(false);
  };

  const moveCategory = (id: string, direction: "up" | "down") => {
    const ids = sortedCategories.map((c) => c.id);
    const idx = ids.indexOf(id);
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= ids.length) return;
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    reorderCategories(ids);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories for your online shop</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-dark">{categories.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.active).length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-yellow-600">{categories.filter(c => !c.active).length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Inactive</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-primary">{categories.length - 1}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Custom</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <CategoryForm
          onCancel={() => setShowAddForm(false)}
          onSubmit={(data) => handleAdd(data as any)}
        />
      )}

      {/* Edit Form (Expanded) */}
      {editingId && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark">Editing Category: {editForm.label}</h3>
            <button onClick={cancelEdit} className="p-1.5 text-gray-500"><X className="w-5 h-5" /></button>
          </div>
          <CategoryFormFields form={editForm} setForm={setEditForm} editId={editingId} />
          <div className="flex gap-2 pt-2 border-t">
            <button onClick={saveEdit} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={cancelEdit} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">Cancel</button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {sortedCategories.map((cat, idx) => {
          const count = productCountFor(cat.id);
          const isSystem = cat.id === "all";
          return (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl border transition-all ${
                editingId === cat.id ? "border-primary shadow-md" : "border-gray-100 hover:border-primary/30"
              }`}
            >
              <div className="p-4 sm:p-5 flex items-center gap-4">
                {/* Drag handle / order buttons */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveCategory(cat.id, "up")}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveCategory(cat.id, "down")}
                    disabled={idx === sortedCategories.length - 1}
                    className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  cat.active ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-400"
                }`}>
                  <CategoryIcon iconName={(cat.icon as any)?.name || (cat.icon as any)} className="w-6 h-6" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-dark">{cat.label}</h3>
                    {isSystem && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-accent/10 text-accent-dark rounded">System</span>}
                    {!cat.active && <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded">Inactive</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    ID: <code className="bg-gray-100 px-1 rounded">{cat.id}</code>
                    {cat.description && ` · ${cat.description}`}
                  </p>
                </div>

                {/* Product count */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-lg font-bold text-primary">{count}</p>
                  <p className="text-xs text-gray-500">product{count !== 1 ? "s" : ""}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => updateCategory(cat.id, { active: !cat.active })}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                    title={cat.active ? "Deactivate" : "Activate"}
                    disabled={isSystem}
                  >
                    {cat.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {!isSystem && (
                    <button
                      onClick={() => { if (confirm(`Delete category "${cat.label}"?\n\n${count > 0 ? `${count} product(s) will be moved to "Other".` : "No products affected."}`)) removeCategory(cat.id); }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <FolderTree className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-dark mb-1">No categories yet</h3>
          <p className="text-sm text-gray-500 mb-4">Create your first category to start organizing products</p>
          <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4 inline" /> Add First Category
          </button>
        </div>
      )}
    </div>
  );
}

// === ADD FORM ===
function CategoryForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (data: Omit<Category, "id" | "order">) => void }) {
  const [form, setForm] = useState<Partial<Category>>({
    id: "",
    label: "",
    icon: ShoppingBag,
    description: "",
    active: true,
  });

  const handleSubmit = () => {
    if (!form.label?.trim()) {
      alert("Category name is required");
      return;
    }
    // Cast to any because we include id in the data (it's optional in the type)
    onSubmit({
      id: form.id?.trim() || form.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      label: form.label.trim(),
      icon: form.icon || ShoppingBag,
      description: form.description?.trim() || "",
      active: form.active ?? true,
    } as any);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-primary/30 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-dark flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" /> New Category
        </h3>
        <button onClick={onCancel} className="p-1.5 text-gray-500"><X className="w-5 h-5" /></button>
      </div>
      <CategoryFormFields form={form} setForm={setForm} />
      <div className="flex gap-2 pt-2 border-t">
        <button onClick={handleSubmit} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">Cancel</button>
      </div>
    </div>
  );
}

// === SHARED FORM FIELDS ===
function CategoryFormFields({ form, setForm, editId }: { form: Partial<Category>; setForm: (f: Partial<Category>) => void; editId?: string }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category ID (slug, optional)</label>
        <input
          type="text"
          value={form.id || ""}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          placeholder="auto-generated from name"
          disabled={editId === "all"}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-400 mt-1">Used internally. Lowercase, no spaces.</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category Name *</label>
        <input
          type="text"
          value={form.label || ""}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="e.g. Smart Watches"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Icon</label>
        <div className="grid grid-cols-7 gap-2">
          {AVAILABLE_ICONS.map(({ name, icon: Icon }) => {
            const selected = (form.icon as any)?.name === name || (form.icon as any) === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setForm({ ...form, icon: Icon })}
                className={`p-2.5 rounded-lg border-2 transition-all ${
                  selected ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-500 hover:border-primary/50"
                }`}
                title={name}
              >
                <Icon className="w-5 h-5 mx-auto" />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description (optional)</label>
        <input
          type="text"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="e.g. Mobile phones and accessories"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active ?? true}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium text-gray-700">Active (show in shop)</span>
        </label>
      </div>
    </div>
  );
}
