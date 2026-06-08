import http from "../../shared/services/http";

export class SubscriptionService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + "/subscriptions";

    async activatePlus() {
        return await http.post(`${this.endpoint}/plus/activate`, {});
    }

    async cancel() {
        return await http.post(`${this.endpoint}/cancel`, {});
    }

    async getCurrent() {
        return await http.get(`${this.endpoint}/current`);
    }
}

export const subscriptionService = new SubscriptionService();
