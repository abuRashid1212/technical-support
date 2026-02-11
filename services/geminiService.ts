
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export const getChatResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], knowledge: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  // بناء التعليمات النهائية مع التأكيد على حصرية المصدر
  const contextHeader = knowledge.trim() 
    ? `قاعدة المعرفة المتاحة (المصدر الوحيد للإجابة):\n${knowledge}`
    : "تحذير: قاعدة المعرفة فارغة حالياً. لا تجب على أي أسئلة تقنية.";

  const fullSystemInstruction = `${SYSTEM_INSTRUCTION}\n\n${contextHeader}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.1, // تقليل درجة التخيل لضمان الالتزام بالنص (Deterministic)
      },
    });

    return response.text || "عذراً، تعذر العثور على إجابة في الملفات المرفوعة.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، واجهت مشكلة في الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً.";
  }
};
