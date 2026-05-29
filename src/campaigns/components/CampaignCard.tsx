import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState } from 'react';
import { useGlobalStore } from "../../shared/stores/global-store";
import type { Campaign } from '../model/campaign';
import CircleIcon from '@mui/icons-material/Circle';
import dayjs from 'dayjs';
import { EditCampaignDialog } from './EditCampaignDialog';

interface CampaignCardProps {
    campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    const { deleteCampaign } = useGlobalStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <>
            <Card className="bg-neutral-100 font-mulish border-1 border-neutral-300 shadow-none rounded-md">
                <CardContent>
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                                <CircleIcon
                                    className={`w-4 h-auto ${campaign.isActive ? 'text-brand-default' : 'text-neutral-400'}`}
                                />
                                {campaign.name}
                            </span>
                            <span className="text-sm text-neutral-500">
                                Descripcion: {campaign.description}
                            </span>
                            <span className="text-sm text-neutral-500">
                                Fecha de inicio: {dayjs(campaign.startDate).format('DD/MM/YYYY')}
                            </span>
                            <span className="text-sm text-neutral-500">
                                Fecha de fin: {dayjs(campaign.endDate).format('DD/MM/YYYY')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <EditIcon
                                className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-brand-default"
                                onClick={() => setIsEditOpen(true)}
                            />
                            <DeleteIcon
                                className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-state-error"
                                onClick={() => deleteCampaign(campaign)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditCampaignDialog
                campaign={campaign}
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />
        </>
    );
}
