import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useStableStore } from "../stores/stable-store";
import CloseIcon from '@mui/icons-material/Close';
import CabinIcon from '@mui/icons-material/Cabin';

export function AddStableDialog() {
  const { isOpenModal, toggleModal, newStable, setNewStable, resetNewStable } =
    useStableStore();
  const { addStable } = useGlobalStore();
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit =
    Boolean(newStable.name?.trim()) && (newStable.limit ?? 0) > 0;

  const handleClose = () => {
    resetNewStable();
    setValidationError("");
    toggleModal();
  };

  const handleSave = async () => {
    if (!newStable.name?.trim() || !newStable.limit || newStable.limit <= 0) {
      setValidationError("Completa todos los campos");
      return;
    }

    setValidationError("");
    setIsSubmitting(true);
    try {
      await addStable(newStable);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpenModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md mx-4 animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C8F0DA] flex items-center justify-center text-[#10A065]">
              <CabinIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Añadir establo</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-[8px] text-[#7E8F82] hover:text-[#0E1A12] hover:bg-[#F4F8F2] transition-all duration-150"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-[#0E1A12] font-inter">Nombre</label>
            <input
              id="name"
              type="text"
              autoComplete="off"
              placeholder="Establo Principal"
              className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
              value={newStable.name || ""}
              onChange={(e) => {
                setValidationError("");
                setNewStable({ name: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="limit" className="text-sm font-medium text-[#0E1A12] font-inter">Capacidad máxima</label>
            <input
              id="limit"
              type="text"
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="10"
              className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
              value={newStable.limit === 0 ? "" : newStable.limit}
              onChange={(e) => {
                setValidationError("");
                let val = e.target.value;
                val = val.replace(/\D/g, "");
                if (val.startsWith("0") && val.length > 1) {
                  val = val.replace(/^0+/, "");
                }
                setNewStable({ limit: val === "" ? 0 : Number(val) });
              }}
            />
          </div>

          {validationError && (
            <span className="text-[#D04A3A] text-sm text-center font-inter">
              {validationError}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-[#E1E7DF]">
          <button
            className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            disabled={!canSubmit || isSubmitting}
            className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#10A065] to-[#0A7E4D] transition-all duration-150 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            onClick={handleSave}
          >
            {isSubmitting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Añadir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
