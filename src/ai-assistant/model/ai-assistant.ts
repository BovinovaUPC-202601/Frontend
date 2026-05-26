export type ChatRole = "assistant" | "user";

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    time: string;
}

export interface ChatResponse {
    response: string;
    conversationType: string;
}

export interface AnalysisResult {
    score: number;
    visibleIssues: string;
    urgency: string;
    recommendation: string;
    confidence: number;
}
