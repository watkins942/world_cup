import React, { useState } from "react";
import { Sparkles, Loader2, Info, Check, Copy, Tag, Palette, Heart, Eye } from "lucide-react";
import { ImageAnalysis } from "../types";

interface AnalysisPanelProps {
  imageUrl: string;
  isBase64: boolean;
  base64Data: string | null;
  mimeType: string | null;
  analysis: ImageAnalysis | null;
  onAnalysisGenerated: (analysis: ImageAnalysis) => void;
}

export default function AnalysisPanel({
  imageUrl,
  isBase64,
  base64Data,
  mimeType,
  analysis,
  onAnalysisGenerated
}: AnalysisPanelProps) {
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isBase64
            ? { base64Data, mimeType }
            : { imageUrl }
        )
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const result: ImageAnalysis = await response.json();
      onAnalysisGenerated(result);
    } catch (err: any) {
      console.error("Image analysis failed:", err);
      setErrorMsg(err.message || "Unable to complete image analysis at this time.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "hex" | "alt") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "hex") {
        setCopiedHex(text);
        setTimeout(() => setCopiedHex(null), 1500);
      }
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4" id="ai-analysis-panel">
      {/* Header title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">AI ALT & SEO Studio</h3>
        </div>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
          Gemini 3.5 Flash
        </span>
      </div>

      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-3" id="ai-loading-stage">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-700">Deconstructing image contents...</h4>
            <p className="text-[10px] text-slate-400 max-w-[240px]">
              We are downloading and feeding the asset to Gemini. Analyzing visual composition, accessibility metadata, and color codes...
            </p>
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-4 animate-fade-in" id="analysis-results">
          {/* ALT text suggestion */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                Recommend Alt Attribute (Copyable)
              </label>
              <button
                onClick={() => copyToClipboard(analysis.altText, "alt")}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 hover:bg-slate-50 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5 transition cursor-pointer select-none"
                id="btn-copy-alt"
              >
                Copy Alt
              </button>
            </div>
            
            <blockquote className="bg-slate-50 border-l-[3px] border-indigo-600 p-3 rounded-r-lg text-xs leading-relaxed text-slate-700 italic">
              "{analysis.altText}"
            </blockquote>
          </div>

          {/* Title & Detailed content review */}
          <div className="space-y-1 bg-slate-50/50 p-3 rounded-lg border border-slate-100/50 text-xs">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Eye size={12} className="text-indigo-500" />
              <span className="font-bold text-slate-700">Detailed Visual Read</span>
            </div>
            <h4 className="font-bold text-slate-800 text-xs mb-1">
              Title Recommendation: <span className="text-slate-600 italic font-mono font-medium">"{analysis.title}"</span>
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              {analysis.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Palette */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Palette size={11} className="text-slate-500" /> Color Palette
              </span>
              <div className="flex items-center gap-2">
                {analysis.colorPalette.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => copyToClipboard(hex, "hex")}
                    className="relative group w-7 h-7 rounded-full border border-slate-200 cursor-pointer shadow-sm active:scale-90 transition"
                    style={{ backgroundColor: hex }}
                    title={`Click to copy hex ${hex}`}
                  >
                    {copiedHex === hex ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white">
                        <Check size={10} className="stroke-[3]" />
                      </span>
                    ) : (
                      <span className="absolute top-[120%] left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 bg-slate-950 text-white px-1 py-0.5 rounded shadow pointer-events-none transition whitespace-nowrap z-10">
                        {hex}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood label */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Heart size={11} className="text-slate-500" /> Creative Mood
              </span>
              <div className="inline-flex items-center gap-1 bg-pink-50 border border-pink-100 text-pink-700 text-[11px] font-bold px-2 py-1 rounded-lg">
                <span>{analysis.mood}</span>
              </div>
            </div>
          </div>

          {/* Tags list */}
          <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag size={11} className="text-slate-500" /> Accessibility Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {analysis.tagSuggestions.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 text-slate-600 text-[10px] hover:bg-slate-200 transition font-medium px-2 py-0.5 rounded-full select-none"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Reset analyzer */}
          <button
            onClick={handleAnalyze}
            className="w-full flex items-center justify-center gap-1.5 border border-slate-200 hover:border-indigo-400 text-[11px] text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50/30 font-semibold py-2 rounded-lg cursor-pointer transition select-none"
            id="btn-reanalyze-image"
          >
            <Sparkles size={12} />
            Re-Analyze Image
          </button>
        </div>
      ) : (
        <div className="space-y-3" id="analyze-prompt-intro">
          <p className="text-xs leading-relaxed text-slate-500">
            Make your hotlinks accessible! Run a deep content analysis powered by Gemini to automatically write high-quality descriptive ALT code, discover color palettes, specify recommended captions, and generate metadata tags.
          </p>

          {imageUrl ? (
            <button
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow cursor-pointer select-none border-b border-indigo-700/80 hover:shadow-md transition duration-150"
              id="btn-trigger-analysis"
            >
              <Sparkles size={14} />
              Analyze with Gemini AI
            </button>
          ) : (
            <div className="text-xs bg-slate-50 text-slate-400 p-3 rounded-lg text-center border border-dashed border-slate-200 font-medium select-none">
              Please load an image first to enable AI Alt assistance
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-1" id="analysis-error-status">
              <Info size={14} className="shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Analysis Failed:</span>
                <p className="leading-relaxed text-[10.5px]">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
