import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../auth/store/auth-store";

// Guards Plus-only features (IoT monitoring, AI assistant). Waits until the
// plan is loaded from the backend before deciding, so a Plus user refreshing
// on a gated route is not bounced out before the plan is known.
export function PlusRoute() {
    const plan = useAuthStore(state => state.user.subscriptionPlan);
    const planLoaded = useAuthStore(state => state.planLoaded);

    if (!planLoaded) return null;

    return plan === "Plus"
        ? <Outlet />
        : <Navigate to="/subscription-management" replace />;
}
