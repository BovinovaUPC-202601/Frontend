import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useStaffStore } from '../stores/staff-store';
import { StaffAccessLevel, accessLevelLabels } from '../model/staff';
import { staffService, type UserSearchResult } from '../services/staff-service';
import { X as CloseIcon } from "lucide-react";
import { UserPlus as PersonAddIcon } from "lucide-react";
import { Search as SearchIcon } from "lucide-react";
import { CircleCheck as CheckCircleIcon } from "lucide-react";

type DialogTab = "new-user" | "existing-user";

function extractApiErrorMessage(error: any, fallback: string): string {
    const data = error?.response?.data;
    if (data) {
        if (typeof data === "string" && data.trim()) return data;
        if (typeof data.message === "string" && data.message.trim()) return data.message;
    }
    return fallback;
}

function AccessLevelSelect({ value, onChange }: { value: StaffAccessLevel | ""; onChange: (level: StaffAccessLevel) => void }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#0E1A12] font-inter">Nivel de acceso</label>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value) as StaffAccessLevel)}
                className={`focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm font-inter transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA] ${value === "" ? "text-[#7E8F82]" : "text-[#0E1A12]"}`}
            >
                <option value="" disabled>Seleccionar nivel</option>
                {[StaffAccessLevel.ReadOnly, StaffAccessLevel.Editor, StaffAccessLevel.Manager].map(level => (
                    <option key={level} value={level} className="text-[#0E1A12]">
                        {accessLevelLabels[level]}
                    </option>
                ))}
            </select>
        </div>
    );
}

const inputClass = "focus:outline-none border border-[#E1E7DF] px-3 py-2.5 rounded-[10px] text-sm text-[#0E1A12] font-inter placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]";

export function AddStaffDialog() {
    const { isOpenModal, toggleModal } = useStaffStore();
    const { addStaffWithNewUser, grantStaffAccessToExistingUser } = useGlobalStore();

    const [tab, setTab] = useState<DialogTab>("new-user");
    const [validationError, setValidationError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Tab 1: create a brand-new user
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accessLevel, setAccessLevel] = useState<StaffAccessLevel | "">("");

    // Tab 2: link an existing user found by email
    const [searchEmail, setSearchEmail] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<UserSearchResult | null>(null);
    const [existingAccessLevel, setExistingAccessLevel] = useState<StaffAccessLevel | "">("");

    const resetForm = () => {
        setName(""); setEmail(""); setPassword(""); setAccessLevel("");
        setSearchEmail(""); setFoundUser(null); setExistingAccessLevel("");
        setValidationError("");
        setTab("new-user");
    };

    const handleClose = () => {
        resetForm();
        toggleModal();
    };

    const switchTab = (next: DialogTab) => {
        setTab(next);
        setValidationError("");
    };

    const canSubmitNewUser = Boolean(name.trim() && email.trim() && password.trim() && accessLevel !== "");
    const canSubmitExisting = Boolean(foundUser && existingAccessLevel !== "");

    const handleCreateNewUser = async () => {
        if (!canSubmitNewUser) {
            setValidationError("Completa todos los campos");
            return;
        }
        setValidationError("");
        setIsSubmitting(true);
        try {
            await addStaffWithNewUser({
                name: name.trim(),
                email: email.trim(),
                password,
                accessLevel: accessLevel as StaffAccessLevel,
            });
            handleClose();
        } catch (error: any) {
            setValidationError(extractApiErrorMessage(error, "No se pudo crear el usuario."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearchUser = async () => {
        if (!searchEmail.trim()) {
            setValidationError("Ingresa un email para buscar");
            return;
        }
        setValidationError("");
        setIsSearching(true);
        setFoundUser(null);
        try {
            const res = await staffService.searchUserByEmail(searchEmail.trim());
            setFoundUser(res.data);
        } catch (error: any) {
            const message = error?.response?.status === 404
                ? "No existe un usuario con ese email."
                : extractApiErrorMessage(error, "No se pudo buscar el usuario.");
            setValidationError(message);
        } finally {
            setIsSearching(false);
        }
    };

    const handleGrantAccess = async () => {
        if (!canSubmitExisting) {
            setValidationError("Busca un usuario y elige un nivel de acceso");
            return;
        }
        setValidationError("");
        setIsSubmitting(true);
        try {
            await grantStaffAccessToExistingUser({
                email: foundUser!.email,
                accessLevel: existingAccessLevel as StaffAccessLevel,
            });
            handleClose();
        } catch (error: any) {
            setValidationError(extractApiErrorMessage(error, "No se pudo dar acceso al usuario."));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpenModal) return null;

    const tabClass = (active: boolean) =>
        `flex-1 px-4 py-2.5 text-sm font-medium font-inter rounded-[10px] transition-all duration-150 cursor-pointer ${
            active
                ? "bg-white text-[#10A065] shadow-sm"
                : "text-[#4F6354] hover:text-[#0E1A12]"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[20px] shadow-xl w-full max-w-lg mx-4 animate-fade-in">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E1E7DF]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#CFE6F2] flex items-center justify-center text-[#3A82B0]">
                            <PersonAddIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Dar acceso a personal</h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-[8px] text-[#7E8F82] hover:text-[#0E1A12] hover:bg-[#F4F8F2] transition-all duration-150">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pt-4">
                    <div className="flex gap-1 bg-[#F4F8F2] rounded-[12px] p-1">
                        <button className={tabClass(tab === "new-user")} onClick={() => switchTab("new-user")}>
                            Crear usuario nuevo
                        </button>
                        <button className={tabClass(tab === "existing-user")} onClick={() => switchTab("existing-user")}>
                            Usuario existente
                        </button>
                    </div>
                </div>

                {tab === "new-user" ? (
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="staff-name" className="text-sm font-medium text-[#0E1A12] font-inter">Nombre</label>
                            <input
                                id="staff-name" type="text" autoComplete="off"
                                placeholder="Javier Lopez"
                                className={inputClass}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="staff-email" className="text-sm font-medium text-[#0E1A12] font-inter">Email</label>
                            <input
                                id="staff-email" type="email" autoComplete="off"
                                placeholder="javier@email.com"
                                className={inputClass}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="staff-password" className="text-sm font-medium text-[#0E1A12] font-inter">Contraseña temporal</label>
                            <input
                                id="staff-password" type="password" autoComplete="new-password"
                                placeholder="••••••••"
                                className={inputClass}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <AccessLevelSelect value={accessLevel} onChange={setAccessLevel} />

                        {validationError && (
                            <span className="text-[#D04A3A] text-sm text-center font-inter">{validationError}</span>
                        )}
                    </div>
                ) : (
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="search-email" className="text-sm font-medium text-[#0E1A12] font-inter">Email del usuario</label>
                            <div className="flex gap-2">
                                <input
                                    id="search-email" type="email" autoComplete="off"
                                    placeholder="usuario@email.com"
                                    className={`${inputClass} flex-1`}
                                    value={searchEmail}
                                    onChange={(e) => { setSearchEmail(e.target.value); setFoundUser(null); }}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSearchUser(); }}
                                />
                                <button
                                    onClick={handleSearchUser}
                                    disabled={isSearching}
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-medium text-[#10A065] font-inter bg-[#C8F0DA] hover:bg-[#B8E4CB] transition-all duration-150 disabled:opacity-50"
                                >
                                    {isSearching
                                        ? <CircularProgress size={16} sx={{ color: "#10A065" }} />
                                        : <SearchIcon className="w-4 h-4" />}
                                    Buscar
                                </button>
                            </div>
                        </div>

                        {foundUser && (
                            <div className="flex items-center gap-3 rounded-[12px] border border-[#C8F0DA] bg-[#F4F8F2] px-4 py-3">
                                <CheckCircleIcon className="w-5 h-5 text-[#10A065] shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0E1A12] font-inter truncate">{foundUser.username}</p>
                                    <p className="text-xs text-[#4F6354] font-inter truncate">{foundUser.email}</p>
                                </div>
                            </div>
                        )}

                        {foundUser && (
                            <AccessLevelSelect value={existingAccessLevel} onChange={setExistingAccessLevel} />
                        )}

                        {validationError && (
                            <span className="text-[#D04A3A] text-sm text-center font-inter">{validationError}</span>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-[#E1E7DF]">
                    <button
                        className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
                        onClick={handleClose}>Cancelar</button>
                    {tab === "new-user" ? (
                        <button
                            disabled={!canSubmitNewUser || isSubmitting}
                            className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#10A065] to-[#0A7E4D] transition-all duration-150 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreateNewUser}>
                            {isSubmitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Crear usuario y dar acceso"}
                        </button>
                    ) : (
                        <button
                            disabled={!canSubmitExisting || isSubmitting}
                            className="cursor-pointer px-5 py-2.5 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#10A065] to-[#0A7E4D] transition-all duration-150 hover:shadow-lg active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleGrantAccess}>
                            {isSubmitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Dar acceso"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
