import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useInventoryStore } from '../stores/inventory-store';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

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

    return (
        <Dialog open={isOpenModalProduct} onClose={handleClose}  >
            <DialogTitle className='font-mulish'>Registrar producto</DialogTitle>
            <DialogContent className='font-mulish flex flex-col gap-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nombre de producto</label>
                    <input
                        id="name"
                        type="text"
                        autoComplete='off'
                        placeholder="Trigo"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newProduct.name || ""}
                        onChange={(e) => {
                            setValidationError("");
                            setNewProduct({ name: e.target.value });
                        }}
                    />
                    <label htmlFor="limit">Cantidad</label>
                    <input
                        id="limit"
                        type="text"
                        autoComplete='off'
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="10"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newProduct.quantity === 0 ? "" : newProduct.quantity}
                        onChange={(e) => {
                            setValidationError("");
                            let val = e.target.value;

                            // Eliminar todo lo que no sea dígito
                            val = val.replace(/\D/g, "");

                            // Evitar ceros iniciales
                            if (val.startsWith("0") && val.length > 1) {
                                val = val.replace(/^0+/, "");
                            }

                            setNewProduct({ quantity: val === "" ? 0 : Number(val) });
                        }}
                    />
                    <label htmlFor="unit">Unidad (opcional)</label>
                    <input
                        id="unit"
                        type="text"
                        autoComplete='off'
                        placeholder="kg, cajas, litros"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newProduct.unit || ""}
                        onChange={(e) => {
                            setValidationError("");
                            setNewProduct({ unit: e.target.value });
                        }}
                    />
                    <label htmlFor="category">Categoría</label>
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
                        className={`bg-white px-2 py-1 rounded-md border-1 border-neutral-300 ${selectedCategoryName === "" ? "text-neutral-400" : "text-neutral-800"}`}
                    >
                        <option value="" className="text-neutral-400">Selecciona...</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name} className="text-neutral-800">
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <DatePicker
                        className='mt-5'
                        label="Fecha de vencimiento (opcional)"
                        value={newProduct.expirationDate ? dayjs(newProduct.expirationDate) : null}
                        onChange={(date) => {
                            if (date) {
                                setNewProduct({ expirationDate: date.format("YYYY-MM-DD") });
                            }
                        }}
                    />
                </div>
                {validationError && (
                    <span className="text-state-error text-sm text-center">{validationError}</span>
                )}
            </DialogContent>
            <DialogActions className='font-mulish'>
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
                    {isSubmitting ? <CircularProgress size={16} color="inherit" /> : "Añadir"}
                </button>
            </DialogActions>
        </Dialog>
    )
}