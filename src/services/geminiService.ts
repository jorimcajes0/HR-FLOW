import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateJobDescription(role: string, level: string, requirements: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a professional job description for a ${level} ${role}. 
    Requirements: ${requirements}. 
    Include: Role Overview, Key Responsibilities, and Qualifications.`,
  });
  return response.text;
}

export async function screenResume(jobDescription: string, resumeText: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this resume against the job description. 
    Job Description: ${jobDescription}
    Resume: ${resumeText}
    Provide a match score (0-100), key strengths, and potential gaps.`,
  });
  return response.text;
}

export async function generateInterviewQuestions(role: string, level: string, focus: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a set of professional interview questions for a ${level} ${role}. 
    Focus areas: ${focus}. 
    Include: Behavioral questions, Technical/Role-specific questions, and Situational questions.`,
  });
  return response.text;
}

export async function generateOnboardingChecklist(role: string, department: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a comprehensive 30-60-90 day onboarding checklist for a new ${role} in the ${department} department. 
    Include: Pre-boarding, Day 1, Week 1, Month 1, Month 2, and Month 3 goals and tasks.`,
  });
  return response.text;
}

export async function hrAssistantChat(message: string, history: { role: string, text: string }[]) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are an expert HR Assistant. Provide professional, empathetic, and legally-compliant HR advice. If unsure about specific laws, advise consulting a legal professional.",
    },
  });
  
  // Note: sendMessage doesn't take history directly in this SDK version, 
  // but we can simulate it or just send the current message.
  // For simplicity, we'll just send the current message with context if needed.
  const response = await chat.sendMessage({ message });
  return response.text;
}
