import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import dayjs from "dayjs";
import type { Alert } from "../model/alert";

interface Props {
    alert: Alert;
    onMarkAsRead: (alertId: number) => void;
}

export function AlertCard({ alert, onMarkAsRead }: Props) {
    const borderColor = alert.isRed
        ? 'border-red-400'
        : alert.isYellow
            ? 'border-yellow-400'
            : 'border-green-400';

    const bgColor = alert.isRed
        ? 'bg-red-50'
        : alert.isYellow
            ? 'bg-yellow-50'
            : 'bg-green-50';

    const UrgencyIcon = alert.isRed
        ? ErrorIcon
        : alert.isYellow
            ? WarningAmberIcon
            : CheckCircleOutlineIcon;

    const iconColor = alert.isRed
        ? 'text-red-500'
        : alert.isYellow
            ? 'text-yellow-500'
            : 'text-green-500';

    return (
        <Card className={`border-1 shadow-none rounded-md font-mulish ${borderColor} ${bgColor} ${alert.isUnread ? 'opacity-100' : 'opacity-60'}`}>
            <CardContent>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2">
                            <UrgencyIcon className={`${iconColor}`} fontSize="small" />
                            <span className="text-sm font-semibold text-neutral-700">{alert.message}</span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Chip label={alert.alertType}    size="small" variant="outlined" />
                            <Chip label={alert.urgencyLevel} size="small" variant="outlined"
                                color={alert.isRed ? 'error' : alert.isYellow ? 'warning' : 'success'} />
                            <Chip label={alert.isUnread ? 'No leída' : 'Leída'} size="small"
                                color={alert.isUnread ? 'primary' : 'default'} />
                        </div>

                        <span className="text-xs text-neutral-400">
                            Bovino ID: {alert.bovineId} · {dayjs(alert.createdAt).format('DD/MM/YYYY HH:mm')}
                        </span>
                    </div>

                    {alert.isUnread && (
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onMarkAsRead(alert.id)}
                            className="shrink-0"
                        >
                            Marcar leída
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
