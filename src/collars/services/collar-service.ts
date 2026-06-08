import http from "../../shared/services/http";
import type { Collar, CollarCapacity } from "../model/collar";

export class CollarService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + "/iot-monitoring/collars";

    async getMyCollars() {
        return await http.get<Collar[]>(this.endpoint);
    }

    async getCapacity() {
        return await http.get<CollarCapacity>(`${this.endpoint}/capacity`);
    }

    async register(deviceId: string, bovineId: number) {
        return await http.post<Collar>(this.endpoint, { deviceId, bovineId });
    }

    async reassign(collarId: number, bovineId: number) {
        return await http.put<Collar>(`${this.endpoint}/${collarId}`, { bovineId });
    }

    async remove(collarId: number) {
        return await http.delete(`${this.endpoint}/${collarId}`);
    }
}

export const collarService = new CollarService();
