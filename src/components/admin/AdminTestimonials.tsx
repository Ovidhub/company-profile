import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminData, Testimonial } from "../../context/AdminDataContext";
import { Edit2, Save, X, Plus, Trash2, Star, Quote, Eye } from "lucide-react";

export default function AdminTestimonials() {
  const { testimonials, addTestimonial, removeTestimonial, updateTestimonial } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

  const startEdit = (t: Testimonial) => { setEditingId(t.id); setEditForm(t); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = () => { if (editingId) { updateTestimonial(editingId, editForm); setEditingId(null); setEditForm({}); } };

  const handleAdd = () => {
    addTestimonial({
      name: "New Customer",
      role: "CEO, Company",
      text: "Add the testimonial text here. Share what your customer said about your service.",
      rating: 5,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">Customer reviews shown on the homepage</p>
        </div>
        <button onClick={handleAdd} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Edit Form */}
      {editingId && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark">Editing Testimonial</h3>
            <button onClick={cancelEdit} className="p-1.5 text-gray-500"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Customer Name</label>
              <input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Role / Company</label>
              <input value={editForm.role || ""} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Testimonial Text</label>
            <textarea value={editForm.text || ""} onChange={(e) => setEditForm({ ...editForm, text: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Rating (1-5)</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEditForm({ ...editForm, rating: n })}
                  className="p-1"
                >
                  <Star className={`w-7 h-7 ${n <= (editForm.rating || 0) ? "fill-accent text-accent" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <button onClick={saveEdit} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={cancelEdit} className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">Cancel</button>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
            <Quote className="absolute top-4 right-4 w-8 h-8 text-accent/20" />
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-accent text-accent" : "text-gray-300"}`} />
              ))}
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-4 mb-4">"{t.text}"</p>
            <div className="border-t pt-3">
              <p className="font-bold text-dark">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
            <div className="flex items-center gap-1 mt-4 pt-3 border-t">
              <button onClick={() => startEdit(t)} className="flex-1 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light flex items-center justify-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <Link to="/#testimonials" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">
                <Eye className="w-3.5 h-3.5" />
              </Link>
              <button onClick={() => { if (confirm("Delete this testimonial?")) removeTestimonial(t.id); }} className="px-3 py-1.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <Quote className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No testimonials yet</p>
        </div>
      )}
    </div>
  );
}
