import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useAnimalStore } from "../stores/animals-store";
import { useAuthStore } from "../../auth/store/auth-store";
import { useCollarStore } from "../../collars/stores/collar-store";
import { makeCollarDeviceId } from "../../collars/lib/collar-id";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const MIN_TEMP = 30;
const MAX_TEMP = 45;
const MIN_HR = 10;
const MAX_HR = 150;

export function AddAnimalDialog() {
  const { isOpenModal, toggleModal, newAnimal, setNewAnimal, resetNewAnimal } =
    useAnimalStore();
  const { addAnimal, stables } = useGlobalStore();
  const isPlus = useAuthStore((s) => s.user.subscriptionPlan === "Plus");
  const { capacity, register, fetchCollars, availableNumbers } = useCollarStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCollar, setSelectedCollar] = useState<number | "">("");

  // Load capacity so we can show remaining slots and block over-assignment.
  useEffect(() => {
    if (isPlus && isOpenModal) fetchCollars();
  }, [isPlus, isOpenModal, fetchCollars]);
  const hasRequiredFields =
    Boolean(newAnimal.name?.trim()) &&
    Boolean(newAnimal.gender) &&
    Boolean(newAnimal.birthDate) &&
    Boolean(newAnimal.breed?.trim()) &&
    Boolean(newAnimal.stableId) &&
    newAnimal.bovineImg instanceof File;

  const isThresholdValid =
    newAnimal.minTemperature <= newAnimal.maxTemperature &&
    newAnimal.minHeartRate <= newAnimal.maxHeartRate;

  // Match the backend [Range] exactly: BOTH min and max must sit inside the
  // bounds, not just one side. Otherwise the form lets through values the API
  // rejects with a 400 (e.g. max temp = 0).
  const inRange = (v: number, lo: number, hi: number) => v >= lo && v <= hi;
  const isRangeValid =
    inRange(newAnimal.minTemperature, MIN_TEMP, MAX_TEMP) &&
    inRange(newAnimal.maxTemperature, MIN_TEMP, MAX_TEMP) &&
    inRange(newAnimal.minHeartRate, MIN_HR, MAX_HR) &&
    inRange(newAnimal.maxHeartRate, MIN_HR, MAX_HR);

  const isCoherent =
    newAnimal.minTemperature <= newAnimal.maxTemperature &&
    newAnimal.minHeartRate <= newAnimal.maxHeartRate;

  const thresholdError = !isCoherent
    ? "El mínimo no puede ser mayor al máximo."
    : !isRangeValid
      ? "Los valores están fuera del rango biológico permitido."
      : "";

  const isBirthDateValid = newAnimal.birthDate
    ? !dayjs(newAnimal.birthDate).isAfter(dayjs())
    : false;
  const canSubmit =
    hasRequiredFields && isBirthDateValid && isThresholdValid && isRangeValid;

  const handleClose = () => {
    resetNewAnimal();
    setValidationError("");
    setSelectedCollar("");
    toggleModal();
  };

  const handleSave = async () => {
    if (!(newAnimal.bovineImg instanceof File)) {
      setValidationError("Debes seleccionar una imagen para el animal");
      return;
    }

    if (
      !newAnimal.name?.trim() ||
      !newAnimal.gender ||
      !newAnimal.birthDate ||
      !newAnimal.breed?.trim() ||
      !newAnimal.stableId
    ) {
      setValidationError("Completa todos los campos");
      return;
    }

    if (newAnimal.minTemperature > newAnimal.maxTemperature) {
      setValidationError(
        "El umbral mínimo de temperatura no puede ser mayor al máximo",
      );
      return;
    }
    if (newAnimal.minHeartRate > newAnimal.maxHeartRate) {
      setValidationError(
        "El ritmo cardíaco mínimo no puede ser mayor al máximo",
      );
      return;
    }

    const today = dayjs();
    const birthDate = dayjs(newAnimal.birthDate);
    if (birthDate.isAfter(today)) {
      setValidationError(
        "La fecha de nacimiento no puede ser una fecha futura",
      );
      return;
    }

    setValidationError("");
    setIsSubmitting(true);
    try {
      const created = await addAnimal(newAnimal);

      // Optional collar assignment (Plus only). Two-step: the bovine must exist
      // first so we have an id to assign the collar to.
      if (isPlus && created?.id && selectedCollar !== "") {
        const ok = await register(makeCollarDeviceId(selectedCollar), created.id);
        if (!ok) {
          setValidationError(
            "Bovino creado, pero el collar no se pudo asignar. Asignalo desde editar.",
          );
          setIsSubmitting(false);
          return;
        }
      }

      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpenModal} onClose={handleClose}>
      <DialogTitle className="font-mulish">Añadir animal</DialogTitle>
      <DialogContent className="font-mulish flex flex-col gap-5 w-100">
        {/* Foto */}
        <div className="flex flex-col items-center gap-2">
          <Avatar
            src={
              typeof newAnimal.bovineImg === "string"
                ? newAnimal.bovineImg
                : newAnimal.bovineImg
                  ? URL.createObjectURL(newAnimal.bovineImg)
                  : undefined
            }
            className="w-20 h-20"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setValidationError("");
                setNewAnimal({ bovineImg: e.target.files[0] });
              }
            }}
            className="hidden"
          />
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            autoComplete="off"
            placeholder="Rebeca"
            className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
            value={newAnimal.name || ""}
            onChange={(e) => setNewAnimal({ name: e.target.value })}
          />
        </div>

        {/* Género */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gender">Género</label>
          <select
            id="gender"
            className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
            value={newAnimal.gender || ""}
            onChange={(e) => setNewAnimal({ gender: e.target.value })}
          >
            <option value="">Seleccionar</option>
            <option value="male">Macho</option>
            <option value="female">Hembra</option>
          </select>
        </div>

        {/* Fecha nacimiento */}
        <div className="flex flex-col gap-2">
          <label>Fecha de nacimiento</label>
          <DatePicker
            value={newAnimal.birthDate ? dayjs(newAnimal.birthDate) : null}
            onChange={(date) => {
              if (date) {
                setNewAnimal({ birthDate: date.format("YYYY-MM-DD") });
              }
            }}
            sx={{ width: "100%" }}
          />
        </div>

        {/* Raza */}
        <div className="flex flex-col gap-2">
          <label htmlFor="breed">Raza</label>
          <input
            id="breed"
            type="text"
            autoComplete="off"
            placeholder="Holstein"
            className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
            value={newAnimal.breed || ""}
            onChange={(e) => setNewAnimal({ breed: e.target.value })}
          />
        </div>

        {/* Establo */}
        <div className="flex flex-col gap-2">
          <label htmlFor="stable">Establo</label>
          <select
            id="stable"
            className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
            value={newAnimal.stableId || ""}
            onChange={(e) => setNewAnimal({ stableId: Number(e.target.value) })}
          >
            <option value="">Seleccionar establo</option>
            {stables.map((stable) => (
              <option key={stable.id} value={stable.id}>
                {stable.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-neutral-50 p-4 rounded-sm border border-neutral-200">
          <h4 className="font-semibold text-sm mb-3">
            Configuración de Umbrales
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-600">Temp. Mín (°C)</label>
              <input
                type="number"
                step="0.1"
                className="border border-neutral-300 px-2 py-1 rounded-sm"
                value={newAnimal.minTemperature}
                onChange={(e) =>
                  setNewAnimal({ minTemperature: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-600">Temp. Máx (°C)</label>
              <input
                type="number"
                step="0.1"
                className="border border-neutral-300 px-2 py-1 rounded-sm"
                value={newAnimal.maxTemperature}
                onChange={(e) =>
                  setNewAnimal({ maxTemperature: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-600">
                Ritmo Mín (BPM)
              </label>
              <input
                type="number"
                className="border border-neutral-300 px-2 py-1 rounded-sm"
                value={newAnimal.minHeartRate}
                onChange={(e) =>
                  setNewAnimal({ minHeartRate: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-600">
                Ritmo Máx (BPM)
              </label>
              <input
                type="number"
                className="border border-neutral-300 px-2 py-1 rounded-sm"
                value={newAnimal.maxHeartRate}
                onChange={(e) =>
                  setNewAnimal({ maxHeartRate: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Texto de ayuda y validación */}
          <div className="mt-3 text-[11px] text-neutral-500 italic">
            Rangos aceptados: Temp (30-45°C) | Ritmo Cardíaco (10-150 BPM)
          </div>
          {thresholdError && (
            <div className="mt-1 text-state-error text-xs font-medium">
              ⚠️ {thresholdError}
            </div>
          )}
        </div>

        {/* Collar IoT (solo Plus) */}
        {isPlus && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="deviceId">Collar IoT (opcional)</label>
              <span className="text-xs text-neutral-500">
                {capacity.remaining}/{capacity.allowance} disponibles
              </span>
            </div>
            <select
              id="deviceId"
              disabled={capacity.remaining <= 0}
              className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm disabled:bg-neutral-100 disabled:text-neutral-400"
              value={selectedCollar}
              onChange={(e) =>
                setSelectedCollar(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            >
              <option value="">Sin collar</option>
              {availableNumbers().map((n) => (
                <option key={n} value={n}>
                  Collar {n}
                </option>
              ))}
            </select>
            {capacity.remaining <= 0 && (
              <span className="text-xs text-neutral-500 italic">
                Sin collares disponibles. Solicitá uno adicional en Suscripción.
              </span>
            )}
          </div>
        )}

        {validationError && (
          <span className="text-state-error text-sm text-center">
            {validationError}
          </span>
        )}
      </DialogContent>

      <DialogActions>
        <button
          className="cursor-pointer rounded-sm flex items-center gap-2 px-2 py-1 bg-neutral-200 text-neutral-600"
          onClick={handleClose}
        >
          Cancelar
        </button>
        <button
          disabled={!canSubmit || isSubmitting}
          className="cursor-pointer rounded-sm flex items-center gap-2 px-2 py-1 bg-brand-default text-white disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
          onClick={handleSave}
        >
          {isSubmitting ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Añadir"
          )}
        </button>
      </DialogActions>
    </Dialog>
  );
}
