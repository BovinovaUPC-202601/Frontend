import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useInventoryStore } from '../stores/inventory-store';

export function AddCategoryDialog() {
    const { isOpenModalCategory, toggleModalCategory, newCategory, setNewCategory, resetNewCategory } = useInventoryStore();
    const { addCategory } = useGlobalStore();
    const [validationError, setValidationError] = useState<string>("");
    const canSubmit = Boolean(newCategory.name?.trim());

    const handleClose = () => {
        resetNewCategory();
        setValidationError("");
        toggleModalCategory();
    };

    const handleSave = async () => {
        if (!newCategory.name?.trim()) {
            setValidationError("Completa todos los campos");
            return;
        }

        setValidationError("");
        await addCategory(newCategory);
        handleClose();
    };

    return (
        <Dialog open={isOpenModalCategory} onClose={handleClose}  >
            <DialogTitle className='font-mulish'>Registrar categoría</DialogTitle>
            <DialogContent className='font-mulish flex flex-col gap-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        autoComplete='off'
                        placeholder="Vacunas"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newCategory.name || ""}
                        onChange={(e) => {
                            setValidationError("");
                            setNewCategory({ name: e.target.value });
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
                    disabled={!canSubmit}
                    className="cursor-pointer rounded-sm flex items-center gap-2 px-2 py-1 bg-brand-default text-white disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
                    onClick={handleSave}
                >
                    Añadir
                </button>
            </DialogActions>
        </Dialog>
    )
}