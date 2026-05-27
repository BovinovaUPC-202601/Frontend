import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAlertsStore } from "../stores/alerts-store";
import { AlertCard } from "../components/AlertCard";
import { useGlobalStore } from "../../shared/stores/global-store";

export function AlertsPage() {
    const { info, fetchInfo } = useGlobalStore();
    const { alerts, loading, fetchAlerts, markAsRead } = useAlertsStore();

    useEffect(() => {
        fetchInfo();
    }, []);

    useEffect(() => {
        if (info?.id) fetchAlerts(info.id);
    }, [info?.id]);

    const unreadCount = alerts.filter(a => a.isUnread).length;

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

            {loading && (
                <div className="flex justify-center mt-4">
                    <CircularProgress size={32} />
                </div>
            )}

            {!loading && alerts.length === 0 && (
                <p className="text-neutral-400 text-sm">Sin alertas registradas.</p>
            )}

            {!loading && (
                <div className="flex flex-col gap-3">
                    {alerts.map(alert => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onMarkAsRead={markAsRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
