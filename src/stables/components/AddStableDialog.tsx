import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useStableStore } from '../stores/stable-store';

export function AddStableDialog() {
    const { isOpenModal, toggleModal, newStable, setNewStable, resetNewStable } = useStableStore();
    const { addStable } = useGlobalStore();
    const [validationError, setValidationError] = useState<string>("");
    const canSubmit = Boolean(newStable.name?.trim()) && newStable.limit > 0;

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
        await addStable(newStable);
        handleClose();
    };

    return (
        <Dialog open={isOpenModal} onClose={handleClose}  >
            <DialogTitle className='font-mulish'>Añadir Establo</DialogTitle>
            <DialogContent className='font-mulish flex flex-col gap-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        autoComplete='off'
                        placeholder="Establo Principal"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newStable.name || ""}
                        onChange={(e) => {
                            setValidationError("");
                            setNewStable({ name: e.target.value });
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="limit">Límite</label>
                    <input
                        id="limit"
                        type="text"
                        autoComplete='off'
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="10"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newStable.limit === 0 ? "" : newStable.limit}
                        onChange={(e) => {
                            setValidationError("");
                            let val = e.target.value;

                            // Eliminar todo lo que no sea dígito
                            val = val.replace(/\D/g, "");

                            // Evitar ceros iniciales
                            if (val.startsWith("0") && val.length > 1) {
                                val = val.replace(/^0+/, "");
                            }

                            setNewStable({ limit: val === "" ? 0 : Number(val) });
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