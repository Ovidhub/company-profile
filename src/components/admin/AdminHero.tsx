import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminData, HeroSlide } from "../../context/AdminDataContext";
import { ImageUploader } from "../../hooks/useImageUpload";
import { Edit2, Save, X, Plus, Trash2, Image as ImageIcon, Eye } from "lucide-react";

const ICON_OPTIONS = ["Wheat", "TrendingUp", "Film", "Cpu", "Globe", "ShieldCheck", "Sparkles", "Megaphone", "Video", "Building2", "Zap"];

export default function AdminHero() {
  const { heroSlides, updateHeroSlide, addHeroSlide, removeHeroSlide } = useAdminData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HeroSlide>>({});

  const startEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setEditForm(slide);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId) {
      updateHeroSlide(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleAdd = () => {
    addHeroSlide({
      title: "New Hero Slide Title",
      subtitle: "Add a compelling subtitle here that describes your service.",
      image: "",
      tag: "New Service",
      iconName: "Sparkles",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Hero Slider</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the slides on your homepage hero ({heroSlides.length} slides)</p>
        </div>
        <button onClick={handleAdd} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Slide
        </button>
      </div>

      <div className="space-y-4">
        {heroSlides.map((slide, idx) => (
          <div key={slide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {editingId === slide.id ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-dark">Editing Slide {idx + 1}</h3>
                  <div className="flex gap-2">
                    <button onClick={cancelEdit} className="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom">
                      <X className="w-4 h-4 inline" /> Cancel
                    </button>
                    <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light">
                      <Save className="w-4 h-4 inline" /> Save
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Service Tag</label>
                    <input
                      type="text"
                      value={editForm.tag || ""}
                      onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                      placeholder="e.g. Agriculture"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Icon</label>
                    <select
                      value={editForm.iconName || "Sparkles"}
                      onChange={(e) => setEditForm({ ...editForm, iconName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                    >
                      {ICON_OPTIONS.map((i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <ImageUploader
                  label="Background Image"
                  value={editForm.image || ""}
                  onChange={(url) => setEditForm({ ...editForm, image: url })}
                  aspectRatio="video"
                />

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title (use periods to add line breaks & highlight)</label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="e.g. Revolutionizing Agriculture. For a Sustainable Tomorrow."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle</label>
                  <textarea
                    value={editForm.subtitle || ""}
                    onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 sm:h-auto relative bg-gray-custom flex-shrink-0">
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="inline-block px-2 py-0.5 bg-accent/10 text-accent-dark text-xs font-semibold rounded-full mb-2">
                        {slide.tag}
                      </span>
                      <h3 className="font-bold text-dark line-clamp-2">{slide.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{slide.subtitle}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">#{idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={() => startEdit(slide)} className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light flex items-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <Link to="/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-custom flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />Preview
                    </Link>
                    <button onClick={() => { if (confirm("Delete this slide?")) removeHeroSlide(slide.id); }} className="px-3 py-1.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {heroSlides.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-dark mb-1">No slides yet</h3>
          <p className="text-sm text-gray-500 mb-4">Add your first hero slide to get started</p>
          <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4 inline" /> Add Slide
          </button>
        </div>
      )}
    </div>
  );
}
