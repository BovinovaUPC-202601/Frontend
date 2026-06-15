import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import { CreditCard as CreditCardIcon, Lock as LockIcon, CircleCheck as CheckIcon } from "lucide-react";
import { subscriptionService } from "../services/subscription-service";
import { useSubscriptionStore } from "../stores/subscription-store";

// Pure simulation: no real gateway, but it behaves like a real card form —
// per-field validation, Luhn check, and expiry rejection.
type Errors = Partial<Record<"number" | "name" | "expiry" | "cvc", string>>;

// Luhn checksum — what real gateways use to reject mistyped card numbers.
function passesLuhn(digits: string): boolean {
    let sum = 0;
    let even = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = Number(digits[i]);
        if (even) { d *= 2; if (d > 9) d -= 9; }
        sum += d;
        even = !even;
    }
    return sum % 10 === 0;
}

function validateExpiry(value: string): string | null {
    const m = value.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return "Formato MM/AA.";
    const month = Number(m[1]);
    const year = 2000 + Number(m[2]);
    if (month < 1 || month > 12) return "Mes inválido.";
    const now = new Date();
    const lastDay = new Date(year, month, 0); // end of that month
    if (lastDay < new Date(now.getFullYear(), now.getMonth(), 1)) return "Tarjeta vencida.";
    return null;
}

type Phase = "form" | "processing" | "success";

export function MockCheckoutPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const fetchCurrentPlan = useSubscriptionStore(s => s.fetchCurrentPlan);

    const session = params.get("session") ?? "";
    const concept = params.get("concept") ?? "PlusMonthly";
    const amount = params.get("amount") ?? "0";
    const label = concept === "PlusMonthly" ? "Plan Plus" : "Collar adicional";

    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [phase, setPhase] = useState<Phase>("form");
    const [formError, setFormError] = useState<string | null>(null);

    const formatNumber = (v: string) =>
        v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const formatExpiry = (v: string) => {
        const d = v.replace(/\D/g, "").slice(0, 4);
        return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    };

    const validate = (): Errors => {
        const e: Errors = {};
        const digits = number.replace(/\s/g, "");
        if (!digits) e.number = "Ingresá el número de tarjeta.";
        else if (digits.length !== 16) e.number = "Debe tener 16 dígitos.";
        else if (!passesLuhn(digits)) e.number = "Número de tarjeta inválido.";

        if (!name.trim()) e.name = "Ingresá el nombre.";
        else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) e.name = "Solo letras.";

        const exp = validateExpiry(expiry);
        if (exp) e.expiry = exp;

        if (!/^\d{3}$/.test(cvc)) e.cvc = "CVC de 3 dígitos.";
        return e;
    };

    // Clear a field's error as soon as the user edits it.
    const clearError = (field: keyof Errors) =>
        setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));

    const pay = async () => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).some(k => e[k as keyof Errors])) return; // incomplete/invalid → no procede
        if (!session) { setFormError("Sesión de pago inválida."); return; }

        setFormError(null);
        setPhase("processing");
        try {
            // Min delay so the "processing" loader is actually perceived.
            const [, ] = await Promise.all([
                subscriptionService.confirmCheckout(session),
                new Promise(r => setTimeout(r, 1600)),
            ]);
            await fetchCurrentPlan();           // unlock Plus features in the auth store
            setPhase("success");
            setTimeout(() => navigate("/dashboard"), 2200); // success screen, then the panel
        } catch {
            setFormError("No se pudo confirmar el pago. Intentá de nuevo.");
            setPhase("form");
        }
    };

    const cancel = () => navigate("/subscription-management?status=cancelled");

    const fieldClass = (field: keyof Errors) =>
        `border-1 rounded-lg px-3 py-2.5 outline-none text-neutral-800 focus:border-brand-default ${
            errors[field] ? "border-red-400" : "border-neutral-300"
        }`;

    if (phase === "processing") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-mulish p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border-1 border-neutral-200 p-10 flex flex-col items-center gap-5">
                    <CircularProgress size={48} />
                    <h2 className="text-xl font-semibold text-neutral-800">Procesando pago…</h2>
                    <p className="text-sm text-neutral-500">No cierres esta ventana.</p>
                </div>
            </div>
        );
    }

    if (phase === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-mulish p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border-1 border-neutral-200 p-10 flex flex-col items-center gap-4">
                    <CheckIcon size={72} className="text-green-500" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-neutral-900 font-rokkitt">¡Pago exitoso!</h2>
                    <p className="text-neutral-600 text-center">
                        {label} activado por S/{amount}/mes.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mt-2">
                        <CircularProgress size={14} />
                        Redirigiendo al panel…
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-mulish p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border-1 border-neutral-200 p-8 flex flex-col gap-6">
                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                    <LockIcon size={16} /> Pago seguro (simulado)
                </div>

                <div className="flex items-baseline justify-between">
                    <span className="text-neutral-600">{label}</span>
                    <span className="text-3xl font-bold text-neutral-900">
                        S/{amount}<span className="text-base font-normal text-neutral-500"> / mes</span>
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1 text-sm text-neutral-600">
                        Número de tarjeta
                        <div className={`flex items-center gap-2 ${fieldClass("number")}`}>
                            <CreditCardIcon size={18} className="text-neutral-400" />
                            <input
                                className="flex-1 outline-none text-neutral-800"
                                inputMode="numeric"
                                placeholder="4242 4242 4242 4242"
                                value={number}
                                onChange={e => { setNumber(formatNumber(e.target.value)); clearError("number"); }}
                            />
                        </div>
                        {errors.number && <span className="text-xs text-red-600">{errors.number}</span>}
                    </label>

                    <label className="flex flex-col gap-1 text-sm text-neutral-600">
                        Nombre en la tarjeta
                        <input
                            className={fieldClass("name")}
                            placeholder="JUAN PEREZ"
                            value={name}
                            onChange={e => { setName(e.target.value); clearError("name"); }}
                        />
                        {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
                    </label>

                    <div className="flex gap-3">
                        <label className="flex flex-col gap-1 text-sm text-neutral-600 flex-1">
                            Vencimiento
                            <input
                                className={fieldClass("expiry")}
                                inputMode="numeric"
                                placeholder="MM/AA"
                                value={expiry}
                                onChange={e => { setExpiry(formatExpiry(e.target.value)); clearError("expiry"); }}
                            />
                            {errors.expiry && <span className="text-xs text-red-600">{errors.expiry}</span>}
                        </label>
                        <label className="flex flex-col gap-1 text-sm text-neutral-600 w-28">
                            CVC
                            <input
                                className={fieldClass("cvc")}
                                inputMode="numeric"
                                placeholder="123"
                                value={cvc}
                                onChange={e => { setCvc(e.target.value.replace(/\D/g, "").slice(0, 3)); clearError("cvc"); }}
                            />
                            {errors.cvc && <span className="text-xs text-red-600">{errors.cvc}</span>}
                        </label>
                    </div>
                </div>

                <p className="text-xs text-neutral-400 italic">
                    Pago simulado: usá una tarjeta de prueba válida (ej. 4242 4242 4242 4242) y un vencimiento futuro. No se hace ningún cargo real.
                </p>

                {formError && <p className="text-sm text-red-600">{formError}</p>}

                <div className="flex flex-col gap-2">
                    <button
                        onClick={pay}
                        className="w-full py-3 rounded-lg font-semibold bg-brand-default text-white hover:bg-brand-dark transition-colors"
                    >
                        Pagar S/{amount}
                    </button>
                    <button
                        onClick={cancel}
                        className="w-full py-2.5 rounded-lg font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
