import { GoogleGenAI, Type } from "@google/genai";

const parseProductData = async (text: string) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Using flash-lite or flash for speed on simple extraction tasks
  const model = "gemini-3-flash-preview"; 

  const prompt = `
    Analyze the following input string, which may be a product URL or product description text.
    
    Input: "${text}"
    
    Task:
    1. If the input is a URL, extract or infer the product details (name, rating, review count) typically associated with that link.
    2. If the input is text, extract the rating details directly.
    3. Return a clean JSON object.
    
    Return JSON format:
    - name (string, concise product name)
    - rating (number, average score)
    - reviewCount (number, integer count of reviews)
    - maxRating (number, usually 5 or 10, default to 5 if unsure)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            reviewCount: { type: Type.INTEGER },
            maxRating: { type: Type.NUMBER },
          },
          required: ["rating", "reviewCount"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini extraction error:", error);
    throw error;
  }
};

export { parseProductData };