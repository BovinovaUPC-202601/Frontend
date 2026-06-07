import { useEffect } from "react";
import { AddCampaignDialog } from "../components/AddCampaignDialog";
import { CampaignList } from "../components/CampaignList";
import { CampaignCalendar } from "../components/CampaignCalendar";
import { SearchBar } from "../components/SearchBar";
import { useCampaignsStore } from "../stores/campaigns-store";
import CampaignIcon from '@mui/icons-material/Campaign';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export function CampaignsPage() {
    const { setSearchQuery, viewMode, setViewMode } = useCampaignsStore();

    useEffect(() => {
        setSearchQuery("");
    }, []);

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full px-6 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFE9C8] flex items-center justify-center text-[#B17A2B]">
                        <CampaignIcon className="w-5 h-5" />
                    </div>
                    <h1 className="text-[24px] leading-[32px] text-[#0E1A12] font-semibold font-inter">
                        Campañas
                    </h1>
                </div>

                <div className="flex items-center bg-[#F4F8F2] rounded-[12px] p-1 border border-[#E1E7DF]">
                    <button
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-sm font-medium font-inter transition-all duration-150 ${viewMode === "list" ? "bg-white shadow-sm text-[#0E1A12]" : "text-[#7E8F82] hover:text-[#0E1A12]"}`}
                        onClick={() => setViewMode("list")}
                    >
                        <ViewListIcon className="w-4 h-4" />
                        Lista
                    </button>
                    <button
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-sm font-medium font-inter transition-all duration-150 ${viewMode === "calendar" ? "bg-white shadow-sm text-[#0E1A12]" : "text-[#7E8F82] hover:text-[#0E1A12]"}`}
                        onClick={() => setViewMode("calendar")}
                    >
                        <CalendarMonthIcon className="w-4 h-4" />
                        Calendario
                    </button>
                </div>
            </div>

            <SearchBar />
            {viewMode === "list" ? <CampaignList /> : <CampaignCalendar />}
            <AddCampaignDialog />
        </div>
    )
}
