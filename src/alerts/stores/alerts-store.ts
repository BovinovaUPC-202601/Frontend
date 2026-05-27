import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Alert } from "../model/alert";
import { alertsService } from "../services/alerts-service";

interface AlertsState {
    alerts: Alert[];
    loading: boolean;

    fetchAlerts: (userId: number) => Promise<void>;
    markAsRead: (alertId: number) => Promise<void>;
}

export const useAlertsStore = create(immer<AlertsState>((set) => ({
    alerts: [],
    loading: false,

    fetchAlerts: async (userId) => {
        set(state => { state.loading = true; });
        try {
            const res = await alertsService.getAlertsByUserId(userId);
            if (res.data) set(state => { state.alerts = res.data.map(a => new Alert(a)); });
        } catch {
            set(state => { state.alerts = []; });
        } finally {
            set(state => { state.loading = false; });
        }
    },

    markAsRead: async (alertId) => {
        try {
            const res = await alertsService.markAsRead(alertId);
            if (res.data) {
                set(state => {
                    const idx = state.alerts.findIndex(a => a.id === alertId);
                    if (idx !== -1) state.alerts[idx] = new Alert(res.data);
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
})));
