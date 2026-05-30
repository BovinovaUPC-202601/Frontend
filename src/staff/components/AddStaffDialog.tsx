import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useStaffStore } from '../stores/staff-store';

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

    return (
        <Dialog open={isOpenModal} onClose={handleClose}  >
            <DialogTitle className='font-mulish'>Registrar personal</DialogTitle>
            <DialogContent className='font-mulish flex flex-col gap-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        autoComplete='off'
                        placeholder="Javier Lopez"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newStaff.name || ""}
                        onChange={(e) => setNewStaff({ name: e.target.value })}
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