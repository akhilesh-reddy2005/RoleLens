import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: env.geminiModel,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
});
