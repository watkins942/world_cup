import React from "react";
import { Sliders, RefreshCw, Layers, Sparkles, Eye } from "lucide-react";
import { ActiveStyles } from "../types";

interface ImageCustomizerProps {
  styles: ActiveStyles;
  onStylesChange: (styles: ActiveStyles) => void;
}

export const DEFAULT_STYLES: ActiveStyles = {
  width: 100,
  widthUnit: "%",
  height: 320,
  heightUnit: "px",
  maxWidth: "100%",
  borderRadius: 12,
  borderWidth: 0,
  borderColor: "#cbd5e1",
  borderStyle: "solid",
  shadow: "md",
  shadowColor: "rgba(0, 0, 0, 0.1)",
  objectFit: "cover",
  hoverScale: 1.02,
  opacity: 1,
  grayscale: 0,
  blur: 0,
  contrast: 100,
  brightness: 100,
  sepia: 0
};

export default function ImageCustomizer({ styles, onStylesChange }: ImageCustomizerProps) {
  const updateStyle = (key: keyof ActiveStyles, value: any) => {
    onStylesChange({
      ...styles,
      [key]: value
    });
  };

  const handleReset = () => {
    onStylesChange(DEFAULT_STYLES);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5" id="image-customizer-panel">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">Embed & Style Controls</h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-indigo-600 border border-slate-200 bg-slate-50 hover:bg-indigo-50 px-2 py-1 rounded-md transition cursor-pointer select-none"
          title="Reset styling sliders to default"
          id="btn-reset-styles"
        >
          <RefreshCw size={11} />
          Reset Styles
        </button>
      </div>

      <div className="space-y-4">
        {/* Section 1: Dimensions */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Layers size={13} className="text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase">Layout & Sizing</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-100/80">
            {/* Width */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Width</span>
                <span className="text-slate-700 font-semibold">{styles.width}{styles.widthUnit}</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="range"
                  min="10"
                  max={styles.widthUnit === "%" ? "100" : "800"}
                  value={styles.width}
                  onChange={(e) => updateStyle("width", parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <select
                  value={styles.widthUnit}
                  onChange={(e) => updateStyle("widthUnit", e.target.value as any)}
                  className="text-[10px] font-semibold border border-slate-200 bg-white py-0.5 px-1 rounded hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="%">%</option>
                  <option value="px">px</option>
                  <option value="rem">rem</option>
                  <option value="vw">vw</option>
                </select>
              </div>
            </div>

            {/* Height */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Height</span>
                <span className="text-slate-700 font-semibold">
                  {styles.heightUnit === "auto" ? "auto" : `${styles.height}${styles.heightUnit}`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="range"
                  min="40"
                  max="700"
                  disabled={styles.heightUnit === "auto"}
                  value={styles.height}
                  onChange={(e) => updateStyle("height", parseInt(e.target.value))}
                  className={`flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${
                    styles.heightUnit === "auto" ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                />
                <select
                  value={styles.heightUnit}
                  onChange={(e) => updateStyle("heightUnit", e.target.value as any)}
                  className="text-[10px] font-semibold border border-slate-200 bg-white py-0.5 px-1 rounded hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="px">px</option>
                  <option value="rem">rem</option>
                  <option value="vh">vh</option>
                  <option value="auto">auto</option>
                </select>
              </div>
            </div>

            {/* Object Fit */}
            <div className="space-y-1">
              <span className="block text-[11px] text-slate-500 font-medium mb-1">Cropping (Object Fit)</span>
              <select
                value={styles.objectFit}
                onChange={(e) => updateStyle("objectFit", e.target.value)}
                className="w-full text-xs border border-slate-200 bg-white py-1.5 px-2.5 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
              >
                <option value="cover">Seamless Fill (Cover)</option>
                <option value="contain">Show Entire Picture (Contain)</option>
                <option value="fill">Forced Stretch (Fill)</option>
                <option value="scale-down">Original Size (Scale Down)</option>
              </select>
            </div>

            {/* Max Width bounds */}
            <div className="space-y-1">
              <span className="block text-[11px] text-slate-500 font-medium mb-1">Boundary Limit (Max Width)</span>
              <select
                value={styles.maxWidth}
                onChange={(e) => updateStyle("maxWidth", e.target.value)}
                className="w-full text-xs border border-slate-200 bg-white py-1.5 px-2.5 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
              >
                <option value="100%">100% of Parent Box</option>
                <option value="none">Unrestricted (None)</option>
                <option value="400px">Compact Container (400px)</option>
                <option value="600px">Medium Box (600px)</option>
                <option value="800px">Wide Billboard (800px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Borders & Shadows */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Layers size={13} className="text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase">Borders & Shadows</h4>
          </div>

          <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100/80 space-y-3">
            {/* Border Radius */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Border Radius (Roundness)</span>
                <span className="text-slate-700 font-semibold">{styles.borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={styles.borderRadius}
                onChange={(e) => updateStyle("borderRadius", parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Border Width */}
              <div className="space-y-1">
                <span className="block text-[10px] text-slate-500 font-medium">Border Width</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={styles.borderWidth}
                  onChange={(e) => updateStyle("borderWidth", Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-2 py-1 text-xs text-center border border-slate-200 bg-white rounded-md text-slate-800"
                />
              </div>

              {/* Border Style */}
              <div className="space-y-1">
                <span className="block text-[10px] text-slate-500 font-medium">Border Style</span>
                <select
                  value={styles.borderStyle}
                  onChange={(e) => updateStyle("borderStyle", e.target.value)}
                  className="w-full border border-slate-200 bg-white py-1 px-1.5 rounded-md text-slate-700 text-[11px]"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Border Color */}
              <div className="space-y-1">
                <span className="block text-[10px] text-slate-500 font-medium">Border Color</span>
                <div className="flex items-center gap-1 border border-slate-200 bg-white rounded-md px-1.5 py-0.5">
                  <input
                    type="color"
                    value={styles.borderColor}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    className="w-4 h-5 border-none cursor-pointer bg-transparent rounded"
                  />
                  <input
                    type="text"
                    value={styles.borderColor}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    className="w-full text-[9px] font-mono text-slate-700 uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Shadows */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="block text-[10px] text-slate-500 font-medium">Box Drop-Shadow</span>
                <select
                  value={styles.shadow}
                  onChange={(e) => updateStyle("shadow", e.target.value)}
                  className="w-full border border-slate-200 bg-white py-1 px-2 rounded-md text-slate-700 text-xs"
                >
                  <option value="none">None</option>
                  <option value="sm">Small Accent (sm)</option>
                  <option value="md">Medium Shadow (md)</option>
                  <option value="lg">Elegant Soft (lg)</option>
                  <option value="xl">Billboard Float (xl)</option>
                  <option value="2xl">Dramatic Soft (2xl)</option>
                  <option value="inner">Inset Shadow (inner)</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] text-slate-500 font-medium">Shadow Hue</span>
                <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-1.5 py-[3px]">
                  <input
                    type="color"
                    value={styles.shadowColor.startsWith("rgba") ? "#000000" : styles.shadowColor}
                    onChange={(e) => updateStyle("shadowColor", e.target.value)}
                    className="w-4 h-5 border-none cursor-pointer bg-transparent rounded"
                  />
                  <select
                    value={styles.shadowColor.includes("0, 0, 0") ? "dark" : styles.shadowColor.includes("79, 70, 229") ? "indigo" : "custom"}
                    onChange={(e) => {
                      const mode = e.target.value;
                      if (mode === "dark") updateStyle("shadowColor", "rgba(0, 0, 0, 0.15)");
                      else if (mode === "indigo") updateStyle("shadowColor", "rgba(79, 70, 229, 0.15)");
                    }}
                    className="w-full text-[10px] text-slate-700 border-none bg-transparent focus:outline-none"
                  >
                    <option value="dark">Classic Gray</option>
                    <option value="indigo">Tech Violet</option>
                    <option value="custom">Picked Hex</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Visual Filters & Interactivity */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Eye size={13} className="text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase">CSS Filters & Effects</h4>
          </div>

          <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100/80 space-y-3">
            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Opacity (Transparency)</span>
                <span className="text-slate-700 font-semibold">{Math.round(styles.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={styles.opacity * 100}
                onChange={(e) => updateStyle("opacity", parseInt(e.target.value) / 100)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Custom Interactive Grid for other filters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Grayscale */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Grayscale Filter</span>
                  <span>{styles.grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={styles.grayscale}
                  onChange={(e) => updateStyle("grayscale", parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Glow Blur</span>
                  <span>{styles.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={styles.blur}
                  onChange={(e) => updateStyle("blur", parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Exposure</span>
                  <span>{styles.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={styles.brightness}
                  onChange={(e) => updateStyle("brightness", parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Blur Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Contrast</span>
                  <span>{styles.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={styles.contrast}
                  onChange={(e) => updateStyle("contrast", parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Sepia */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Sepia (Vintage Washout)</span>
                <span>{styles.sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={styles.sepia}
                onChange={(e) => updateStyle("sepia", parseInt(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Dynamic Hover Scale */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-semibold">Micro Hover Scale Zoom</span>
              <select
                value={styles.hoverScale}
                onChange={(e) => updateStyle("hoverScale", parseFloat(e.target.value))}
                className="border border-slate-200 bg-white py-1 px-2 rounded-md text-slate-700 text-[11px]"
              >
                <option value="1">Disabled (None)</option>
                <option value="1.02">Subtle Zoom (1.02x)</option>
                <option value="1.05">Medium Bounce (1.05x)</option>
                <option value="1.1">Active Pop (1.1x)</option>
                <option value="0.95">Soft Press (0.95x)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
