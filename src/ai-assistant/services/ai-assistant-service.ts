import http from "../../shared/services/http";
import type { AnalysisResult, ChatResponse } from "../model/ai-assistant";

export class AIAssistantService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + "/ai";

    async sendGeneralChat(message: string) {
        return await http.post<ChatResponse>(`${this.endpoint}/general-chat`, { message });
    }

    async sendBovineChat(bovineId: number, message: string) {
        return await http.post<ChatResponse>(`${this.endpoint}/bovine-chat`, { bovineId, message });
    }

    async analyzePhoto(bovineId: number, imageBase64: string) {
        return await http.post<AnalysisResult>(`${this.endpoint}/analyze-photo`, { bovineId, imageBase64 });
    }
}

export const aiAssistantService = new AIAssistantService();
