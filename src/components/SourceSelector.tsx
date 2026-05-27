import React, { useState, useRef } from "react";
import { Link, Upload, Image as ImageIcon, Sparkles, FolderOpen, Globe } from "lucide-react";
import { PresetImage } from "../types";
import { PRESET_IMAGES } from "../presets";

interface SourceSelectorProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  onBase64Change: (base64: string | null, mimeType: string | null) => void;
  onPresetSelected: (preset: PresetImage) => void;
}

type TabType = "url" | "presets" | "upload";

export default function SourceSelector({
  currentUrl,
  onUrlChange,
  onBase64Change,
  onPresetSelected
}: SourceSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("presets");
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("tech-desk");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync Input URL with external parent URL
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onBase64Change(null, null); // Clear base64 when using real URL
      onUrlChange(inputUrl.trim());
      setFileName(null);
    }
  };

  const handlePresetClick = (preset: PresetImage) => {
    setSelectedPresetId(preset.id);
    onBase64Change(null, null); // Reset base64
    onUrlChange(preset.url);
    setInputUrl(preset.url);
    onPresetSelected(preset);
    setFileName(null);
  };

  // Convert uploaded image to base64
  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const mimeType = file.type;
          // Extract plain base64 without prefix data:image/...;base64, for Gemini API,
          // but we will pass the whole file or parts appropriately
          const base64Data = result.split(",")[1];
          onBase64Change(base64Data, mimeType);
          onUrlChange(result); // Set preview URL to the base64 URL
          setFileName(file.name);
          setInputUrl(""); // Clear URL input
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="source-selector-panel">
      {/* Header tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50">
        <button
          id="tab-presets"
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "presets"
              ? "border-indigo-600 text-indigo-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FolderOpen size={14} />
          Curated Presets
        </button>
        <button
          id="tab-url"
          onClick={() => {
            setActiveTab("url");
            setInputUrl(currentUrl.startsWith("data:") ? "" : currentUrl);
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "url"
              ? "border-indigo-600 text-indigo-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Link size={14} />
          Direct Hotlink URL
        </button>
        <button
          id="tab-upload"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "upload"
              ? "border-indigo-600 text-indigo-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Upload size={14} />
          Local Simulator
        </button>
      </div>

      {/* Content wrapper */}
      <div className="p-4 bg-white">
        {activeTab === "presets" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Curated Image:
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-2 max-h-[240px] overflow-y-auto pr-1">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={`relative group rounded-lg overflow-hidden border text-left aspect-square transition-all ${
                    selectedPresetId === preset.id && !currentUrl.startsWith("data:")
                      ? "ring-2 ring-indigo-500 border-indigo-500 scale-95"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  id={`preset-btn-${preset.id}`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-1.5 flex flex-col justify-end">
                    <p className="text-[10px] text-white font-medium truncate leading-tight">
                      {preset.title}
                    </p>
                    <p className="text-[8px] text-slate-300 truncate">
                      by {preset.photographer}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-[11px] text-slate-400 bg-indigo-50/50 p-2 rounded-lg border border-indigo-50 flex items-start gap-1">
              <Globe size={11} className="text-indigo-500 shrink-0 mt-0.5" />
              <span>These images are pre-loaded from high-capacity hotlinkable servers, and will load perfectly anywhere.</span>
            </p>
          </div>
        )}

        {activeTab === "url" && (
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div>
              <label htmlFor="url-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Paste Direct Image Link:
              </label>
              <div className="flex gap-2">
                <input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/images/vector-banner.png"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 font-mono text-xs bg-slate-50/50"
                  required
                />
                <button
                  id="btn-apply-url"
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition shadow-sm select-none"
                >
                  Load Image
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[11px] leading-relaxed text-slate-500">
                <span className="font-bold text-slate-700">💡 Custom URL Testing:</span> Paste any image link (e.g. from Pin, Imgur, or direct CDN links). The Live View panel on the right will run validation tests to verify if the server blocks cross-origin hotlink requests!
              </p>
            </div>
          </form>
        )}

        {activeTab === "upload" && (
          <div className="space-y-3">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition duration-200 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50/40"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/30"
              }`}
              id="file-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500">
                <div className="p-2.5 bg-slate-100 rounded-full text-slate-600">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    {fileName ? "Change Image" : "Drop your image here"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    or click to search files (Max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {fileName && (
              <div className="flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 px-3 py-2 rounded-lg" id="uploaded-tag-box">
                <ImageIcon size={14} className="text-indigo-600" />
                <span className="text-xs font-mono text-indigo-900 truncate flex-1">
                  {fileName}
                </span>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-medium">
                  Local Simulation Ready
                </span>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              *Local upload acts as an inline simulator. It uses in-memory base64 so you can easily style your asset, test filters, and perform Gemini AI diagnostics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
