import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useMonitoringStore } from "../stores/monitoring-store";
import { LatestRecordCard } from "../components/LatestRecordCard";
import { HistoryList } from "../components/HistoryList";

export function MonitoringPage() {
    const { animals, fetchAnimals } = useGlobalStore();
    const {
        selectedBovineId,
        setSelectedBovineId,
        latestRecord,
        records,
        loading,
        fetchLatest,
        fetchHistory,
    } = useMonitoringStore();

    useEffect(() => {
        fetchAnimals();
    }, []);

    // Auto-refresh (polling): re-fetch every 5s while a bovine is selected
    useEffect(() => {
        if (!selectedBovineId) return;
        const interval = setInterval(() => {
            fetchLatest(selectedBovineId, true);
            fetchHistory(selectedBovineId, true);
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedBovineId]);

    const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSelectedBovineId(id);
        await Promise.all([fetchLatest(id), fetchHistory(id)]);
    };

    return (
        <div className="flex flex-col mx-20 gap-8 font-mulish">
            <h2 className="text-3xl text-neutral-600 font-semibold">Monitoreo IoT</h2>

            {/* Bovine selector */}
            <div className="flex flex-col gap-1 max-w-sm">
                <label className="text-sm text-neutral-500">Seleccioná un bovino</label>
                <select
                    className="border-1 border-neutral-300 rounded-md px-3 py-2 text-neutral-700 bg-white focus:outline-none"
                    value={selectedBovineId ?? ""}
                    onChange={handleSelect}
                >
                    <option value="" disabled>-- Elegir bovino --</option>
                    {animals.map(animal => (
                        <option key={animal.id} value={animal.id}>
                            {animal.name} (ID: {animal.id})
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center mt-4">
                    <CircularProgress size={32} />
                </div>
            )}

            {/* Latest record */}
            {!loading && selectedBovineId && latestRecord && (
                <LatestRecordCard record={latestRecord} />
            )}

            {!loading && selectedBovineId && !latestRecord && (
                <p className="text-neutral-400 text-sm">
                    Sin lecturas registradas para este bovino todavía.
                </p>
            )}

            {/* History */}
            {!loading && selectedBovineId && (
                <HistoryList records={records} />
            )}
        </div>
    );
}
