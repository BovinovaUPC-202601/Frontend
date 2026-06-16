import http from "../../shared/services/http";

export class SubscriptionService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + "/subscriptions";

    async activatePlus() {
        return await http.post(`${this.endpoint}/plus/activate`, {});
    }

    /** Opens a checkout session for Plus; returns the URL to redirect to. */
    async createPlusCheckout() {
        return await http.post<{ checkoutUrl: string }>(`${this.endpoint}/plus/checkout`, {});
    }

    /** Opens a checkout session for an additional collar slot. */
    async createCollarCheckout() {
        return await http.post<{ checkoutUrl: string }>(`${this.endpoint}/additional-collars/checkout`, {});
    }

    /** Confirms a checkout after the simulated card form. */
    async confirmCheckout(sessionRef: string) {
        return await http.post(`${this.endpoint}/checkout/${sessionRef}/confirm`, {});
    }

    async getPayments() {
        return await http.get(`${this.endpoint}/payments`);
    }

    async cancel() {
        return await http.post(`${this.endpoint}/cancel`, {});
    }

    async getCurrent() {
        return await http.get(`${this.endpoint}/current`);
    }
}

export const subscriptionService = new SubscriptionService();
