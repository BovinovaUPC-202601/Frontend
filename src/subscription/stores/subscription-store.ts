import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscriptionService } from "../services/subscription-service";
import { useAuthStore } from "../../auth/store/auth-store";

type ErrorWithMessage = {
    message?: string;
};

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

            } catch (err: unknown) {
                set(state => {
                    state.loading = false;
                    state.error = (err as ErrorWithMessage).message ?? "No se pudo actualizar la suscripciÃ³n.";
                });
            }
        },

        fetchCurrentPlan: async () => {
            try {
                const res = await subscriptionService.getCurrent();
                // Effective access = Plus AND active. A cancelled/suspended/expired
                // subscription keeps plan="Plus" but must NOT unlock Plus features
                // (the backend [RequiresPlus] only honors an active Plus).
                const effective =
                    res.data.plan === "Plus" && res.data.status === "Active"
                        ? "Plus"
                        : "Free";
                useAuthStore.getState().setSubscription(effective);
            } catch {
                // On failure assume the most restrictive plan so gated routes stay locked.
                useAuthStore.getState().setSubscription("Free");
            }
        }
    }))
);
