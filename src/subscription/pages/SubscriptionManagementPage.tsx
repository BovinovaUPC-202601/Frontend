import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CircleCheck as CheckCircleIcon } from "lucide-react";
import { Medal as WorkspacePremiumIcon } from "lucide-react";
import { Sprout as GrassIcon } from "lucide-react";
import { useAuthStore } from "../../auth/store/auth-store";
import { useSubscriptionStore } from "../stores/subscription-store";

interface PlanDef {
    name: "Free" | "Plus";
    price: number;
    tagline: string;
    features: string[];
    highlight: boolean;
}

const PLANS: PlanDef[] = [
    {
        name: "Free",
        price: 0,
        tagline: "Gestión esencial de tu ganado",
        features: ["Gestión básica del ganado"],
        highlight: false,
    },
    {
        name: "Plus",
        price: 149,
        tagline: "Todo el poder de VacApp",
        features: [
            "Asistente con IA",
            "Monitoreo IoT en tiempo real",
            "Alertas biométricas",
            "3 collares incluidos",
            "Collar adicional S/25 / mes",
        ],
        highlight: true,
    },
];

export function SubscriptionManagementPage() {
    const user = useAuthStore(state => state.user);
    const { updatePlan, loading } = useSubscriptionStore();

    const currentPlan = user.subscriptionPlan ?? "Free";

    return (
        <div className="flex flex-col mx-20 gap-10 font-mulish">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-neutral-900 font-rokkitt">
                    Suscripción
                </h1>
                <p className="text-neutral-500">
                    Elegí el plan que mejor se adapta a tu operación.
                </p>
                <span className="text-sm text-neutral-500">
                    Plan actual:{" "}
                    <span className="font-semibold text-brand-default">{currentPlan}</span>
                </span>
            </header>

            <div className="flex flex-wrap gap-6">
                {PLANS.map(plan => {
                    const isCurrent = currentPlan === plan.name;
                    return (
                        <Card
                            key={plan.name}
                            className={`w-80 rounded-xl shadow-none border-1 transition-colors ${
                                plan.highlight
                                    ? "border-brand-default bg-brand-default/5"
                                    : "border-neutral-300 bg-neutral-100"
                            }`}
                        >
                            <CardContent>
                                <div className="flex flex-col gap-5 p-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {plan.highlight ? (
                                                <WorkspacePremiumIcon className="text-brand-default" />
                                            ) : (
                                                <GrassIcon className="text-neutral-500" />
                                            )}
                                            <h2 className="text-2xl font-bold text-neutral-900 font-rokkitt">
                                                {plan.name}
                                            </h2>
                                        </div>
                                        {plan.highlight && (
                                            <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark bg-brand-light/30 px-2 py-1 rounded-full">
                                                Recomendado
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-neutral-500">{plan.tagline}</p>

                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-bold text-neutral-900">
                                            S/{plan.price}
                                        </span>
                                        <span className="text-neutral-500 mb-1">/ mes</span>
                                    </div>

                                    <ul className="flex flex-col gap-2">
                                        {plan.features.map(feature => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-2 text-sm text-neutral-700"
                                            >
                                                <CheckCircleIcon
                                                    className={`!w-5 !h-5 ${
                                                        plan.highlight
                                                            ? "text-brand-default"
                                                            : "text-neutral-400"
                                                    }`}
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        disabled={loading || isCurrent}
                                        onClick={() => updatePlan(plan.name)}
                                        className={`mt-2 w-full py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            plan.highlight
                                                ? "bg-brand-default text-white hover:bg-brand-dark"
                                                : "border-1 border-neutral-300 text-neutral-700 hover:bg-neutral-200"
                                        }`}
                                    >
                                        {isCurrent
                                            ? "Plan actual"
                                            : loading
                                              ? "Procesando…"
                                              : plan.highlight
                                                ? "Mejorar a Plus"
                                                : "Cambiar a Free"}
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
