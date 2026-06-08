import {Plus as AddIcon} from "lucide-react";
import { useGlobalStore } from '../../shared/stores/global-store';
import { useCampaignsStore } from '../stores/campaigns-store';

export function SearchBar() {
    const { toggleModal, searchQuery, setSearchQuery, statusFilter, setStatusFilter, filterCampaigns } = useCampaignsStore();
    const { campaigns } = useGlobalStore();

    return (
        <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center flex-1 gap-3">
                    <input
                        className="focus:outline-none bg-white px-4 py-2.5 rounded-[12px] border border-[#E1E7DF] flex-1 font-inter text-sm text-[#0E1A12] placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                        type="text"
                        placeholder="Buscar campaña por nombre o descripción"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            filterCampaigns(campaigns);
                        }}
                    />
                    <select
                        value={statusFilter === undefined ? "" : String(statusFilter)}
                        onChange={(e) => {
                            const value = e.target.value;
                            setStatusFilter(value === "" ? undefined : value === "true");
                            filterCampaigns(campaigns);
                        }}
                        className={`focus:outline-none bg-white px-3 py-2.5 rounded-[12px] border border-[#E1E7DF] font-inter text-sm transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA] ${statusFilter === undefined ? "text-[#7E8F82]" : "text-[#0E1A12]"}`}
                    >
                        <option value="">Todos los estados</option>
                        <option value="true" className="text-[#0E1A12]">Activo</option>
                        <option value="false" className="text-[#0E1A12]">Inactivo</option>
                    </select>
                </div>

                <button
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#10A065] to-[#0A7E4D] text-white font-inter font-medium text-sm rounded-[14px] h-12 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                    onClick={toggleModal}
                >
                    <AddIcon className="w-5 h-5" />
                    Crear campaña
                </button>
            </div>
        </div>
    )
}
