import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useBreedStore } from "../stores/breed-store";
import {X as CloseIcon} from "lucide-react";
import {PawPrint as PetsIcon} from "lucide-react";
import {Pencil as EditIcon} from "lucide-react";
import {Trash2 as DeleteIcon} from "lucide-react";
import {Plus as AddIcon} from "lucide-react";
import type { BovineBreed } from "../model/bovine-breed";

const MIN_TEMP = 30;
const MAX_TEMP = 45;
const MIN_HR = 10;
const MAX_HR = 150;

export function ManageBreedsDialog() {
  const { isOpenModal, toggleModal, editingBreed, setEditingBreed } = useBreedStore();
  const { breeds, addBreed, updateBreed, deleteBreed } = useGlobalStore();
  const [name, setName] = useState("");
  const [minTemperature, setMinTemperature] = useState(MIN_TEMP);
  const [maxTemperature, setMaxTemperature] = useState(MAX_TEMP);
  const [minHeartRate, setMinHeartRate] = useState(MIN_HR);
  const [maxHeartRate, setMaxHeartRate] = useState(MAX_HR);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const globalBreeds = breeds.filter((b) => b.userId == null);
  const userBreeds = breeds.filter((b) => b.userId != null);

  const resetForm = () => {
    setName("");
    setMinTemperature(MIN_TEMP);
    setMaxTemperature(MAX_TEMP);
    setMinHeartRate(MIN_HR);
    setMaxHeartRate(MAX_HR);
    setValidationError("");
    setEditingBreed(null);
  };

  const handleClose = () => {
    resetForm();
    setDeletingId(null);
    toggleModal();
  };

  const startCreate = () => {
    resetForm();
    setEditingBreed({} as BovineBreed);
  };

  const startEdit = (breed: BovineBreed) => {
    setName(breed.name);
    setMinTemperature(breed.minTemperature);
    setMaxTemperature(breed.maxTemperature);
    setMinHeartRate(breed.minHeartRate);
    setMaxHeartRate(breed.maxHeartRate);
    setValidationError("");
    setEditingBreed(breed);
    setDeletingId(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setValidationError("El nombre de la raza es obligatorio");
      return;
    }
    if (minTemperature > maxTemperature) {
      setValidationError("La temperatura mínima no puede ser mayor a la máxima");
      return;
    }
    if (minHeartRate > maxHeartRate) {
      setValidationError("El ritmo cardíaco mínimo no puede ser mayor al máximo");
      return;
    }

    setValidationError("");
    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        minTemperature,
        maxTemperature,
        minHeartRate,
        maxHeartRate,
      };

      if (editingBreed?.id) {
        await updateBreed(editingBreed.id, payload);
      } else {
        await addBreed(payload);
      }
      resetForm();
    } catch (error: unknown) {
      setValidationError(error instanceof Error ? error.message : "Error al guardar la raza");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteBreed(id);
      setDeletingId(null);
    } catch (error: unknown) {
      setValidationError(error instanceof Error ? error.message : "Error al eliminar la raza");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpenModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C8F0DA] flex items-center justify-center text-[#10A065]">
              <PetsIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#0E1A12] font-inter">
              {editingBreed?.id ? "Editar raza" : "Administrar razas"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-[8px] text-[#7E8F82] hover:text-[#0E1A12] hover:bg-[#F4F8F2] transition-all duration-150"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {!editingBreed ? (
            <>
              {/* Global breeds — read only */}
              {globalBreeds.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#7E8F82] uppercase tracking-wider mb-2 font-inter">
                    Razas por defecto
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {globalBreeds.map((breed) => (
                      <div
                        key={breed.id}
                        className="px-3 py-1.5 rounded-[8px] bg-[#E1E7DF] text-sm text-[#4F6354] font-inter"
                      >
                        {breed.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User breeds — editable */}
              <div>
                <h3 className="text-xs font-semibold text-[#7E8F82] uppercase tracking-wider mb-2 font-inter">
                  Razas del rancho
                </h3>
                {userBreeds.length === 0 ? (
                  <p className="text-sm text-[#7E8F82] font-inter text-center py-3">
                    No tienes razas personalizadas
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {userBreeds.map((breed) => (
                      <div
                        key={breed.id}
                        className="flex items-center justify-between p-3 rounded-[12px] bg-[#F4F8F2] border border-[#E1E7DF]"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#0E1A12] font-inter">{breed.name}</span>
                          <span className="text-[11px] text-[#7E8F82] font-inter">
                            Temp: {breed.minTemperature}–{breed.maxTemperature}°C | Ritmo: {breed.minHeartRate}–{breed.maxHeartRate} BPM
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(breed)}
                            className="p-2 rounded-[8px] text-[#4F6354] hover:bg-[#E1E7DF] transition-all duration-150"
                            title="Editar"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          {deletingId === breed.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                disabled={isSubmitting}
                                onClick={() => handleDelete(breed.id)}
                                className="px-2 py-1.5 rounded-[8px] text-xs font-medium text-white bg-[#D04A3A] hover:bg-[#B33D2F] transition-all duration-150"
                              >
                                {isSubmitting ? (
                                  <CircularProgress size={14} sx={{ color: "white" }} />
                                ) : (
                                  "Eliminar"
                                )}
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="px-2 py-1.5 rounded-[8px] text-xs font-medium text-[#4F6354] bg-[#E1E7DF] hover:bg-[#C8D4CB] transition-all duration-150"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingId(breed.id)}
                              className="p-2 rounded-[8px] text-[#D04A3A] hover:bg-[#FDE8E5] transition-all duration-150"
                              title="Eliminar"
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={startCreate}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#10A065] to-[#0A7E4D] transition-all duration-150 hover:shadow-lg active:scale-[0.97]"
              >
                <AddIcon className="w-4 h-4" />
                Añadir raza
              </button>
            </>
          ) : (
            <>
              {/* Breed form */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="breed-name" className="text-sm font-medium text-[#0E1A12] font-inter">Nombre</label>
                <input
                  id="breed-name"
                  type="text"
                  autoComplete="off"
                  placeholder="Angus"
                  className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                  value={name}
                  onChange={(e) => { setValidationError(""); setName(e.target.value); }}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-[#0E1A12] font-inter mb-3">
                  Umbrales biométricos
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#4F6354] font-inter">Temp. Mín (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="focus:outline-none border border-[#E1E7DF] bg-white px-2.5 py-2 rounded-[8px] text-sm text-[#0E1A12] font-inter transition-all duration-200 focus:border-[#10A065]"
                      value={minTemperature}
                      onChange={(e) => setMinTemperature(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#4F6354] font-inter">Temp. Máx (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="focus:outline-none border border-[#E1E7DF] bg-white px-2.5 py-2 rounded-[8px] text-sm text-[#0E1A12] font-inter transition-all duration-200 focus:border-[#10A065]"
                      value={maxTemperature}
                      onChange={(e) => setMaxTemperature(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#4F6354] font-inter">Ritmo Mín (BPM)</label>
                    <input
                      type="number"
                      className="focus:outline-none border border-[#E1E7DF] bg-white px-2.5 py-2 rounded-[8px] text-sm text-[#0E1A12] font-inter transition-all duration-200 focus:border-[#10A065]"
                      value={minHeartRate}
                      onChange={(e) => setMinHeartRate(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#4F6354] font-inter">Ritmo Máx (BPM)</label>
                    <input
                      type="number"
                      className="focus:outline-none border border-[#E1E7DF] bg-white px-2.5 py-2 rounded-[8px] text-sm text-[#0E1A12] font-inter transition-all duration-200 focus:border-[#10A065]"
                      value={maxHeartRate}
                      onChange={(e) => setMaxHeartRate(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {validationError && (
                <span className="text-[#D04A3A] text-sm text-center font-inter">{validationError}</span>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-[#E1E7DF]">
          {editingBreed ? (
            <>
              <button
                className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
                onClick={() => { resetForm(); setDeletingId(null); }}
              >
                Cancelar
              </button>
              <button
                disabled={isSubmitting}
                className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#10A065] to-[#0A7E4D] transition-all duration-150 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
              >
                {isSubmitting ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : editingBreed.id ? (
                  "Guardar"
                ) : (
                  "Crear"
                )}
              </button>
            </>
          ) : (
            <button
              className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
              onClick={handleClose}
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
