import http from "../../shared/services/http";
import type { Alert } from "../model/alert";

const BASE = import.meta.env.VITE_API_BASE_URL + '/alerts';

export class AlertsService {
    async getAlertsByUserId(userId: number) {
        return await http.get<Alert[]>(`${BASE}?userId=${userId}`);
    }

    async getAlertById(alertId: number) {
        return await http.get<Alert>(`${BASE}/${alertId}`);
    }

    async markAsRead(alertId: number) {
        return await http.put<Alert>(`${BASE}/${alertId}/read`, {});
    }
}

export const alertsService = new AlertsService();
