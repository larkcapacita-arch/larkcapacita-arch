
import { GoogleGenAI } from "@google/genai";
import { Theme, ArtStyle, PersonalityChoice } from './types';

const API_KEY = process.env.API_KEY || '';

export const generateAvatar = async (
  base64Image: string,
  theme: Theme,
  style: ArtStyle,
  personality: PersonalityChoice
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const isModern = theme.category === 'modern';
  
  // Adjusted prompt based on Category
  const prompt = `Create a visually stunning, high-action character portrait based on the user's face.
  
  THEME: ${theme.label}
  ACTION: The subject MUST be shown actively performing: ${theme.mood}.
  ENVIRONMENT: ${theme.description}.
  FACIAL EXPRESSION: ${theme.expression}.
  PERSONALITY ARCHETYPE: ${personality.label}.
  
  STYLE GUIDELINES:
  ${isModern ? 
    "- STRICT RULE: NO holographic boards, NO transparent UI screens, NO floating blue charts. Focus on PHYSICAL elements (stone, fire, water, metal, plants)." : 
    "- CLASSIC TECH STYLE: Incorporate blue holographic data boards, transparent UI screens, and digital interface overlays that the subject is interacting with."}
  
  - The subject must be deeply integrated into the environment.
  - Use a dynamic, "in-motion" composition.
  - Integrate visual metaphors for the ${personality.label} archetype.
  
  ART STYLE: ${style.label} - ${style.description}.
  
  TECHNICAL QUALITY: Cinematic lighting, 8k resolution, extreme textures, rich color palettes, dynamic perspective. No text, no watermarks.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Gemini Error:", error);
    return `https://picsum.photos/seed/${theme.id}-${Math.random()}/1024/1024`;
  }
};
