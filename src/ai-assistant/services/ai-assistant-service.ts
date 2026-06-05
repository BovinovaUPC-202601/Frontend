import http from "../../shared/services/http";
import type { AnalysisResult, BovineAnalysis, ChatHistory, ChatResponse } from "../model/ai-assistant";

export class AIAssistantService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + "/ai";

    async sendGeneralChat(message: string) {
        return await http.post<ChatResponse>(`${this.endpoint}/general-chat`, { message });
    }

    async getGeneralChatHistory() {
        return await http.get<ChatHistory>(`${this.endpoint}/general-chat`);
    }

    async sendBovineChat(bovineId: number, message: string) {
        return await http.post<ChatResponse>(`${this.endpoint}/bovine-chat`, { bovineId, message });
    }

    async getBovineChatHistory(bovineId: number) {
        return await http.get<ChatHistory>(`${this.endpoint}/bovine-chat/${bovineId}`);
    }

    async analyzePhoto(bovineId: number, imageBase64: string) {
        return await http.post<AnalysisResult>(`${this.endpoint}/analyze-photo`, { bovineId, imageBase64 });
    }

    async getBovineAnalyses(bovineId: number) {
        return await http.get<BovineAnalysis[]>(`${this.endpoint}/analyses/${bovineId}`);
    }
}

export const aiAssistantService = new AIAssistantService();
