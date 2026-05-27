import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, Sliders, FileCode, CheckCircle2, RefreshCw, Layers } from "lucide-react";
import { PRESET_IMAGES } from "./presets";
import { ActiveStyles, ImageAnalysis, PresetImage } from "./types";
import SourceSelector from "./components/SourceSelector";
import ImageCustomizer, { DEFAULT_STYLES } from "./components/ImageCustomizer";
import LivePreview from "./components/LivePreview";
import CodeOutput from "./components/CodeOutput";
import AnalysisPanel from "./components/AnalysisPanel";

const INITIAL_IMAGE = PRESET_IMAGES[0];

const INITIAL_ANALYSIS: ImageAnalysis = {
  altText: "A sleek minimalist modern coding desk setup with an active metal laptop, micro mechanical keyboard, clay plant pot, and ceramic coffee mug on a rustic tabletop under sunny window beams",
  title: "Aesthetic Minimalist Coder Desk",
  description: "An elegant home office tabletop captured in bright, peaceful daylight. Features a pristine layout of tech peripherals, soft green foliage, and warm morning beverages favoring focus.",
  colorPalette: ["#1E293B", "#4F46E5", "#FAF8F5", "#94A3B8"],
  mood: "Peaceful Neutral Tech",
  tagSuggestions: ["workspace", "minimalist", "coding", "designer-desk", "warm-morning"]
};

export default function App() {
  const [imageUrl, setImageUrl] = useState<string>(INITIAL_IMAGE.url);
  const [isBase64, setIsBase64] = useState<boolean>(false);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [styles, setStyles] = useState<ActiveStyles>(DEFAULT_STYLES);
  const [activePreset, setActivePreset] = useState<PresetImage | null>(INITIAL_IMAGE);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(INITIAL_ANALYSIS);

  // Synchronizers
  const handleUrlChange = (newUrl: string) => {
    setImageUrl(newUrl);
    // When URL undergoes change away from presets, delete current analysis to encourage re-querying
    const matchedPreset = PRESET_IMAGES.find((p) => p.url === newUrl);
    if (matchedPreset) {
      setActivePreset(matchedPreset);
      // If choosing initial tech-desk, restore starting analysis to avoid needless api rounds
      if (matchedPreset.id === "tech-desk") {
        setAnalysis(INITIAL_ANALYSIS);
      } else {
        setAnalysis(null);
      }
    } else {
      setActivePreset(null);
      setAnalysis(null);
    }
  };

  const handleBase64Change = (data: string | null, mime: string | null) => {
    if (data) {
      setIsBase64(true);
      setBase64Data(data);
      setMimeType(mime);
      setActivePreset(null);
      setAnalysis(null);
    } else {
      setIsBase64(false);
      setBase64Data(null);
      setMimeType(null);
    }
  };

  const handlePresetSelected = (preset: PresetImage) => {
    setImageUrl(preset.url);
    setIsBase64(false);
    setBase64Data(null);
    setMimeType(null);
    setActivePreset(preset);
    
    // Smooth auto analysis reset/load
    if (preset.id === "tech-desk") {
      setAnalysis(INITIAL_ANALYSIS);
    } else {
      setAnalysis(null);
    }
  };

  const handleAnalysisGenerated = (newAnalysis: ImageAnalysis) => {
    setAnalysis(newAnalysis);
  };

  const handleResetWorkspace = () => {
    setImageUrl(INITIAL_IMAGE.url);
    setIsBase64(false);
    setBase64Data(null);
    setMimeType(null);
    setStyles(DEFAULT_STYLES);
    setActivePreset(INITIAL_IMAGE);
    setAnalysis(INITIAL_ANALYSIS);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12" id="app-root">
      {/* Universal header banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <Layers size={20} className="stroke-[2.5]" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                HTML Image Hotlink Playground
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Real-time image style staging and SEO ALT-text generation wizard powered by Gemini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Workspace Synced
            </span>
            <button
              onClick={handleResetWorkspace}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-600 border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl cursor-pointer select-none transition"
              id="header-btn-reset-workspace"
              title="Factory reset app states"
            >
              <RefreshCw size={12} />
              Reset Workspace
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column - Sizing, Inputs & Selectors */}
          <section className="col-span-1 lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                <ImageIcon size={12} className="text-slate-500" />
                <span>Step 1: Choose Source File</span>
              </div>
              <SourceSelector
                currentUrl={imageUrl}
                onUrlChange={handleUrlChange}
                onBase64Change={handleBase64Change}
                onPresetSelected={handlePresetSelected}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 py-1">
                <Sliders size={12} className="text-slate-500" />
                <span>Step 2: Embed Styling Layout</span>
              </div>
              <ImageCustomizer
                styles={styles}
                onStylesChange={setStyles}
              />
            </div>
          </section>

          {/* Right Column - Sandboxed Visualizations & Code Snippets */}
          <section className="col-span-1 lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                <CheckCircle2 size={12} className="text-teal-500" />
                <span>Step 3: Test Hotlink Sandbox</span>
              </div>
              <LivePreview
                imageUrl={imageUrl}
                styles={styles}
                activePreset={activePreset}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                <FileCode size={12} className="text-slate-500" />
                <span>Step 4: Hotlink Embed Snippets</span>
              </div>
              <CodeOutput
                imageUrl={imageUrl}
                styles={styles}
                altText={analysis?.altText || ""}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                <Sparkles size={12} className="text-indigo-500" />
                <span>Alt Code Helper (AI Assisted)</span>
              </div>
              <AnalysisPanel
                imageUrl={imageUrl}
                isBase64={isBase64}
                base64Data={base64Data}
                mimeType={mimeType}
                analysis={analysis}
                onAnalysisGenerated={handleAnalysisGenerated}
              />
            </div>
          </section>
          
        </div>
      </main>
    </div>
  );
}
