import { useEffect } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { CampaignCard } from "./CampaignCard";
import { useCampaignsStore } from "../stores/campaigns-store";

export function CampaignList() {
    const { searchQuery, filteredCampaigns, isFiltered, statusFilter, filterCampaigns } = useCampaignsStore();
    const { campaigns, fetchCampaigns } = useGlobalStore();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    useEffect(() => {
        if (isFiltered) {
            filterCampaigns(campaigns);
        }
    }, [campaigns, isFiltered, filterCampaigns]);

    let listToShow = campaigns;
    let showMessage = "";

    if (campaigns.length === 0) {
        showMessage = "No tienes campañas registradas.";
    }
    else if (isFiltered) {
        if (filteredCampaigns.length === 0) {
            if (searchQuery.trim() !== "") {
                showMessage = `No se encontraron campañas para "${searchQuery}".`;
            } else {
                showMessage = `No se encontraron campañas ${statusFilter ? "activas" : "inactivas"}.`;
            }
        } else {
            listToShow = filteredCampaigns;
        }
    }

    return (
        <>
            {showMessage ? (
                <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-10">
                    <p className="text-[#4F6354] text-base font-inter italic text-center">{showMessage}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {listToShow.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
                </div>
            )}
        </>
    );
}
