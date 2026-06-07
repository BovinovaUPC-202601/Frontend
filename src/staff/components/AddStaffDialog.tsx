import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useStaffStore } from '../stores/staff-store';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export function AddStaffDialog() {
    const { isOpenModal, toggleModal, newStaff, setNewStaff, resetNewStaff } = useStaffStore();
    const { addStaff } = useGlobalStore();
    const [validationError, setValidationError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canSubmit = Boolean(newStaff.name?.trim());

    const handleClose = () => {
        resetNewStaff();
        setValidationError("");
        toggleModal();
    };

    const handleSave = async () => {
        if (!newStaff.name?.trim()) {
            setValidationError("Completa todos los campos");
            return;
        }
        setValidationError("");
        setIsSubmitting(true);
        try {
            await addStaff(newStaff);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpenModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[20px] shadow-xl w-full max-w-lg mx-4 animate-fade-in">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#CFE6F2] flex items-center justify-center text-[#3A82B0]">
                            <PersonAddIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Registrar personal</h2>
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
                            placeholder="Javier Lopez"
                            className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                            value={newStaff.name || ""}
                            onChange={(e) => setNewStaff({ name: e.target.value })}
                        />
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
                        {isSubmitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Añadir"}
                    </button>
                </div>
            </div>
        </div>
    )
}
