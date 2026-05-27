import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import dayjs from "dayjs";
import type { HealthRecord } from "../model/health-record";
import { BOVINE_RANGES } from "../model/health-record";

interface Props {
    record: HealthRecord;
}

export function LatestRecordCard({ record }: Props) {
    const tempOk = record.temperature >= BOVINE_RANGES.temperature.min && record.temperature <= BOVINE_RANGES.temperature.max;
    const hrOk   = record.heartRate   >= BOVINE_RANGES.heartRate.min   && record.heartRate   <= BOVINE_RANGES.heartRate.max;

    return (
        <Card className={`border-1 shadow-none rounded-md font-mulish ${record.isAlert ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'}`}>
            <CardContent>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-neutral-700">Última lectura</h3>
                    {record.isAlert
                        ? <WarningAmberIcon className="text-red-500" />
                        : <CheckCircleOutlineIcon className="text-green-500" />
                    }
                </div>

                <div className="flex gap-6">
                    {/* Temperature */}
                    <div className={`flex items-center gap-2 ${tempOk ? 'text-neutral-700' : 'text-red-600 font-semibold'}`}>
                        <ThermostatIcon />
                        <span>{record.temperature.toFixed(1)} °C</span>
                        {!tempOk && <WarningAmberIcon fontSize="small" className="text-red-500" />}
                    </div>

                    {/* Heart rate */}
                    <div className={`flex items-center gap-2 ${hrOk ? 'text-neutral-700' : 'text-red-600 font-semibold'}`}>
                        <MonitorHeartIcon />
                        <span>{record.heartRate.toFixed(0)} BPM</span>
                        {!hrOk && <WarningAmberIcon fontSize="small" className="text-red-500" />}
                    </div>
                </div>

                <p className="text-xs text-neutral-400 mt-3">
                    {dayjs(record.recordedAt).format('DD/MM/YYYY HH:mm:ss')} · Dispositivo: {record.deviceId}
                </p>

                <p className="text-xs text-neutral-500 mt-1">
                    Rangos normales: Temp {BOVINE_RANGES.temperature.min}–{BOVINE_RANGES.temperature.max} °C · Ritmo {BOVINE_RANGES.heartRate.min}–{BOVINE_RANGES.heartRate.max} BPM
                </p>
            </CardContent>
        </Card>
    );
}
