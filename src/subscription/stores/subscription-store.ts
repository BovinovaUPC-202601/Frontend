import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscriptionService } from "../services/subscription-service";
import { useAuthStore } from "../../auth/store/auth-store";

interface SubscriptionState {
    loading: boolean;
    error: string | null;
    updatePlan: (plan: string) => Promise<void>;
    fetchCurrentPlan: () => Promise<void>;
}

export const useSubscriptionStore = create(
    immer<SubscriptionState>((set) => ({
        loading: false,
        error: null,

        updatePlan: async (plan: string) => {
            set(state => { state.loading = true; });

            try {
                if (plan === "Plus") {
                    await subscriptionService.activatePlus();
                } else {
                    await subscriptionService.cancel();
                }

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
        },

        fetchCurrentPlan: async () => {
            try {
                const res = await subscriptionService.getCurrent();
                useAuthStore.getState().setSubscription(res.data.plan ?? "Free");
            } catch {
                // On failure assume the most restrictive plan so gated routes stay locked.
                useAuthStore.getState().setSubscription("Free");
            }
        }
    }))
);