import { useEffect } from "react";
import { useNavigate } from "react-router";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useAlertsStore } from "../stores/alerts-store";
import { useGlobalStore } from "../../shared/stores/global-store";
import type { Alert } from "../model/alert";

const POLL_INTERVAL_MS = 15_000;
const AUTO_DISMISS_MS = 8_000;

function severityOf(alert: Alert): "error" | "warning" | "success" {
  if (alert.isRed) return "error";
  if (alert.isYellow) return "warning";
  return "success";
}

function ToastItem({ alert, onView }: { alert: Alert; onView: () => void }) {
  const dismissToast = useAlertsStore((state) => state.dismissToast);

  useEffect(() => {
    const t = setTimeout(() => dismissToast(alert.id), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [alert.id, dismissToast]);

  return (
    <Slide in direction="right" mountOnEnter unmountOnExit>
      <MuiAlert
        severity={severityOf(alert)}
        variant="filled"
        className="shadow-lg font-mulish min-w-[280px] max-w-[360px]"
        action={
          <div className="flex items-center gap-1">
            <Button
              color="inherit"
              size="small"
              onClick={onView}
              sx={{ textTransform: "none" }}
            >
              Ver
            </Button>
            <IconButton
              color="inherit"
              size="small"
              aria-label="cerrar"
              onClick={() => dismissToast(alert.id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        }
      >
        <AlertTitle className="!font-semibold">
          Alerta de {alert.alertTypeLabel}
        </AlertTitle>
        {alert.message}
      </MuiAlert>
    </Slide>
  );
}

// Global background poller + corner notifications. Mounted once in MainLayout so
// it lives across every private route. Polls the alerts endpoint every 15s and
// pops a toast (bottom-left) for each alert that arrives after login.
export function AlertToaster() {
  const navigate = useNavigate();
  const info = useGlobalStore((state) => state.info);
  const fetchInfo = useGlobalStore((state) => state.fetchInfo);
  const toasts = useAlertsStore((state) => state.toasts);
  const pollAlerts = useAlertsStore((state) => state.pollAlerts);

  // After a page refresh the profile may not be loaded yet — fetch it so we
  // have the userId the poller needs.
  useEffect(() => {
    if (!info?.id) fetchInfo();
  }, [info?.id, fetchInfo]);

  useEffect(() => {
    if (!info?.id) return;
    pollAlerts(info.id);
    const id = setInterval(() => pollAlerts(info.id!), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [info?.id, pollAlerts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2">
      {toasts.map((alert) => (
        <ToastItem
          key={alert.id}
          alert={alert}
          onView={() => navigate("/alerts")}
        />
      ))}
    </div>
  );
}
