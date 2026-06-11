import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminData } from "../../context/AdminDataContext";
import { Product, CATEGORIES, formatPrice } from "../../data/products";
import { ImageUploader } from "../../hooks/useImageUpload";
import { Edit2, Save, X, Plus, Trash2, Search, Eye, Star, Package } from "lucide-react";

const CATEGORY_OPTIONS = CATEGORIES.filter(c => c.id !== "all");

export default function AdminProducts() {
  const { products, updateProduct, addProduct, removeProduct } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered = products.filter(p => {
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm(p);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId) {
      updateProduct(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleAdd = () => {
    addProduct({
      name: "New Product",
      category: "smartphones",
      categoryLabel: "Smartphones",
      price: 99,
      image: "https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
      description: "Add a compelling product description here.",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      inStock: true,
      rating: 4.5,
      reviews: 0,
      badge: "new",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your online shop inventory ({products.length} products)</p>
        </div>
        <button onClick={handleAdd} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
        >
          <option value="all">All Categories</option>
          {CATEGORY_OPTIONS.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Edit Form (Expanded) */}
      {editingId && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark">Editing Product</h3>
            <button onClick={cancelEdit} className="p-1.5 text-gray-500 hover:text-dark">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Product Name</label>
              <input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
              <select value={editForm.category || "smartphones"} onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Product["category"], categoryLabel: CATEGORY_OPTIONS.find(c => c.id === e.target.value)?.label || "" })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                {CATEGORY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <ImageUploader
            label="Product Image"
            value={editForm.image || ""}
            onChange={(url) => setEditForm({ ...editForm, image: url })}
            aspectRatio="square"
          />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
            <textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Features (comma-separated)</label>
            <input
              value={editForm.features?.join(", ") || ""}
              onChange={(e) => setEditForm({ ...editForm, features: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              placeholder="Feature 1, Feature 2, Feature 3"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Price ($)</label>
              <input type="number" value={editForm.price || 0} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Original Price (optional)</label>
              <input type="number" value={editForm.originalPrice || 0} onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Badge</label>
              <select value={editForm.badge || ""} onChange={(e) => setEditForm({ ...editForm, badge: e.target.value as Product["badge"] })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                <option value="">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="hot">Hot</option>
                <option value="limited">Limited</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Stock Status</label>
              <select value={editForm.inStock ? "yes" : "no"} onChange={(e) => setEditForm({ ...editForm, inStock: e.target.value === "yes" })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                <option value="yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={editForm.rating || 0} onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Reviews</label>
              <input type="number" value={editForm.reviews || 0} onChange={(e) => setEditForm({ ...editForm, reviews: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <button onClick={saveEdit} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={cancelEdit} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-custom border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-custom/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-dark truncate">{p.name}</p>
                        {p.badge && <span className="text-xs px-1.5 py-0.5 bg-accent text-white rounded-full uppercase font-bold">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.categoryLabel}</td>
                  <td className="px-4 py-3 font-bold text-primary">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      {p.rating}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(p)} className="p-1.5 text-primary hover:bg-primary/10 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <Link to="/shop" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => { if (confirm("Delete this product?")) removeProduct(p.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
