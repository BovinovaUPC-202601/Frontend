import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useAnimalStore } from '../stores/animals-store';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

export function AddAnimalDialog() {
    const { isOpenModal, toggleModal, newAnimal, setNewAnimal, resetNewAnimal } = useAnimalStore();
    const { addAnimal, stables } = useGlobalStore();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [validationError, setValidationError] = useState<string>("");
    const hasRequiredFields =
        Boolean(newAnimal.name?.trim()) &&
        Boolean(newAnimal.gender) &&
        Boolean(newAnimal.birthDate) &&
        Boolean(newAnimal.breed?.trim()) &&
        Boolean(newAnimal.stableId) &&
        newAnimal.bovineImg instanceof File;

    const isBirthDateValid = newAnimal.birthDate ? !dayjs(newAnimal.birthDate).isAfter(dayjs()) : false;
    const canSubmit = hasRequiredFields && isBirthDateValid;

    const handleClose = () => {
        resetNewAnimal();
        setValidationError("");
        toggleModal();
    };

    const handleSave = async () => {
        if (!(newAnimal.bovineImg instanceof File)) {
            setValidationError("Debes seleccionar una imagen para el animal");
            return;
        }

        if (!newAnimal.name?.trim() || !newAnimal.gender || !newAnimal.birthDate ||
            !newAnimal.breed?.trim() || !newAnimal.stableId) {
            setValidationError("Completa todos los campos");
            return;
        }

        const today = dayjs();
        const birthDate = dayjs(newAnimal.birthDate);
        if (birthDate.isAfter(today)) {
            setValidationError("La fecha de nacimiento no puede ser una fecha futura");
            return;
        }

        setValidationError("");
        await addAnimal(newAnimal);
        handleClose();
    };

    return (
        <Dialog open={isOpenModal} onClose={handleClose}>
            <DialogTitle className="font-mulish">Añadir animal</DialogTitle>
            <DialogContent className="font-mulish flex flex-col gap-5 w-100">

                {/* Foto */}
                <div className="flex flex-col items-center gap-2">
                    <Avatar
                        src={
                            typeof newAnimal.bovineImg === "string"
                                ? newAnimal.bovineImg
                                : newAnimal.bovineImg
                                    ? URL.createObjectURL(newAnimal.bovineImg)
                                    : undefined
                        }
                        className="w-20 h-20"
                        onClick={() => fileInputRef.current?.click()}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setValidationError("");
                                setNewAnimal({ bovineImg: e.target.files[0] });
                            }
                        }}
                        className='hidden'
                    />
                </div>

                {/* Nombre */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="off"
                        placeholder="Rebeca"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newAnimal.name || ""}
                        onChange={(e) => setNewAnimal({ name: e.target.value })}
                    />
                </div>

                {/* Género */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="gender">Género</label>
                    <select
                        id="gender"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newAnimal.gender || ""}
                        onChange={(e) => setNewAnimal({ gender: e.target.value })}
                    >
                        <option value="">Seleccionar</option>
                        <option value="male">Macho</option>
                        <option value="female">Hembra</option>
                    </select>
                </div>

                {/* Fecha nacimiento */}
                <div className="flex flex-col gap-2">
                    <label>Fecha de nacimiento</label>
                    <DatePicker
                        value={newAnimal.birthDate ? dayjs(newAnimal.birthDate) : null}
                        onChange={(date) => {
                            if (date) {
                                setNewAnimal({ birthDate: date.format("YYYY-MM-DD") });
                            }
                        }}
                        sx={{ width: "100%" }}
                    />
                </div>

                {/* Raza */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="breed">Raza</label>
                    <input
                        id="breed"
                        type="text"
                        autoComplete="off"
                        placeholder="Holstein"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newAnimal.breed || ""}
                        onChange={(e) => setNewAnimal({ breed: e.target.value })}
                    />
                </div>

                {/* Establo */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="stable">Establo</label>
                    <select
                        id="stable"
                        className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                        value={newAnimal.stableId || ""}
                        onChange={(e) => setNewAnimal({ stableId: Number(e.target.value) })}
                    >
                        <option value="">Seleccionar establo</option>
                        {stables.map((stable) => (
                            <option key={stable.id} value={stable.id}>
                                {stable.name}
                            </option>
                        ))}
                    </select>
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
    );
}
