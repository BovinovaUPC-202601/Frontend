import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import type { Category } from '../model/Category';
import {X as CloseIcon} from "lucide-react";
import {Boxes as Inventory2Icon} from "lucide-react";

interface EditCategoryDialogProps {
    category: Category;
    open: boolean;
    onClose: () => void;
}

export function EditCategoryDialog({ category, open, onClose }: EditCategoryDialogProps) {
    const { updateCategory } = useGlobalStore();
    const [name, setName] = useState(category.name ?? '');
    const [validationError, setValidationError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setName(category.name ?? '');
            setValidationError('');
            setIsSubmitting(false);
        }
    }, [category, open]);

    const handleClose = () => {
        setValidationError('');
        onClose();
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setValidationError('Completa todos los campos');
            return;
        }

        setValidationError('');
        setIsSubmitting(true);
        try {
            await updateCategory({ ...category, name });
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-white rounded-[20px] shadow-xl w-full max-w-lg mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D4C8E8] flex items-center justify-center text-[#7C5FA0]">
                            <Inventory2Icon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Editar categoría</h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-[8px] text-[#7E8F82] hover:text-[#0E1A12] hover:bg-[#F4F8F2] transition-all duration-150">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-category-name" className="text-sm font-medium text-[#0E1A12] font-inter">Nombre</label>
                        <input
                            id="edit-category-name" type="text" autoComplete='off'
                            placeholder="Vacunas"
                            className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                        disabled={isSubmitting}
                        className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#10A065] to-[#0A7E4D] transition-all duration-150 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSave}>
                        {isSubmitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
