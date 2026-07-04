import { useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Bell as NotificationsIcon} from "lucide-react";
import { useAlertsStore } from "../stores/alerts-store";
import { AlertCard } from "../components/AlertCard";
import { useGlobalStore } from "../../shared/stores/global-store";

export function AlertsPage() {
    const { info, fetchInfo, animals, fetchAnimals } = useGlobalStore();
    const { alerts, loading, fetchAlerts, markAsRead } = useAlertsStore();

    // "all" shows every alert; otherwise filter to a single bovine.
    const [selectedBovineId, setSelectedBovineId] = useState<number | "all">("all");
    // RF-27: default to criticality so the most urgent alerts surface first.
    const [sortBy, setSortBy] = useState<"urgency" | "recent">("urgency");

    useEffect(() => {
        fetchInfo();
        fetchAnimals();
    }, []);

    useEffect(() => {
        if (info?.id) fetchAlerts(info.id);
    }, [info?.id]);

    // Resolve a bovine id to a friendly name (falls back to the raw id).
    const nameByBovineId = useMemo(() => {
        const map = new Map<number, string>();
        animals.forEach(a => map.set(a.id, a.name));
        return map;
    }, [animals]);

    // Only offer bovines that actually have alerts, so the dropdown stays relevant.
    const bovineOptions = useMemo(() => {
        const ids = Array.from(new Set(alerts.map(a => a.bovineId).filter((id): id is number => id !== null)));
        return ids
            .map(id => ({ id, name: nameByBovineId.get(id) ?? `Bovino ${id}` }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [alerts, nameByBovineId]);

    const visibleAlerts = selectedBovineId === "all"
        ? alerts
        : alerts.filter(a => a.bovineId === selectedBovineId);

    // Red (most critical) first, then Yellow, then the rest; ties broken by recency.
    const sortedAlerts = useMemo(() => {
        const rank = (level: string) => (level === "Red" ? 0 : level === "Yellow" ? 1 : 2);
        return [...visibleAlerts].sort((a, b) =>
            sortBy === "urgency"
                ? rank(a.urgencyLevel) - rank(b.urgencyLevel) || b.createdAt.localeCompare(a.createdAt)
                : b.createdAt.localeCompare(a.createdAt)
        );
    }, [visibleAlerts, sortBy]);

    const unreadCount = visibleAlerts.filter(a => a.isUnread).length;

    return (
        <div className="flex flex-col mx-20 gap-8 font-mulish">
            <div className="flex items-center gap-3">
                <NotificationsIcon className="text-neutral-600" />
                <h2 className="text-3xl text-neutral-600 font-semibold">Alertas Sanitarias</h2>
                {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} sin leer
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                <FormControl size="small" sx={{ minWidth: 240 }}>
                    <InputLabel id="bovine-filter-label">Filtrar por bovino</InputLabel>
                    <Select
                        labelId="bovine-filter-label"
                        label="Filtrar por bovino"
                        value={selectedBovineId}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedBovineId(value === "all" ? "all" : Number(value));
                        }}
                    >
                        <MenuItem value="all">Todos los bovinos</MenuItem>
                        {bovineOptions.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="sort-label">Ordenar por</InputLabel>
                    <Select
                        labelId="sort-label"
                        label="Ordenar por"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "urgency" | "recent")}
                    >
                        <MenuItem value="urgency">Criticidad</MenuItem>
                        <MenuItem value="recent">Más recientes</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {loading && (
                <div className="flex justify-center mt-4">
                    <CircularProgress size={32} />
                </div>
            )}

            {!loading && visibleAlerts.length === 0 && (
                <p className="text-neutral-400 text-sm">
                    {selectedBovineId === "all"
                        ? "Sin alertas registradas."
                        : "Este bovino no tiene alertas."}
                </p>
            )}

            {!loading && (
                <div className="flex flex-col gap-3">
                    {sortedAlerts.map(alert => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            bovineName={alert.bovineId !== null ? nameByBovineId.get(alert.bovineId) : undefined}
                            onMarkAsRead={markAsRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
