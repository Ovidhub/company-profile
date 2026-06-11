import { useState } from "react";
import { useAdminData } from "../../context/AdminDataContext";
import { ImageRegistry } from "../../data/images";
import { ImageUploader } from "../../hooks/useImageUpload";
import { Image as ImageIcon, Search, Check } from "lucide-react";

const IMAGE_LABELS: Record<keyof ImageRegistry, { label: string; category: string; description: string; aspectRatio: "video" | "square" | "auto" }> = {
  logoFull: { label: "Full Logo", category: "Brand", description: "Main brand logo (white version on dark backgrounds)", aspectRatio: "auto" },
  logoIcon: { label: "Logo Icon", category: "Brand", description: "Icon-only brand mark", aspectRatio: "square" },
  heroAgriculture: { label: "Hero - Agriculture", category: "Hero Slider", description: "Main hero slide for Agriculture", aspectRatio: "video" },
  heroFinance: { label: "Hero - Finance", category: "Hero Slider", description: "Main hero slide for Financial Markets", aspectRatio: "video" },
  heroFilm: { label: "Hero - Film", category: "Hero Slider", description: "Main hero slide for Film Production", aspectRatio: "video" },
  heroTech: { label: "Hero - Technology", category: "Hero Slider", description: "Main hero slide for Technology", aspectRatio: "video" },
  heroCleaning: { label: "Hero - Cleaning", category: "Hero Slider", description: "Main hero slide for Cleaning", aspectRatio: "video" },
  heroWebDesign: { label: "Hero - Web Design", category: "Hero Slider", description: "Main hero slide for Web Design", aspectRatio: "video" },
  heroSecurity: { label: "Hero - Security", category: "Hero Slider", description: "Main hero slide for Security", aspectRatio: "video" },
  heroRealEstate: { label: "Hero - Real Estate", category: "Hero Slider", description: "Main hero slide for Real Estate", aspectRatio: "video" },
  aboutTeam: { label: "About - Team", category: "About", description: "About section main image", aspectRatio: "video" },
  serviceFilm: { label: "Service - Film", category: "Services", description: "Film production service tab image", aspectRatio: "video" },
  serviceAgriculture: { label: "Service - Agriculture", category: "Services", description: "Agriculture service tab image", aspectRatio: "video" },
  serviceFinance: { label: "Service - Finance", category: "Services", description: "Finance service tab image", aspectRatio: "video" },
  serviceTech: { label: "Service - Technology", category: "Services", description: "Tech service tab image", aspectRatio: "video" },
  serviceCleaning: { label: "Service - Cleaning", category: "Services", description: "Cleaning service tab image", aspectRatio: "video" },
  serviceWebDesign: { label: "Service - Web Design", category: "Services", description: "Web design service tab image", aspectRatio: "video" },
  serviceMarketing: { label: "Service - Marketing", category: "Services", description: "Marketing service tab image", aspectRatio: "video" },
  serviceContent: { label: "Service - Content", category: "Services", description: "Content creation service tab image", aspectRatio: "video" },
  serviceSecurity: { label: "Service - Security", category: "Services", description: "Security service tab image", aspectRatio: "video" },
  serviceElectrical: { label: "Service - Electrical", category: "Services", description: "Electrical service tab image", aspectRatio: "video" },
  serviceRealEstate: { label: "Service - Real Estate", category: "Services", description: "Real estate service tab image", aspectRatio: "video" },
  cardFilm: { label: "Card - Film", category: "Service Cards", description: "Film service card thumbnail", aspectRatio: "square" },
  cardAgriculture: { label: "Card - Agriculture", category: "Service Cards", description: "Agriculture service card thumbnail", aspectRatio: "square" },
  cardFinance: { label: "Card - Finance", category: "Service Cards", description: "Finance service card thumbnail", aspectRatio: "square" },
  cardTech: { label: "Card - Technology", category: "Service Cards", description: "Tech service card thumbnail", aspectRatio: "square" },
  cardCleaning: { label: "Card - Cleaning", category: "Service Cards", description: "Cleaning service card thumbnail", aspectRatio: "square" },
  cardWebDesign: { label: "Card - Web Design", category: "Service Cards", description: "Web design service card thumbnail", aspectRatio: "square" },
  cardMarketing: { label: "Card - Marketing", category: "Service Cards", description: "Marketing service card thumbnail", aspectRatio: "square" },
  cardContent: { label: "Card - Content", category: "Service Cards", description: "Content service card thumbnail", aspectRatio: "square" },
  cardSecurity: { label: "Card - Security", category: "Service Cards", description: "Security service card thumbnail", aspectRatio: "square" },
  cardElectrical: { label: "Card - Electrical", category: "Service Cards", description: "Electrical service card thumbnail", aspectRatio: "square" },
  cardRealEstate: { label: "Card - Real Estate", category: "Service Cards", description: "Real estate service card thumbnail", aspectRatio: "square" },
  partnerships: { label: "Partnerships Section", category: "Sections", description: "Partnerships section background", aspectRatio: "video" },
  testimonials: { label: "Testimonials Section", category: "Sections", description: "Testimonials sidebar image", aspectRatio: "video" },
  contactCta: { label: "Contact CTA", category: "Sections", description: "Contact section CTA banner", aspectRatio: "video" },
};

const CATEGORIES = Array.from(new Set(Object.values(IMAGE_LABELS).map((v) => v.category)));

export default function AdminImages() {
  const { images, updateImage } = useAdminData();
  const [editingKey, setEditingKey] = useState<keyof ImageRegistry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [savedKey, setSavedKey] = useState<keyof ImageRegistry | null>(null);
  const [mode, setMode] = useState<{ [K in keyof ImageRegistry]?: "upload" | "url" }>({});

  const handleSave = (key: keyof ImageRegistry, url: string) => {
    updateImage(key, url);
    setEditingKey(null);
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2000);
  };

  const filteredEntries = (Object.keys(IMAGE_LABELS) as (keyof ImageRegistry)[]).filter((key) => {
    const info = IMAGE_LABELS[key];
    const matchSearch = !searchQuery || info.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === "all" || info.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Image Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Upload new images or paste a URL to replace any image on the website</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Images Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((key) => {
          const info = IMAGE_LABELS[key];
          return (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-video bg-gray-custom overflow-hidden">
                <img
                  src={images[key]}
                  alt={info.label}
                  className="w-full h-full object-cover"
                />
                {savedKey === key && (
                  <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                    <div className="bg-white rounded-full px-3 py-1.5 text-green-700 font-semibold text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" /> Saved!
                    </div>
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs font-semibold rounded">
                  {info.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-dark text-sm">{info.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">{info.description}</p>

                {editingKey === key ? (
                  <div className="space-y-3">
                    {/* Toggle between Upload and URL */}
                    <div className="flex gap-1 p-1 bg-gray-custom rounded-lg">
                      <button
                        type="button"
                        onClick={() => setMode({ ...mode, [key]: "upload" })}
                        className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded ${
                          (mode[key] || "upload") === "upload" ? "bg-white text-primary shadow-sm" : "text-gray-500"
                        }`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode({ ...mode, [key]: "url" })}
                        className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded ${
                          mode[key] === "url" ? "bg-white text-primary shadow-sm" : "text-gray-500"
                        }`}
                      >
                        URL
                      </button>
                    </div>

                    {(mode[key] || "upload") === "upload" ? (
                      <ImageUploader
                        value={images[key]}
                        onChange={(url) => handleSave(key, url)}
                        aspectRatio={info.aspectRatio}
                      />
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="url"
                          defaultValue={images[key].startsWith("data:") ? "" : images[key]}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSave(key, (e.target as HTMLInputElement).value);
                            }
                          }}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            handleSave(key, input.value);
                          }} className="flex-1 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light">
                            Save URL
                          </button>
                        </div>
                      </div>
                    )}

                    <button onClick={() => setEditingKey(null)} className="w-full px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-custom">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingKey(key)}
                    className="w-full px-3 py-2 bg-gray-custom hover:bg-primary/10 text-primary text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    Replace Image
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No images found</p>
        </div>
      )}
    </div>
  );
}
