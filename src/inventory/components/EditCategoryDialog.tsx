import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import type { Category } from '../model/Category';

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

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className='font-mulish'>Editar categoría</DialogTitle>
            <DialogContent className='font-mulish flex flex-col gap-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-category-name">Nombre</label>
                    <input
                        id="edit-category-name"
                        type="text"
                        autoComplete='off'
                        placeholder="Vacunas"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
