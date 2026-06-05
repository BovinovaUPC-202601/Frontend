import http from "../../shared/services/http";

export class SubscriptionService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + "/users/subscription";

    async updateSubscription(subscriptionPlan: string) {
        return await http.put(this.endpoint, {
            subscriptionPlan
        });
    }
}

export const subscriptionService = new SubscriptionService();