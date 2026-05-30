import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import type { Product } from '../model/Product';

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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className='font-mulish'>Editar producto</DialogTitle>
            <DialogContent className='font-mulish flex flex-col gap-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-product-name">Nombre de producto</label>
                    <input
                        id="edit-product-name"
                        type="text"
                        autoComplete='off'
                        placeholder="Trigo"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="edit-product-quantity">Cantidad</label>
                    <input
                        id="edit-product-quantity"
                        type="text"
                        autoComplete='off'
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="10"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={quantity === 0 ? '' : quantity}
                        onChange={(e) => {
                            let val = e.target.value;
                            val = val.replace(/\D/g, '');
                            if (val.startsWith('0') && val.length > 1) {
                                val = val.replace(/^0+/, '');
                            }
                            setQuantity(val === '' ? 0 : Number(val));
                        }}
                    />
                    <label htmlFor="edit-product-unit">Unidad (opcional)</label>
                    <input
                        id="edit-product-unit"
                        type="text"
                        autoComplete='off'
                        placeholder="kg, cajas, litros"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    />
                    <label htmlFor="edit-product-category">Categoría</label>
                    <select
                        id="edit-product-category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value === '' ? undefined : Number(e.target.value))}
                        className={`bg-white px-2 py-1 rounded-md border-1 border-neutral-300 ${categoryId === undefined ? 'text-neutral-400' : 'text-neutral-800'}`}
                    >
                        <option value="">Selecciona...</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id} className="text-neutral-800">
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <DatePicker
                        className='mt-5'
                        label="Fecha de vencimiento (opcional)"
                        value={expirationDate ? dayjs(expirationDate) : null}
                        onChange={(date) => {
                            setExpirationDate(date ? date.toDate() : undefined);
                        }}
                    />
                </div>
                {validationError && (
                    <span className="text-state-error text-sm text-center">{validationError}</span>
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
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-sm flex items-center gap-2 px-2 py-1 bg-brand-default text-white disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
                    onClick={handleSave}
                >
                    {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Guardar'}
                </button>
            </DialogActions>
        </Dialog>
    );
}
