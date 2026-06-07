import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useCampaignsStore } from '../stores/campaigns-store';
import CloseIcon from '@mui/icons-material/Close';
import CampaignIcon from '@mui/icons-material/Campaign';

export function AddCampaignDialog() {
    const { isOpenModal, toggleModal, newCampaign, setNewCampaign, resetNewCampaign } = useCampaignsStore();
    const { addCampaign } = useGlobalStore();
    const [validationError, setValidationError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canSubmit = Boolean(newCampaign.name?.trim()) &&
        Boolean(newCampaign.description?.trim()) &&
        Boolean(newCampaign.startDate) &&
        Boolean(newCampaign.endDate);

    const handleClose = () => {
        resetNewCampaign();
        setValidationError("");
        toggleModal();
    };

    const handleSave = async () => {
        if (!newCampaign.name?.trim() || !newCampaign.description?.trim() ||
            !newCampaign.startDate || !newCampaign.endDate) {
            setValidationError("Completa todos los campos");
            return;
        }

        if (newCampaign.startDate && newCampaign.endDate &&
            newCampaign.startDate > newCampaign.endDate) {
            setValidationError("La fecha de inicio no puede ser posterior a la fecha de fin");
            return;
        }

        setValidationError("");
        setIsSubmitting(true);
        try {
            await addCampaign(newCampaign);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpenModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[20px] shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FFE9C8] flex items-center justify-center text-[#B17A2B]">
                            <CampaignIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Crear campaña</h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-[8px] text-[#7E8F82] hover:text-[#0E1A12] hover:bg-[#F4F8F2] transition-all duration-150">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-[#0E1A12] font-inter">Nombre</label>
                        <input
                            id="name" type="text" autoComplete='off'
                            placeholder="Campaña de vacunación"
                            className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                            value={newCampaign.name || ""}
                            onChange={(e) => setNewCampaign({ name: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="description" className="text-sm font-medium text-[#0E1A12] font-inter">Descripción</label>
                        <input
                            id="description" type="text" autoComplete='off'
                            placeholder="Vacunación contra la gripe"
                            className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                            value={newCampaign.description || ""}
                            onChange={(e) => setNewCampaign({ description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#0E1A12] font-inter">Fecha de inicio</label>
                            <DatePicker
                                value={newCampaign.startDate ? dayjs(newCampaign.startDate) : null}
                                onChange={(date) => { if (date) setNewCampaign({ startDate: date.toDate() }); }}
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#0E1A12] font-inter">Fecha de fin</label>
                            <DatePicker
                                value={newCampaign.endDate ? dayjs(newCampaign.endDate) : null}
                                onChange={(date) => { if (date) setNewCampaign({ endDate: date.toDate() }); }}
                                sx={{ width: "100%" }}
                            />
                        </div>
                    </div>

                    {validationError && (
                        <span className="text-[#D04A3A] text-sm text-center font-inter">{validationError}</span>
                    )}
                </div>

                <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-[#E1E7DF]">
                    <button
                        className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
                        onClick={handleClose}>Cancelar</button>
                    <button
                        disabled={!canSubmit || isSubmitting}
                        className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#10A065] to-[#0A7E4D] transition-all duration-150 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSave}>
                        {isSubmitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Crear"}
                    </button>
                </div>
            </div>
        </div>
    )
}
