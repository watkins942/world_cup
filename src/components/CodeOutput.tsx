import React, { useState } from "react";
import { FolderCode, Copy, Check, Info, FileCode } from "lucide-react";
import { ActiveStyles, CodeTab } from "../types";

interface CodeOutputProps {
  imageUrl: string;
  styles: ActiveStyles;
  altText: string;
}

export default function CodeOutput({ imageUrl, styles, altText }: CodeOutputProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>("html");
  const [copied, setCopied] = useState(false);

  const cleanAlt = altText || "Descriptive accessibility image element";

  // Sizing definitions
  const widthVal = styles.widthUnit === "%" ? `${styles.width}%` : `${styles.width}${styles.widthUnit}`;
  const heightVal = styles.heightUnit === "auto" ? "auto" : `${styles.height}${styles.heightUnit}`;
  const maxWVal = styles.maxWidth;

  // Generate dynamic styles string
  const cssStylesList = [
    `width: ${widthVal};`,
    styles.heightUnit !== "auto" ? `height: ${heightVal};` : "",
    maxWVal !== "none" ? `max-width: ${maxWVal};` : "",
    `border-radius: ${styles.borderRadius}px;`,
    styles.borderWidth > 0 ? `border: ${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor};` : "",
    styles.shadow !== "none" ? `box-shadow: 0 10px 25px -5px ${styles.shadowColor};` : "",
    `object-fit: ${styles.objectFit};`,
    styles.opacity < 1 ? `opacity: ${styles.opacity};` : "",
  ].filter(Boolean);

  const getGrayscaleFilter = () => styles.grayscale > 0 ? `grayscale(${styles.grayscale}%)` : "";
  const getBlurFilter = () => styles.blur > 0 ? `blur(${styles.blur}px)` : "";
  const getSepiaFilter = () => styles.sepia > 0 ? `sepia(${styles.sepia}%)` : "";
  const getBrightnessFilter = () => styles.brightness !== 100 ? `brightness(${styles.brightness}%)` : "";
  const getContrastFilter = () => styles.contrast !== 100 ? `contrast(${styles.contrast}%)` : "";

  const filterString = [
    getGrayscaleFilter(),
    getBlurFilter(),
    getSepiaFilter(),
    getBrightnessFilter(),
    getContrastFilter()
  ].filter(Boolean).join(" ");

  if (filterString) {
    cssStylesList.push(`filter: ${filterString};`);
  }

  // Add transition/hover if active
  if (styles.hoverScale !== 1) {
    cssStylesList.push(`transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);`);
  }

  const generatedCode = {
    html: `<img\n  src="${imageUrl}"\n  alt="${cleanAlt}"\n  style="${cssStylesList.join(" ")}"\n/>`,
    
    markdown: `![${cleanAlt}](${imageUrl})`,
    
    css: `.hotlinked-image {\n  background-image: url('${imageUrl}');\n  background-size: ${styles.objectFit === "cover" ? "cover" : "contain"};\n  background-position: center;\n  background-repeat: no-repeat;\n  width: ${widthVal};\n  height: ${heightVal};\n  border-radius: ${styles.borderRadius}px;\n  ${styles.borderWidth > 0 ? `border: ${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor};\n` : ""}${styles.opacity < 1 ? `  opacity: ${styles.opacity};\n` : ""}}`,
    
    tailwind: (() => {
      // Build visual custom Tailwind layout values
      const roundedMap: any = { 0: "rounded-none", 4: "rounded", 8: "rounded-lg", 12: "rounded-xl", 16: "rounded-2xl", 24: "rounded-3xl", 9999: "rounded-full" };
      const nearestRound = styles.borderRadius;
      const roundedClass = roundedMap[nearestRound] || `rounded-[${styles.borderRadius}px]`;
      
      const shadowMap: any = { none: "shadow-none", sm: "shadow-sm", md: "shadow", lg: "shadow-lg", xl: "shadow-xl", "2xl": "shadow-2xl", inner: "shadow-inner" };
      const shadowClass = shadowMap[styles.shadow] || "shadow";

      const fitClass = `object-${styles.objectFit}`;
      
      const filterClasses = [
        styles.grayscale > 0 ? `grayscale` : "",
        styles.blur > 0 ? `blur-[${styles.blur}px]` : "",
        styles.sepia > 0 ? `sepia` : "",
      ].filter(Boolean).join(" ");

      const baseClasses = `w-[${widthVal}] ${styles.heightUnit !== "auto" ? `h-[${heightVal}]` : "h-auto"} ${styles.maxWidth !== "none" ? `max-w-[${styles.maxWidth}]` : "max-w-none"} ${roundedClass} ${styles.borderWidth > 0 ? `border-[${styles.borderWidth}px] border-solid` : ""} ${shadowClass} ${fitClass} ${filterClasses} ${styles.hoverScale !== 1 ? `transition-transform duration-300 hover:scale-[${styles.hoverScale}]` : ""}`.replace(/\s+/g, " ").trim();

      return `<img\n  src="${imageUrl}"\n  alt="${cleanAlt}"\n  className="${baseClasses}"\n/>`;
    })(),
    
    jsx: `// React Functional Element\nexport function EmbeddedImage() {\n  return (\n    <img\n      src="${imageUrl}"\n      alt="${cleanAlt}"\n      style={{\n        width: "${widthVal}",\n        height: "${heightVal}",\n        maxWidth: "${styles.maxWidth}",\n        borderRadius: "${styles.borderRadius}px",\n        border: "${styles.borderWidth > 0 ? `${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor}` : 'none'}",\n        objectFit: "${styles.objectFit}",\n        opacity: ${styles.opacity},\n        transform: "scale(1)",\n        transition: "transform 0.3s cubic-[0.16,1,0.3,1]"\n      }}\n      className="hover:scale-[${styles.hoverScale}]"\n    />\n  );\n}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-950 rounded-xl overflow-hidden shadow-md flex flex-col" id="code-snippet-panel">
      {/* Tab headings navigation */}
      <div className="flex bg-slate-950/80 border-b border-indigo-950/40 p-1">
        {(["html", "tailwind", "jsx", "markdown", "css"] as CodeTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCopied(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium capitalize transition cursor-pointer select-none ${
              activeTab === tab
                ? "bg-slate-800 text-indigo-400 border border-slate-700/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
            id={`code-tab-${tab}`}
          >
            {tab === "html" ? "img tag (HTML)" : tab}
          </button>
        ))}
      </div>

      {/* Code Textarea Area */}
      <div className="relative p-4 bg-slate-950 flex-1 font-mono text-xs flex flex-col min-h-[160px]">
        {/* Copy button overlay */}
        <button
          onClick={handleCopy}
          className={`absolute top-3 right-3 p-2 rounded-lg border flex items-center gap-1 text-[11px] font-sans font-semibold transition cursor-pointer select-none z-10 ${
            copied
              ? "bg-emerald-900/30 text-emerald-400 border-emerald-950"
              : "bg-slate-900/85 hover:bg-slate-800 text-slate-300 border-slate-800"
          }`}
          id="btn-copy-code"
        >
          {copied ? (
            <>
              <Check size={11} className="stroke-[2.5]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy Code</span>
            </>
          )}
        </button>

        {/* Dynamic Syntax Highlighting preview box */}
        <pre className="text-slate-300 overflow-x-auto pr-16 max-h-[220px] whitespace-pre select-all mb-0 flex-1">
          <code>{generatedCode[activeTab]}</code>
        </pre>
      </div>

      {/* Code documentation/footer footer */}
      <div className="bg-slate-950/50 px-4 py-2 text-[10px] text-slate-500 border-t border-indigo-950/20 flex items-center gap-1">
        <FolderCode size={12} className="text-slate-600" />
        <span>Fully hotlink-compliant standard markup syntax. Just copy-paste to embed instantly!</span>
      </div>
    </div>
  );
}
