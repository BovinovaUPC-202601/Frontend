import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscriptionService } from "../services/subscription-service";
import { useAuthStore } from "../../auth/store/auth-store";

interface SubscriptionState {
    loading: boolean;
    error: string | null;
    updatePlan: (plan: string) => Promise<void>;
}

export const useSubscriptionStore = create(
    immer<SubscriptionState>((set) => ({
        loading: false,
        error: null,

        updatePlan: async (plan: string) => {
            set(state => { state.loading = true; });

            try {
                await subscriptionService.updateSubscription(plan);

                useAuthStore.getState().setSubscription(plan);

                set(state => {
                    state.loading = false;
                    state.error = null;
                });

            } catch (err: any) {
                set(state => {
                    state.loading = false;
                    state.error = err.message;
                });
            }
        }
    }))
);