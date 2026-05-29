import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import type { Campaign } from '../model/campaign';

interface EditCampaignDialogProps {
    campaign: Campaign;
    open: boolean;
    onClose: () => void;
}

export function EditCampaignDialog({ campaign, open, onClose }: EditCampaignDialogProps) {
    const { updateCampaign } = useGlobalStore();

    const [name, setName] = useState(campaign.name ?? '');
    const [description, setDescription] = useState(campaign.description ?? '');
    const [startDate, setStartDate] = useState<Date | undefined>(campaign.startDate);
    const [endDate, setEndDate] = useState<Date | undefined>(campaign.endDate);
    const [validationError, setValidationError] = useState('');

    const handleClose = () => {
        setValidationError('');
        onClose();
    };

    const handleSave = async () => {
        if (!name.trim() || !description.trim() || !startDate || !endDate) {
            setValidationError('Completa todos los campos');
            return;
        }

        // Evita guardar campañas con rangos de fechas inconsistentes.
        if (startDate > endDate) {
            setValidationError('La fecha de inicio no puede ser posterior a la fecha de fin');
            return;
        }

        setValidationError('');
        await updateCampaign({ ...campaign, name, description, startDate, endDate });
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className='font-mulish'>Editar campaña</DialogTitle>
            <DialogContent className='font-mulish flex flex-col gap-5'>
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-name">Nombre</label>
                    <input
                        id="edit-name"
                        type="text"
                        autoComplete='off'
                        placeholder="Campaña de vacunación"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label htmlFor="edit-description">Descripción</label>
                    <input
                        id="edit-description"
                        type="text"
                        autoComplete='off'
                        placeholder="Vacunación contra la gripe"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className='flex gap-5 mt-5'>
                        <DatePicker
                            label="Fecha de inicio"
                            value={startDate ? dayjs(startDate) : null}
                            onChange={(date) => { if (date) setStartDate(date.toDate()); }}
                        />
                        <DatePicker
                            label="Fecha de fin"
                            value={endDate ? dayjs(endDate) : null}
                            onChange={(date) => { if (date) setEndDate(date.toDate()); }}
                        />
                    </div>
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
                    className="cursor-pointer rounded-sm flex items-center gap-2 px-2 py-1 bg-brand-default text-white"
                    onClick={handleSave}
                >
                    Guardar
                </button>
            </DialogActions>
        </Dialog>
    );
}
