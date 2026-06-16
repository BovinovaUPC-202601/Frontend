import { Trash2 as DeleteIcon } from "lucide-react";
import { Pencil as EditIcon } from "lucide-react";
import { Check as CheckIcon } from "lucide-react";
import { X as CloseIcon } from "lucide-react";
import { Circle as CircleIcon } from "lucide-react";
import { Power as PowerIcon } from "lucide-react";
import { Link2 as LinkIcon } from "lucide-react";
import { Unlink as UnlinkIcon } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useGlobalStore } from "../../shared/stores/global-store";
import { StaffStatus, StaffAccessLevel, accessLevelLabels, type Staff } from '../model/staff';

interface StaffCardProps {
    staff: Staff;
}

function getInitials(name?: string): string {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const avatarColors = [
    "bg-[#C8F0DA] text-[#10A065]",
    "bg-[#CFE6F2] text-[#3A82B0]",
    "bg-[#FFE9C8] text-[#B17A2B]",
    "bg-[#FFD9D2] text-[#D04A3A]",
    "bg-[#E1E7DF] text-[#4F6354]",
    "bg-[#D4C8E8] text-[#7C5FA0]",
];

function getAvatarColor(name?: string): string {
    if (!name) return avatarColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

const accessLevelStyles: Record<StaffAccessLevel, string> = {
    [StaffAccessLevel.ReadOnly]: "bg-[#E1E7DF] text-[#4F6354]",
    [StaffAccessLevel.Editor]: "bg-[#CFE6F2] text-[#3A82B0]",
    [StaffAccessLevel.Manager]: "bg-[#D4C8E8] text-[#7C5FA0]",
};

export function StaffCard({ staff }: StaffCardProps) {
    const { deleteStaff, updateStaffAccess } = useGlobalStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedStatus, setEditedStatus] = useState<StaffStatus>(staff.status ?? StaffStatus.Activo);
    const [editedLevel, setEditedLevel] = useState<StaffAccessLevel>(staff.accessLevel ?? StaffAccessLevel.ReadOnly);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [actionError, setActionError] = useState("");

    const isActive = staff.status === StaffStatus.Activo;
    const isLinked = staff.linkedUserId != null;

    const statusConfig = isActive
        ? { border: "border-[#10A065]", label: "Activo", labelBg: "bg-[#C8F0DA]", labelText: "text-[#10A065]" }
        : { border: "border-[#7E8F82]", label: "Inactivo", labelBg: "bg-[#F4F8F2]", labelText: "text-[#7E8F82]" };

    const handleSave = async () => {
        setActionError("");
        try {
            await updateStaffAccess(staff, { employeeStatus: editedStatus, accessLevel: editedLevel });
            setIsEditing(false);
        } catch {
            setActionError("No se pudo actualizar el acceso.");
        }
    };

    const handleCancel = () => {
        setEditedStatus(staff.status ?? StaffStatus.Activo);
        setEditedLevel(staff.accessLevel ?? StaffAccessLevel.ReadOnly);
        setActionError("");
        setIsEditing(false);
    };

    // Quick toggle between active and inactive keeping the current access level.
    const handleToggleActive = async () => {
        setActionError("");
        try {
            await updateStaffAccess(staff, {
                employeeStatus: isActive ? StaffStatus.Inactivo : StaffStatus.Activo,
                accessLevel: staff.accessLevel ?? StaffAccessLevel.ReadOnly,
            });
        } catch {
            setActionError("No se pudo cambiar el estado.");
        }
    };

    const selectClass = "focus:outline-none border border-[#E1E7DF] px-3 py-1.5 rounded-[8px] text-sm text-[#0E1A12] font-inter transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]";

    return (
        <>
            <div className={`rounded-[16px] bg-white shadow-md border-l-[4px] ${statusConfig.border} p-4 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5`}>
                <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-full ${getAvatarColor(staff.name)} flex items-center justify-center shrink-0 text-sm font-bold font-inter`}>
                        {getInitials(staff.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-[#0E1A12] text-base font-bold font-inter truncate">{staff.name}</h3>
                                        <select
                                            value={editedStatus}
                                            onChange={(e) => setEditedStatus(Number(e.target.value) as StaffStatus)}
                                            className={selectClass}
                                        >
                                            <option value={StaffStatus.Activo}>Activo</option>
                                            <option value={StaffStatus.Inactivo}>Inactivo</option>
                                        </select>
                                        <select
                                            value={editedLevel}
                                            onChange={(e) => setEditedLevel(Number(e.target.value) as StaffAccessLevel)}
                                            className={selectClass}
                                        >
                                            {[StaffAccessLevel.ReadOnly, StaffAccessLevel.Editor, StaffAccessLevel.Manager].map(level => (
                                                <option key={level} value={level}>{accessLevelLabels[level]}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-[#0E1A12] text-base font-bold font-inter truncate">{staff.name}</h3>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${statusConfig.labelBg} ${statusConfig.labelText}`}>
                                                <CircleIcon className="w-1.5 h-1.5" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        {staff.email && (
                                            <p className="text-[#4F6354] text-xs font-inter truncate mt-0.5">{staff.email}</p>
                                        )}
                                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${accessLevelStyles[staff.accessLevel ?? StaffAccessLevel.ReadOnly]}`}>
                                                {accessLevelLabels[staff.accessLevel ?? StaffAccessLevel.ReadOnly]}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${isLinked ? "bg-[#C8F0DA] text-[#10A065]" : "bg-[#FFE9C8] text-[#B17A2B]"}`}>
                                                {isLinked ? <LinkIcon className="w-2.5 h-2.5" /> : <UnlinkIcon className="w-2.5 h-2.5" />}
                                                {isLinked ? "Usuario vinculado" : "Sin usuario"}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-1 shrink-0 ml-2">
                                {isEditing ? (
                                    <>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#10A065] hover:bg-[#C8F0DA] transition-all duration-150" onClick={handleSave} title="Guardar">
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#D04A3A] hover:bg-[#FFD9D2] transition-all duration-150" onClick={handleCancel} title="Cancelar">
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={`p-1.5 rounded-[8px] text-[#7E8F82] transition-all duration-150 ${isActive ? "hover:text-[#B17A2B] hover:bg-[#FFE9C8]" : "hover:text-[#10A065] hover:bg-[#C8F0DA]"}`}
                                            onClick={handleToggleActive}
                                            title={isActive ? "Desactivar acceso" : "Activar acceso"}>
                                            <PowerIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#10A065] hover:bg-[#C8F0DA] transition-all duration-150" onClick={() => setIsEditing(true)} title="Editar acceso">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#D04A3A] hover:bg-[#FFD9D2] transition-all duration-150" onClick={() => setShowDeleteConfirm(true)} title="Eliminar acceso">
                                            <DeleteIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {actionError && (
                            <p className="text-[#D04A3A] text-xs font-inter mt-2">{actionError}</p>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteConfirm && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-[20px] shadow-xl w-full max-w-sm mx-4 p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#0E1A12] font-inter mb-2">Eliminar acceso</h3>
                        <p className="text-sm text-[#4F6354] font-inter mb-6">
                            ¿Estás seguro de que querés eliminar el acceso de <strong>{staff.name}</strong>? Su cuenta de usuario no se elimina, pero dejará de ver los datos del rancho.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
                                onClick={() => setShowDeleteConfirm(false)}
                            >Cancelar</button>
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#D04A3A] to-[#B33A2E] transition-all duration-150 hover:shadow-lg active:scale-[0.97]"
                                onClick={() => { deleteStaff(staff); setShowDeleteConfirm(false); }}
                            >Eliminar</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
