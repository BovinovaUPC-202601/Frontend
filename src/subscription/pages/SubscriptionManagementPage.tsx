import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CircleCheck as CheckCircleIcon } from "lucide-react";
import { Medal as WorkspacePremiumIcon } from "lucide-react";
import { Sprout as GrassIcon } from "lucide-react";
import { Radio as CollarIcon } from "lucide-react";
import { useAuthStore } from "../../auth/store/auth-store";
import { useSubscriptionStore } from "../stores/subscription-store";
import { subscriptionService } from "../services/subscription-service";

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

type Banner = { kind: "success" | "cancelled" | "verifying"; text: string } | null;

export function SubscriptionManagementPage() {
    const user = useAuthStore(state => state.user);
    const { updatePlan, startPlusCheckout, startCollarCheckout, pollUntilActive, fetchCurrentPlan, loading } =
        useSubscriptionStore();

    const currentPlan = user.subscriptionPlan ?? "Free";
    const [banner, setBanner] = useState<Banner>(null);
    const [collarsBought, setCollarsBought] = useState(0);

    // Count purchased additional collars from billing history (real data).
    useEffect(() => {
        if (currentPlan !== "Plus") return;
        subscriptionService.getPayments().then(res => {
            const count = (res.data as any[]).filter(
                p => p.concept === "AdditionalCollar" && p.status === "Paid").length;
            setCollarsBought(count);
        }).catch(() => {});
    }, [currentPlan]);

    // Handle the redirect back from checkout.
    useEffect(() => {
        const status = new URLSearchParams(window.location.search).get("status");
        if (!status) return;
        // Clean the URL so a refresh doesn't re-trigger this.
        window.history.replaceState({}, "", window.location.pathname);

        if (status === "success") {
            setBanner({ kind: "verifying", text: "Confirmando tu pago…" });
            pollUntilActive()
                .then(fetchCurrentPlan)
                .then(() => setBanner({ kind: "success", text: "¡Listo! Plus activado." }));
        } else if (status === "cancelled") {
            setBanner({ kind: "cancelled", text: "Pago cancelado. No se hizo ningún cargo." });
        }
    }, []);

    const handleSelect = (plan: "Free" | "Plus") => {
        if (plan === "Plus") startPlusCheckout();
        else updatePlan("Free");
    };

    return (
        <div className="flex flex-col mx-20 gap-10 font-mulish">
            {banner && (
                <div
                    className={`rounded-lg px-4 py-3 text-sm font-medium ${
                        banner.kind === "success"
                            ? "bg-green-50 text-green-700 border-1 border-green-200"
                            : banner.kind === "cancelled"
                              ? "bg-amber-50 text-amber-700 border-1 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-1 border-blue-200"
                    }`}
                >
                    {banner.text}
                </div>
            )}
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
                                        onClick={() => handleSelect(plan.name)}
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

            {/* Additional collars — Plus only */}
            {currentPlan === "Plus" && (
                <Card className="w-full max-w-2xl rounded-xl shadow-none border-1 border-neutral-300">
                    <CardContent>
                        <div className="flex flex-col gap-4 p-2">
                            <div className="flex items-center gap-2">
                                <CollarIcon className="text-brand-default" />
                                <h2 className="text-xl font-bold text-neutral-900 font-rokkitt">
                                    Collares adicionales
                                </h2>
                            </div>
                            <p className="text-sm text-neutral-500">
                                Tu plan incluye 3 collares. Sumá más por <span className="font-semibold">S/25 / mes</span> cada uno.
                            </p>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <span className="text-sm text-neutral-600">
                                    Collares adicionales comprados:{" "}
                                    <span className="font-semibold text-neutral-900">{collarsBought}</span>
                                </span>
                                <button
                                    disabled={loading}
                                    onClick={() => startCollarCheckout()}
                                    className="px-5 py-2.5 rounded-lg font-semibold bg-brand-default text-white hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Procesando…" : "Comprar collar — S/25"}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
