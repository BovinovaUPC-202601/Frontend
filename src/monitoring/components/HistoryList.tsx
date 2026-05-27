import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import dayjs from "dayjs";
import type { HealthRecord } from "../model/health-record";

interface Props {
    records: HealthRecord[];
}

export function HistoryList({ records }: Props) {
    if (records.length === 0) {
        return <p className="text-neutral-400 text-sm">Sin registros históricos para este bovino.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-neutral-700">Historial</h3>
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                {records.map(record => (
                    <div
                        key={record.id}
                        className={`flex items-center justify-between px-4 py-2 rounded-md border-1 text-sm font-mulish
                            ${record.isAlert ? 'border-red-300 bg-red-50' : 'border-neutral-200 bg-neutral-50'}`}
                    >
                        <div className="flex gap-4 items-center">
                            {record.isAlert
                                ? <WarningAmberIcon fontSize="small" className="text-red-500" />
                                : <CheckCircleOutlineIcon fontSize="small" className="text-green-500" />
                            }
                            <span className="flex items-center gap-1 text-neutral-700">
                                <ThermostatIcon fontSize="small" />
                                {record.temperature.toFixed(1)} °C
                            </span>
                            <span className="flex items-center gap-1 text-neutral-700">
                                <MonitorHeartIcon fontSize="small" />
                                {record.heartRate.toFixed(0)} BPM
                            </span>
                        </div>
                        <span className="text-neutral-400 text-xs">
                            {dayjs(record.recordedAt).format('DD/MM/YYYY HH:mm')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
