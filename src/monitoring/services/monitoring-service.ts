import http from "../../shared/services/http";
import type { HealthRecord } from "../model/health-record";

const BASE = import.meta.env.VITE_API_BASE_URL + '/iot-monitoring/bovines';

export class MonitoringService {
    async getRecordsByBovineId(bovineId: number) {
        return await http.get<HealthRecord[]>(`${BASE}/${bovineId}/records`);
    }

    async getLatestByBovineId(bovineId: number) {
        return await http.get<HealthRecord>(`${BASE}/${bovineId}/latest`);
    }
}

export const monitoringService = new MonitoringService();
