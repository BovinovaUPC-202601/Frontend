import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useInventoryStore } from '../stores/inventory-store';
import { useState } from 'react';
import {X as CloseIcon} from "lucide-react";
import {Package as InventoryIcon} from "lucide-react";

export function AddProductDialog() {
    const { isOpenModalProduct, toggleModalProduct, newProduct, setNewProduct, resetNewProduct } = useInventoryStore();
    const { addProduct, categories } = useGlobalStore();
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
    const [validationError, setValidationError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canSubmit = Boolean(newProduct.name?.trim()) && newProduct.quantity > 0 && Boolean(newProduct.categoryId);

    const handleClose = () => {
        resetNewProduct();
        setSelectedCategoryName("");
        setValidationError("");
        toggleModalProduct();
    };

    const handleSave = async () => {
        if (!newProduct.name?.trim() || !newProduct.quantity || newProduct.quantity <= 0 ||
            !newProduct.categoryId) {
            setValidationError("Completa todos los campos");
            return;
        }

        setValidationError("");
        setIsSubmitting(true);
        try {
            await addProduct(newProduct);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpenModalProduct) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[20px] shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E1E7DF] flex items-center justify-center text-[#4F6354]">
                            <InventoryIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Registrar producto</h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-[8px] text-[#7E8F82] hover:text-[#0E1A12] hover:bg-[#F4F8F2] transition-all duration-150">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-[#0E1A12] font-inter">Nombre de producto</label>
                        <input
                            id="name" type="text" autoComplete='off'
                            placeholder="Trigo"
                            className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                            value={newProduct.name || ""}
                            onChange={(e) => { setValidationError(""); setNewProduct({ name: e.target.value }); }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="quantity" className="text-sm font-medium text-[#0E1A12] font-inter">Cantidad</label>
                            <input
                                id="quantity" type="text" autoComplete='off' inputMode="numeric" pattern="[0-9]*"
                                placeholder="10"
                                className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                                value={newProduct.quantity === 0 ? "" : newProduct.quantity}
                                onChange={(e) => {
                                    setValidationError("");
                                    let val = e.target.value.replace(/\D/g, "");
                                    if (val.startsWith("0") && val.length > 1) val = val.replace(/^0+/, "");
                                    setNewProduct({ quantity: val === "" ? 0 : Number(val) });
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="unit" className="text-sm font-medium text-[#0E1A12] font-inter">Unidad (opcional)</label>
                            <input
                                id="unit" type="text" autoComplete='off'
                                placeholder="kg, cajas, litros"
                                className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                                value={newProduct.unit || ""}
                                onChange={(e) => { setValidationError(""); setNewProduct({ unit: e.target.value }); }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="category" className="text-sm font-medium text-[#0E1A12] font-inter">Categoría</label>
                        <select
                            id="category"
                            value={selectedCategoryName}
                            onChange={(e) => {
                                setValidationError("");
                                const name = e.target.value;
                                setSelectedCategoryName(name);
                                const category = categories.find(c => c.name === name);
                                setNewProduct({ categoryId: category ? category.id : undefined });
                            }}
                            className={`focus:outline-none bg-white border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] font-inter text-sm transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA] ${selectedCategoryName === "" ? "text-[#7E8F82]" : "text-[#0E1A12]"}`}
                        >
                            <option value="">Selecciona...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.name} className="text-[#0E1A12]">{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#0E1A12] font-inter">Fecha de vencimiento (opcional)</label>
                        <DatePicker
                            value={newProduct.expirationDate ? dayjs(newProduct.expirationDate) : null}
                            onChange={(date) => { if (date) setNewProduct({ expirationDate: date.format("YYYY-MM-DD") }); }}
                            sx={{ width: "100%" }}
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
