// gemini ai

import { GoogleGenAI } from "@google/genai";
import { Transaction, Summary } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      throw new Error("kunci API AI tidak ditemukan! pastikan telah ada AI_API_KEY di file .env dan memulai ulang server (npm run dev).");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getFinancialInsights(transactions: Transaction[], summary: Summary) {
  const model = "gemini-3-flash-preview";
  
  const context = `
    Current Financial Summary:
    - Total Income: $${summary.total_income}
    - Total Expense: $${summary.total_expense}
    - Current Balance: $${summary.total_income - summary.total_expense}

    Recent Transactions:
    ${transactions.slice(0, 10).map(t => `- ${t.date}: ${t.title} (${t.type}) - $${t.amount} [${t.category}]`).join('\n')}
  `;

  const prompt = `
    You are a professional financial advisor. Based on the financial data provided below, give me:
    1. A brief analysis of my current spending habits.
    2. A projection for the next month if these habits continue.
    3. Three actionable tips to improve my financial health.
    
    Data:
    ${context}
    
    Format the response in clear Markdown. Keep it concise and encouraging.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Sorry, I couldn't generate insights at this moment. Please try again later.";
  }
}

export async function askFinancialQuestion(question: string, transactions: Transaction[], summary: Summary) {
  const model = "gemini-3-flash-preview";
  
  const context = `
    Current Financial Summary:
    - Total Income: $${summary.total_income}
    - Total Expense: $${summary.total_expense}
    - Current Balance: $${summary.total_income - summary.total_expense}

    Recent Transactions:
    ${transactions.slice(0, 20).map(t => `- ${t.date}: ${t.title} (${t.type}) - $${t.amount} [${t.category}]`).join('\n')}
  `;

  const prompt = `
    You are a helpful financial assistant. Answer the user's question based on their financial data.
    
    User Question: "${question}"
    
    Data:
    ${context}
    
    Provide a clear, helpful, and accurate answer.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Question Error:", error);
    return "I'm having trouble answering that right now. Could you rephrase or try again?";
  }
}
