import { useEffect, useState } from "react";
import { useCollarStore } from "../stores/collar-store";
import { collarLabel, makeCollarDeviceId } from "../lib/collar-id";

interface CollarSectionProps {
    bovineId: number;
}

// Per-bovine collar management used inside the bovine edit form (Plus only).
// "Cambiar" replaces the physical device on this bovine (remove old + register new).
export function CollarSection({ bovineId }: CollarSectionProps) {
    const { capacity, register, remove, fetchCollars, collarForBovine, availableNumbers, loading, error } =
        useCollarStore();
    const collar = collarForBovine(bovineId);
    const available = availableNumbers();

    const [selectedNumber, setSelectedNumber] = useState<number | "">("");
    const [changing, setChanging] = useState(false);

    useEffect(() => {
        fetchCollars();
    }, [fetchCollars]);

    const handleAssign = async () => {
        if (selectedNumber === "") return;
        const ok = await register(makeCollarDeviceId(selectedNumber), bovineId);
        if (ok) {
            setSelectedNumber("");
            setChanging(false);
        }
    };

    const handleRemove = async () => {
        if (collar) await remove(collar.id);
    };

    const handleChange = async () => {
        if (!collar || selectedNumber === "") return;
        // Replace the device on this bovine: drop the old collar, register the new one.
        const removed = await remove(collar.id);
        if (!removed) return;
        const ok = await register(makeCollarDeviceId(selectedNumber), bovineId);
        if (ok) {
            setSelectedNumber("");
            setChanging(false);
        }
    };

    const noCapacity = !collar && available.length === 0;

    return (
        <div className="flex flex-col gap-2 bg-neutral-50 border border-neutral-200 rounded-sm p-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-700">Collar IoT</span>
                <span className="text-xs text-neutral-500">
                    {capacity.remaining}/{capacity.allowance} disponibles
                </span>
            </div>

            {collar && !changing ? (
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-neutral-600">
                        {collarLabel(collar.deviceId)}
                        {collar.operationalStatus && (
                            <span className="ml-2 text-xs text-neutral-400">
                                ({collar.operationalStatus})
                            </span>
                        )}
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={loading}
                            onClick={() => setChanging(true)}
                            className="text-xs px-2 py-1 rounded-sm border border-neutral-300 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50"
                        >
                            Cambiar
                        </button>
                        <button
                            disabled={loading}
                            onClick={handleRemove}
                            className="text-xs px-2 py-1 rounded-sm border border-state-error text-state-error hover:bg-state-error hover:text-white disabled:opacity-50"
                        >
                            Quitar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <select
                        disabled={noCapacity}
                        className="text-sm focus:outline-none bg-white border border-neutral-300 px-2 py-1 rounded-sm disabled:bg-neutral-100 disabled:text-neutral-400"
                        value={selectedNumber}
                        onChange={(e) =>
                            setSelectedNumber(e.target.value === "" ? "" : Number(e.target.value))
                        }
                    >
                        <option value="">-- Elegí un collar --</option>
                        {available.map((n) => (
                            <option key={n} value={n}>
                                Collar {n}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <button
                            disabled={loading || noCapacity || selectedNumber === ""}
                            onClick={collar ? handleChange : handleAssign}
                            className="text-xs px-2 py-1 rounded-sm bg-brand-default text-white hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {collar ? "Confirmar cambio" : "Asignar"}
                        </button>
                        {changing && (
                            <button
                                disabled={loading}
                                onClick={() => {
                                    setChanging(false);
                                    setSelectedNumber("");
                                }}
                                className="text-xs px-2 py-1 rounded-sm border border-neutral-300 text-neutral-600 hover:bg-neutral-200"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                    {noCapacity && (
                        <span className="text-xs text-neutral-500 italic">
                            Sin collares disponibles. Solicitá uno adicional en Suscripción.
                        </span>
                    )}
                </div>
            )}

            {error && <span className="text-xs text-state-error">⚠️ {error}</span>}
        </div>
    );
}
