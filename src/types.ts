export interface PresetImage {
  id: string;
  title: string;
  category: "Minimalist" | "Technology" | "Nature" | "Architecture" | "Abstract";
  url: string;
  photographer: string;
  sourceUrl: string;
}

export interface ActiveStyles {
  width: number;
  widthUnit: "%" | "px" | "rem" | "vw";
  height: number;
  heightUnit: "auto" | "px" | "rem" | "vh";
  maxWidth: string; // 'none', '100%', '300px', '500px', '800px'
  borderRadius: number; // in pixels
  borderWidth: number; // in pixels
  borderColor: string;
  borderStyle: "none" | "solid" | "dashed" | "dotted" | "double";
  shadow: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";
  shadowColor: string;
  objectFit: "cover" | "contain" | "fill" | "scale-down";
  hoverScale: number; // standard: 1 (no hover scaling), 1.05, 1.1, etc.
  opacity: number; // 0 to 1
  grayscale: number; // 0 to 100%
  blur: number; // in px
  contrast: number; // 50% to 150%
  brightness: number; // 50% to 150%
  sepia: number; // 0 to 100%
}

export interface ImageAnalysis {
  altText: string;
  title: string;
  description: string;
  colorPalette: string[];
  mood: string;
  tagSuggestions: string[];
}

export type CodeTab = "html" | "markdown" | "css" | "tailwind" | "jsx";
