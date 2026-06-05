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

/** A single stored message returned by the chat-history endpoints. Role is "user" or "assistant". */
export interface ChatMessageDto {
    role: string;
    content: string;
    timestamp: string;
}

/** Persisted conversation returned by GET /ai/general-chat and /ai/bovine-chat/{bovineId}. */
export interface ChatHistory {
    conversationType: string;
    bovineId: number | null;
    messages: ChatMessageDto[];
}

/** Persisted photo analysis returned by GET /ai/analyses/{bovineId} (most recent first). */
export interface BovineAnalysis {
    id: number;
    bovineId: number;
    score: number;
    visibleIssues: string;
    urgency: string;
    recommendation: string;
    confidence: number;
    createdAt: string;
}
