import { GoogleGenAI, Type } from "@google/genai";
import { MarketData, Instrument, AIAnalysisResponse } from "../types";

export const analyzeCandleStructure = async (
  instrument: Instrument,
  data: MarketData
): Promise<AIAnalysisResponse | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Analyze this market data for ${instrument.name}:
      Open: ${data.open}
      High: ${data.high}
      Low: ${data.low}
      Close: ${data.close}
      
      Provide a trading analysis with specific price levels for BOTH Long and Short scenarios.
      Consider the candle color (Green if Close > Open, Red if Close < Open) and the wicks for rejection.
      
      1. Determine immediate bias (Bullish/Bearish/Neutral).
      2. Provide a short reasoning (max 2 sentences).
      3. For LONG: Suggest Entry (likely Close or slight pullback), realistic Stop Loss (below Low/support), Take Profit, and a Probability Score (0-100) based on structure.
      4. For SHORT: Suggest Entry (likely Close or slight pullback), realistic Stop Loss (above High/resistance), Take Profit, and a Probability Score (0-100) based on structure.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bias: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            longStrategy: {
              type: Type.OBJECT,
              properties: {
                entryPrice: { type: Type.NUMBER },
                stopLossPrice: { type: Type.NUMBER },
                targetPrice: { type: Type.NUMBER },
                probability: { type: Type.NUMBER },
              },
              required: ["entryPrice", "stopLossPrice", "targetPrice", "probability"]
            },
            shortStrategy: {
              type: Type.OBJECT,
              properties: {
                entryPrice: { type: Type.NUMBER },
                stopLossPrice: { type: Type.NUMBER },
                targetPrice: { type: Type.NUMBER },
                probability: { type: Type.NUMBER },
              },
              required: ["entryPrice", "stopLossPrice", "targetPrice", "probability"]
            }
          },
          required: ["bias", "reasoning", "longStrategy", "shortStrategy"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResponse;
    }
    return null;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
};
