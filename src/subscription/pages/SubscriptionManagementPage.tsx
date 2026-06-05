import { useAuthStore } from "../../auth/stores/auth-store";
import { useSubscriptionStore } from "../stores/subscription-store";

export function SubscriptionManagementPage() {
    const user = useAuthStore(state => state.user);
    const { updatePlan, loading } = useSubscriptionStore();

    return (
        <div className="flex flex-col gap-6 mx-20">
            <h1>Subscription</h1>

            <div>
                Current plan: {user.subscriptionPlan ?? "Free"}
            </div>

            <div className="flex gap-4">
                <div className="border p-4">
                    <h2>Free</h2>
                    <p>Basic access</p>
                    <button
                        disabled={loading || user.subscriptionPlan === "Free"}
                        onClick={() => updatePlan("Free")}
                    >
                        Switch to Free
                    </button>
                </div>

                <div className="border p-4">
                    <h2>Plus</h2>
                    <p>AI + IoT access</p>
                    <button
                        disabled={loading || user.subscriptionPlan === "Plus"}
                        onClick={() => updatePlan("Plus")}
                    >
                        Upgrade to Plus
                    </button>
                </div>
            </div>
        </div>
    );
}