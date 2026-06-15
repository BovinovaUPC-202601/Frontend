import {Trash2 as DeleteIcon} from "lucide-react";
import {Pencil as EditIcon} from "lucide-react";
import {Megaphone as CampaignIcon} from "lucide-react";
import {Calendar as CalendarTodayIcon} from "lucide-react";
import {Circle as CircleIcon} from "lucide-react"
import { useState } from 'react';
import { createPortal } from "react-dom";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useAuthStore } from "../../auth/store/auth-store";
import { canEdit } from "../../shared/utils/access-control";
import type { Campaign } from '../model/campaign';
import dayjs from 'dayjs';
import { EditCampaignDialog } from './EditCampaignDialog';

interface CampaignCardProps {
    campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    const { deleteCampaign } = useGlobalStore();
    const editable = useAuthStore((s) => canEdit(s.user));
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const now = dayjs();
    const start = campaign.startDate ? dayjs(campaign.startDate) : null;
    const end = campaign.endDate ? dayjs(campaign.endDate) : null;

    let status: "active" | "upcoming" | "ended" = "ended";
    if (start && end) {
        if (now.isAfter(start) && now.isBefore(end)) status = "active";
        else if (start.isAfter(now)) status = "upcoming";
    }

    const statusConfig = {
        active: { border: "border-[#10A065]", dot: "text-[#10A065]", bg: "bg-[#C8F0DA]", icon: "text-[#10A065]", label: "Activa", labelBg: "bg-[#C8F0DA]", labelText: "text-[#10A065]" },
        upcoming: { border: "border-[#3A82B0]", dot: "text-[#3A82B0]", bg: "bg-[#CFE6F2]", icon: "text-[#3A82B0]", label: "Próxima", labelBg: "bg-[#CFE6F2]", labelText: "text-[#3A82B0]" },
        ended: { border: "border-[#7E8F82]", dot: "text-[#7E8F82]", bg: "bg-[#E1E7DF]", icon: "text-[#7E8F82]", label: "Finalizada", labelBg: "bg-[#F4F8F2]", labelText: "text-[#7E8F82]" },
    }[status];

    const totalDays = start && end ? end.diff(start, "day") : 0;
    const elapsedDays = start && now.isAfter(start) ? Math.min(now.diff(start, "day"), totalDays) : 0;
    const progressPercent = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;

    return (
        <>
            <div className={`rounded-[16px] bg-white shadow-md border-l-[4px] ${statusConfig.border} p-4 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]`}>
                <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-full ${statusConfig.bg} flex items-center justify-center shrink-0`}>
                        <CampaignIcon className={`w-6 h-6 ${statusConfig.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[#0E1A12] text-base font-bold font-inter truncate">{campaign.name}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${statusConfig.labelBg} ${statusConfig.labelText}`}>
                                        <CircleIcon className="w-1.5 h-1.5" />
                                        {statusConfig.label}
                                    </span>
                                </div>
                                <p className="text-[#4F6354] text-xs font-inter mt-0.5 line-clamp-2">{campaign.description}</p>
                            </div>
                            {editable && (
                                <div className="flex gap-1 shrink-0 ml-2">
                                    <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#10A065] hover:bg-[#C8F0DA] transition-all duration-150" onClick={() => setIsEditOpen(true)} title="Editar">
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#D04A3A] hover:bg-[#FFD9D2] transition-all duration-150" onClick={() => setShowDeleteConfirm(true)} title="Eliminar">
                                        <DeleteIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`h-px bg-gradient-to-r ${statusConfig.bg} to-transparent my-3`} />

                <div className="flex items-center gap-2 mb-2">
                    <CalendarTodayIcon className={`w-3.5 h-3.5 ${statusConfig.icon} shrink-0`} />
                    <div>
                        <span className="text-[9px] text-[#7E8F82] font-inter uppercase tracking-wider block">Duración</span>
                        <span className="text-[#0E1A12] text-sm font-medium font-inter">
                            {start?.format("DD/MM/YY")} — {end?.format("DD/MM/YY")}
                        </span>
                    </div>
                </div>

                {status === "active" && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-[#4F6354] font-inter">{elapsedDays} / {totalDays} días</span>
                            <span className="text-[11px] text-[#4F6354] font-inter">{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E1E7DF]">
                            <div className="h-1.5 rounded-full bg-[#10A065] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                )}
            </div>

            <EditCampaignDialog campaign={campaign} open={isEditOpen} onClose={() => setIsEditOpen(false)} />

            {showDeleteConfirm && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-[20px] shadow-xl w-full max-w-sm mx-4 p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#0E1A12] font-inter mb-2">Eliminar campaña</h3>
                        <p className="text-sm text-[#4F6354] font-inter mb-6">
                            ¿Estás seguro de que querés eliminar <strong>{campaign.name}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
                                onClick={() => setShowDeleteConfirm(false)}
                            >Cancelar</button>
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#D04A3A] to-[#B33A2E] transition-all duration-150 hover:shadow-lg active:scale-[0.97]"
                                onClick={() => { deleteCampaign(campaign); setShowDeleteConfirm(false); }}
                            >Eliminar</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
