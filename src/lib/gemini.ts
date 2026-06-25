import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

// Lazy initialization of the Gemini Client to prevent crashing on boot if key is missing
export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY) || 
                   (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) ||
                   ''; // Falls back safely at module level
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in your environment or Secrets. Please configure it in your workspace settings.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiInstance;
}

export interface DiscoveredVideo {
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  suggestedProgramme: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceText: string;
  suggestedSummary: string;
  suggestedTopicTags: string[];
}

/**
 * Searches and verifies real public YouTube videos from the ClearPath Media TV channel
 * using Google Search grounding via the gemini-3.5-flash model.
 */
export async function discoverYouTubeVideos(): Promise<DiscoveredVideo[]> {
  const ai = getGeminiClient();
  
  const prompt = `Perform extensive search using the Google Search tool to find real, active public YouTube videos from the official 'ClearPath Media TV' channel (often represented by /@ClearPathMediaTV or channel handle 'ClearPathMediaTV').
  
  Locate real video recordings. For each real public video you find, obtain:
  1. The exact video title.
  2. The actual YouTube Watch URL (such as https://www.youtube.com/watch?v=VIDEO_ID).
  3. The real 11-character YouTube video ID.
  4. Specific evidence or source text proving this video exists and belongs to them.
  5. A high-fidelity, suggested 1-2 sentence visual and topical summary.
  6. Relevant topic tags (e.g. ["ECONOMY", "GOVERNANCE", "TRADE", "CIVICS", "REFORM"]).
  7. Map each video strictly to one of our six standard programme identifiers:
     * "osita-insights" (for OsitaInsight - usually features Osita Chidoka)
     * "daily-brief" (for Daily Brief with Annabel - usually weekday morning digests, policy summaries, macrofinance)
     * "clearpath-insights" (for ClearPath Insights - general civic explanations and visual breakdowns)
     * "nigeria-neighbours" (for Nigeria & Neighbours - geopolitics, border trade, regional security, West Africa)
     * "election-matters" (for Election Matters - ballots, commission policies, voter biometric technologies)
     * "mekaria-series" (for Mekaria Series - grassroots development, budget allocations, local government area sovereignty)

  CRITICAL VERIFICATION RULES:
  - Do NOT invent or hallucinate any YouTube video titles, video IDs, or links. Only report what is found and verified on ClearPath Media TV.
  - Set confidence Level to HIGH if you found direct confirmation of the video ID on YouTube metadata, MEDIUM if suggested by search text, or LOW if speculative. Remove any speculative/LOW confidence matches entirely from the final list.
  - Do NOT map a video to are standard programmes unless the video title, description, playlist context, or speakers clearly support that mapping.
  - Do NOT repeat the same YouTube video ID across multiple items unless the same video truly is published in both series (which is rare). Make sure video IDs are distinct.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING,
                description: "The actual title of the YouTube video."
              },
              youtubeUrl: { 
                type: Type.STRING,
                description: "The official YouTube watch URL of the video."
              },
              youtubeVideoId: { 
                type: Type.STRING,
                description: "The verified 11-character YouTube video ID."
              },
              suggestedProgramme: { 
                type: Type.STRING,
                description: "The matching programme ID: 'osita-insights' | 'daily-brief' | 'clearpath-insights' | 'nigeria-neighbours' | 'election-matters' | 'mekaria-series'."
              },
              confidenceLevel: { 
                type: Type.STRING,
                description: "The verification confidence level: HIGH, MEDIUM, or LOW." 
              },
              evidenceText: { 
                type: Type.STRING,
                description: "Actual source snippet or textual proof justifying why this is mapped to this series." 
              },
              suggestedSummary: { 
                type: Type.STRING,
                description: "A professional, objective and concise summary of the video content." 
              },
              suggestedTopicTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Suggested tag strings to categorize topics, e.g. ['ECONOMY', 'POLICY']."
              }
            },
            required: [
              "title", 
              "youtubeUrl", 
              "youtubeVideoId", 
              "suggestedProgramme", 
              "confidenceLevel", 
              "evidenceText", 
              "suggestedSummary",
              "suggestedTopicTags"
            ]
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      return [];
    }

    const parsed: DiscoveredVideo[] = JSON.parse(textOutput.trim());
    
    // Safety guard step 5: If Gemini cannot verify video metadata, leave it out completely.
    // Also strip out LOW confidence mappings.
    const filtered = parsed.filter(v => {
      const isValidId = v.youtubeVideoId && v.youtubeVideoId.length === 11;
      const isValidUrl = v.youtubeUrl && v.youtubeUrl.includes(v.youtubeVideoId);
      const isConfident = v.confidenceLevel === 'HIGH' || v.confidenceLevel === 'MEDIUM';
      const knownProgrammes = ['osita-insights', 'daily-brief', 'clearpath-insights', 'nigeria-neighbours', 'election-matters', 'mekaria-series'];
      const isValidProg = knownProgrammes.includes(v.suggestedProgramme);
      
      return isValidId && isValidUrl && isConfident && isValidProg;
    });

    // Deduplicate video IDs to prevent reuse across multiple items unless verified
    const uniqueMap = new Map<string, DiscoveredVideo>();
    for (const v of filtered) {
      if (!uniqueMap.has(v.youtubeVideoId)) {
        uniqueMap.set(v.youtubeVideoId, v);
      }
    }

    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error("Gemini YouTube video discovery failed: ", error);
    throw error;
  }
}
