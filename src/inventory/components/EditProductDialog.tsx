import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import type { Product } from '../model/Product';
import { PRODUCT_UNITS } from '../model/product-units';
import {X as CloseIcon} from "lucide-react";
import {Package as InventoryIcon} from "lucide-react";

interface EditProductDialogProps {
    product: Product;
    open: boolean;
    onClose: () => void;
}

export function EditProductDialog({ product, open, onClose }: EditProductDialogProps) {
    const { updateProduct, categories } = useGlobalStore();
    const [name, setName] = useState(product.name ?? '');
    const [quantity, setQuantity] = useState(product.quantity ?? 0);
    const [categoryId, setCategoryId] = useState<number | undefined>(product.categoryId);
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(product.expirationDate ? new Date(product.expirationDate) : undefined);
    const [unit, setUnit] = useState(product.unit ?? '');
    const [validationError, setValidationError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setName(product.name ?? '');
            setQuantity(product.quantity ?? 0);
            setCategoryId(product.categoryId);
            setExpirationDate(product.expirationDate ? new Date(product.expirationDate) : undefined);
            setUnit(product.unit ?? '');
            setValidationError('');
            setIsSubmitting(false);
        }
    }, [product, open]);

    const handleClose = () => {
        setValidationError('');
        onClose();
    };

    const handleSave = async () => {
        if (!name.trim() || quantity <= 0 || !categoryId) {
            setValidationError('Completa todos los campos');
            return;
        }

        if (expirationDate && dayjs(expirationDate).isBefore(dayjs(), 'day')) {
            setValidationError('La fecha de vencimiento debe ser futura.');
            return;
        }

        setValidationError('');
        setIsSubmitting(true);
        try {
            await updateProduct({
                ...product,
                name,
                quantity,
                categoryId,
                unit: unit.trim() || undefined,
                expirationDate: expirationDate ? dayjs(expirationDate).format('YYYY-MM-DD') : undefined,
            });
            handleClose();
        } catch (error: any) {
            setValidationError(error.message || 'Error al actualizar el producto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-white rounded-[20px] shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E1E7DF] flex items-center justify-center text-[#4F6354]">
                            <InventoryIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Editar producto</h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-[8px] text-[#7E8F82] hover:text-[#0E1A12] hover:bg-[#F4F8F2] transition-all duration-150">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-product-name" className="text-sm font-medium text-[#0E1A12] font-inter">Nombre de producto</label>
                        <input
                            id="edit-product-name" type="text" autoComplete='off'
                            placeholder="Trigo"
                            className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="edit-product-quantity" className="text-sm font-medium text-[#0E1A12] font-inter">Cantidad</label>
                            <input
                                id="edit-product-quantity" type="text" autoComplete='off' inputMode="numeric" pattern="[0-9]*"
                                placeholder="10"
                                className="focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                                value={quantity === 0 ? '' : quantity}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, '');
                                    if (val.startsWith('0') && val.length > 1) val = val.replace(/^0+/, '');
                                    setQuantity(val === '' ? 0 : Number(val));
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="edit-product-unit" className="text-sm font-medium text-[#0E1A12] font-inter">Unidad (opcional)</label>
                            <select
                                id="edit-product-unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value || '')}
                                className={`focus:outline-none bg-white border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] font-inter text-sm transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA] ${!unit ? "text-[#7E8F82]" : "text-[#0E1A12]"}`}
                            >
                                <option value="">Sin unidad</option>
                                {PRODUCT_UNITS.map(u => (
                                    <option key={u.value} value={u.value} className="text-[#0E1A12]">{u.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-product-category" className="text-sm font-medium text-[#0E1A12] font-inter">Categoría</label>
                        <select
                            id="edit-product-category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value === '' ? undefined : Number(e.target.value))}
                            className={`focus:outline-none bg-white border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] font-inter text-sm transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA] ${categoryId === undefined ? "text-[#7E8F82]" : "text-[#0E1A12]"}`}
                        >
                            <option value="">Selecciona...</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id} className="text-[#0E1A12]">{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#0E1A12] font-inter">Fecha de vencimiento (opcional)</label>
                        <DatePicker
                            value={expirationDate ? dayjs(expirationDate) : null}
                            onChange={(date) => { setExpirationDate(date ? date.toDate() : undefined); }}
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
