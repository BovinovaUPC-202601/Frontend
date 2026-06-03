import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { HealthRecord } from "../model/health-record";
import { monitoringService } from "../services/monitoring-service";

interface MonitoringState {
    selectedBovineId: number | null;
    setSelectedBovineId: (id: number) => void;

    latestRecord: HealthRecord | null;
    records: HealthRecord[];
    loading: boolean;

    fetchLatest: (bovineId: number, silent?: boolean) => Promise<void>;
    fetchHistory: (bovineId: number, silent?: boolean) => Promise<void>;
}

export const useMonitoringStore = create(immer<MonitoringState>((set) => ({
    selectedBovineId: null,
    setSelectedBovineId: (id) => set(state => { state.selectedBovineId = id; }),

    latestRecord: null,
    records: [],
    loading: false,

    fetchLatest: async (bovineId, silent = false) => {
        if (!silent) set(state => { state.loading = true; });
        try {
            const res = await monitoringService.getLatestByBovineId(bovineId);
            if (res.data) set(state => { state.latestRecord = new HealthRecord(res.data); });
        } catch {
            set(state => { state.latestRecord = null; });
        } finally {
            if (!silent) set(state => { state.loading = false; });
        }
    },

    fetchHistory: async (bovineId, silent = false) => {
        if (!silent) set(state => { state.loading = true; });
        try {
            const res = await monitoringService.getRecordsByBovineId(bovineId);
            if (res.data) set(state => { state.records = res.data.map(r => new HealthRecord(r)); });
        } catch {
            set(state => { state.records = []; });
        } finally {
            if (!silent) set(state => { state.loading = false; });
        }
    },
})));
