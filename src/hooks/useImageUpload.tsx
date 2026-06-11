import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "auto";
}

export function ImageUploader({ value, onChange, label, className = "", aspectRatio = "auto" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SVG is excluded: it can embed scripts, and these data URLs are persisted
  // and re-rendered across the site.
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

  const handleFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Please upload a PNG, JPG, WebP, or GIF image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB allowed.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChange(dataUrl);
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Failed to read file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const aspectClass = aspectRatio === "video" ? "aspect-video" : aspectRatio === "square" ? "aspect-square" : "h-40";

  return (
    <div className={className}>
      {label && <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>}
      {value ? (
        <div className="relative group">
          <div className={`relative ${aspectClass} rounded-lg overflow-hidden bg-gray-custom border-2 border-gray-200`}>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white text-dark text-xs font-semibold rounded-lg flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Replace
                </button>
                <button type="button" onClick={handleClear} className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 truncate">
            {value.startsWith("data:") ? "Uploaded file" : "URL: " + value}
          </p>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`${aspectClass} rounded-lg border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragOver ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-custom hover:border-primary hover:bg-primary/5"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center px-2">
                <p className="text-sm font-semibold text-dark">
                  <span className="text-primary">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-0.5">PNG, JPG, WebP up to 5MB</p>
              </div>
            </>
          )}
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileInput} className="hidden" />
    </div>
  );
}
