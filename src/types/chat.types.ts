export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  parts: GeminiPart[];
  role?: "user" | "model";
}

export interface GeminiRequest {
  systemInstruction?: { parts: GeminiPart[] };
  contents: GeminiContent[];
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason: string;
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export interface JobBotContext {
  totalApplications: number;
  byStatus: Record<string, number>;
  overdueFollowUps: import("./application.types").Application[];
  topMatchScores: import("./application.types").Application[];
  recentApplications: import("./application.types").Application[];
  conversionRate: string;
}