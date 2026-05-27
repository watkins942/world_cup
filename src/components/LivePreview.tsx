import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Loader2, Sparkles, Image as ImageIcon, Camera, RefreshCw } from "lucide-react";
import { ActiveStyles, PresetImage } from "../types";

interface LivePreviewProps {
  imageUrl: string;
  styles: ActiveStyles;
  activePreset: PresetImage | null;
}

export default function LivePreview({ imageUrl, styles, activePreset }: LivePreviewProps) {
  const [loadState, setLoadState] = useState<"loading" | "success" | "error">("loading");
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger loading state when image source changes
  useEffect(() => {
    setLoadState("loading");
    setNaturalSize(null);
  }, [imageUrl, refreshKey]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoadState("success");
    const img = e.currentTarget;
    setNaturalSize({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  const handleError = () => {
    setLoadState("error");
  };

  const handleForceReload = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Convert shadow preset strings to drop-shadow classes
  const getShadowClass = () => {
    switch (styles.shadow) {
      case "sm": return "shadow-sm";
      case "md": return "shadow";
      case "lg": return "shadow-lg";
      case "xl": return "shadow-xl";
      case "2xl": return "shadow-2xl";
      case "inner": return "shadow-inner";
      default: return "";
    }
  };

  // Construct styling object for custom properties that Tailwind classes cannot handle dynamically
  const getInlineStyles = (): React.CSSProperties => {
    // Sizing
    const widthStyle = styles.widthUnit === "%" ? `${styles.width}%` : `${styles.width}${styles.widthUnit}`;
    const heightStyle = styles.heightUnit === "auto" ? "auto" : `${styles.height}${styles.heightUnit}`;
    
    // Filters array
    const filters = [
      styles.grayscale > 0 ? `grayscale(${styles.grayscale}%)` : "",
      styles.blur > 0 ? `blur(${styles.blur}px)` : "",
      styles.sepia > 0 ? `sepia(${styles.sepia}%)` : "",
      styles.brightness !== 100 ? `brightness(${styles.brightness}%)` : "",
      styles.contrast !== 100 ? `contrast(${styles.contrast}%)` : ""
    ].filter(Boolean).join(" ");

    return {
      width: widthStyle,
      height: heightStyle,
      maxWidth: styles.maxWidth,
      borderRadius: `${styles.borderRadius}px`,
      borderWidth: `${styles.borderWidth}px`,
      borderColor: styles.borderColor,
      borderStyle: styles.borderStyle,
      objectFit: styles.objectFit,
      opacity: styles.opacity,
      filter: filters || undefined,
      transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, opacity 0.2s ease",
      transform: isHovered ? `scale(${styles.hoverScale})` : "scale(1)",
      outline: styles.shadow === "inner" ? "1px solid rgba(0,0,0,0.05)" : undefined,
      boxShadow: styles.shadow !== "none" && styles.shadow !== "inner" ? `0 10px 25px -5px ${styles.shadowColor}` : undefined
    };
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-950 p-6 flex flex-col min-h-[350px] relative overflow-hidden" id="live-preview-box">
      {/* Background design accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
      
      {/* Panel header controls */}
      <div className="flex items-center justify-between border-b border-indigo-950/40 pb-3 mb-5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Live Hotlink Sandbox</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleForceReload}
            className="text-slate-400 hover:text-white p-1 rounded-md bg-slate-800 border border-slate-700/60 transition cursor-pointer select-none"
            title="Refresh connection state"
            id="btn-force-reload"
          >
            <RefreshCw size={12} />
          </button>
          
          <span className="text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full select-none">
            Scale: Fit Stage
          </span>
        </div>
      </div>

      {/* Main Sandbox Window */}
      <div 
        className="flex-1 flex items-center justify-center p-4 bg-slate-950 border border-slate-800/60 rounded-lg min-h-[260px] relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Loading overlay overlay */}
        {loadState === "loading" && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 size={24} className="text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Verifying Hotlink connection...</p>
          </div>
        )}

        {/* Dynamic Image Element */}
        {imageUrl ? (
          <div className="relative max-w-full flex justify-center items-center overflow-visible">
            <img
              src={imageUrl}
              alt="Tailwind Image Hotlink Sandbox"
              onLoad={handleLoad}
              onError={handleError}
              style={getInlineStyles()}
              className={`${getShadowClass()}`}
              referrerPolicy="no-referrer"
              id="sandbox-display-img"
              key={refreshKey}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <ImageIcon size={36} className="text-slate-700 stroke-[1.5] mb-2" />
            <p className="text-xs font-semibold text-slate-400">No Image Loaded</p>
            <p className="text-[11px] text-slate-500 max-w-[200px] mt-1">
              Select a curated preset or paste any direct media hotlink.
            </p>
          </div>
        )}
      </div>

      {/* Status Indicators Bar */}
      <div className="mt-4 pt-3 border-t border-indigo-950/40 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs leading-none">
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {loadState === "success" && (
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-900/20 border border-emerald-900/50 px-2.5 py-1.5 rounded-lg" id="status-success-badge">
              <CheckCircle2 size={13} />
              <span className="font-semibold font-sans">Hotlink Verified</span>
            </div>
          )}
          {loadState === "error" && (
            <div className="flex items-center gap-1.5 text-red-400 bg-red-950/20 border border-red-900/50 px-2.5 py-1.5 rounded-lg" id="status-error-badge">
              <XCircle size={13} />
              <span className="font-semibold font-sans">Hotlinking Restrictive Warning</span>
            </div>
          )}
          {loadState === "loading" && imageUrl && (
            <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-950/20 border border-indigo-900/50 px-2.5 py-1.5 rounded-lg">
              <Loader2 size={13} className="animate-spin" />
              <span className="font-medium font-sans">Testing link format...</span>
            </div>
          )}
        </div>

        {/* Image specs metadata */}
        {loadState === "success" && naturalSize && (
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span>Ratio: {(naturalSize.width / naturalSize.height).toFixed(2)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Resolution: {naturalSize.width} × {naturalSize.height} px</span>
          </div>
        )}

        {/* Preset photographers credit */}
        {activePreset && loadState === "success" && (
          <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
            <Camera size={11} className="text-slate-500" />
            <span>Photo credit: </span>
            <a 
              href={activePreset.sourceUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-indigo-400 hover:underline font-medium"
            >
              {activePreset.photographer} (Unsplash)
            </a>
          </div>
        )}
      </div>

      {/* Error message assistance popup */}
      {loadState === "error" && (
        <div className="mt-3 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-[11px] text-slate-300 leading-relaxed animate-fade-in" id="error-explain-box">
          <p className="font-bold text-red-300 flex items-center gap-1 mb-1">
            ⚠️ CORS Referrer Policy Restraint Detected
          </p>
          <p>
            The hosting server for this image does not allow direct embedding on external domains (it returned an error or blocked the hotlink request). 
          </p>
          <ul className="list-disc list-inside space-y-0.5 mt-1 ml-1 text-slate-400">
            <li>Ensure the URL points directly to the raw image (ends in <code className="font-mono text-pink-300">.png</code>, <code className="font-mono text-pink-300">.jpg</code>, <code className="font-mono text-pink-300">.webp</code>).</li>
            <li>Try standard cdn repositories or hotlink-friendly storage providers like <strong className="text-gray-300">Unsplash</strong> or <strong className="text-gray-300">Imgur</strong>.</li>
            <li>Uploading local files using the "Local Simulator" tab is a safe offline bypass!</li>
          </ul>
        </div>
      )}
    </div>
  );
}
