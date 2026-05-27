import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 20MB limit to support base64 upload
app.use(express.json({ limit: "20mb" }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side Image download + Base64 conversion fallback helper
// This ensures that even if Gemini servers cannot reach the image URL directly (e.g. cross-origin, firewalls),
// the applet server can fetch it, convert to base64 inlineData, and analyze it successfully.
async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const responseFetch = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36"
    }
  });
  if (!responseFetch.ok) {
    throw new Error(`HTTP error ${responseFetch.status}`);
  }
  const buffer = await responseFetch.arrayBuffer();
  const mimeType = responseFetch.headers.get("content-type") || "image/jpeg";
  const base64 = Buffer.from(buffer).toString("base64");
  return { base64, mimeType };
}

// API - Analyze Image Route (Proxy to protect API key and ensure high-reliability analysis)
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageUrl, base64Data, mimeType } = req.body;

    if (!imageUrl && !base64Data) {
      return res.status(400).json({ error: "Missing imageUrl or base64Data target content" });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is missing. Please add it via Settings > Secrets in the AI Studio sidebar." 
      });
    }

    // Construct content parts for Gemini
    const contentParts: any[] = [];
    
    if (base64Data) {
      contentParts.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: base64Data
        }
      });
    } else if (imageUrl) {
      try {
        console.log(`Downloading external image for Gemini analysis: ${imageUrl}`);
        const downloaded = await fetchImageAsBase64(imageUrl);
        contentParts.push({
          inlineData: {
            mimeType: downloaded.mimeType,
            data: downloaded.base64
          }
        });
      } catch (err: any) {
        console.error("Failed to download image server-side, falling back to URL description prompt:", err);
        return res.status(400).json({ 
          error: `Failed to retrieve the image from the URL. Please verify that the image link is valid, directly points to an image file, and complies with hotlinking. (Details: ${err.message})` 
        });
      }
    }

    // Include the analytical instructions prompt
    contentParts.push({
      text: `Analyze this image for front-end development and accessibility. Generate a JSON response strictly matching this schema:
      - altText: A descriptive, accessible, SEO-optimized ALT text (do NOT start with "image of" or "photo of"; describe the content clearly for screen readers and search engines).
      - title: A short title or header label for the image (3 to 6 words).
      - description: A concise 2-3 sentence visual description detailing key subject matter, mood, colors, and design styling.
      - colorPalette: An array of 4 dominant visual hex codes (e.g. ["#030712", "#3B82F6", "#F3F4F6", "#9CA3AF"]).
      - mood: A brief atmospheric tag (e.g., "Warm Retro", "Tech Minimalist", "Cozy Dark", "Bright Modern").
      - tagSuggestions: An array of exactly 5 relevant tags/keywords.`
    });

    // Call generateContent
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: contentParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            altText: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            mood: { type: Type.STRING },
            tagSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["altText", "title", "description", "colorPalette", "mood", "tagSuggestions"]
        }
      }
    });

    const parsedResult = JSON.parse(geminiResponse.text || "{}");
    return res.json(parsedResult);
    
  } catch (error: any) {
    console.error("Gemini Image Analysis failed:", error);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred during image analytical processing." 
    });
  }
});

// Configure Vite or Static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} with environment ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
