import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Campaign } from "../model/campaign";

interface CampaignsState {
    // Filtering
    searchQuery: string;
    statusFilter?: boolean;
    setSearchQuery: (query: string) => void;
    setStatusFilter: (status?: boolean) => void;
    filterCampaigns: (campaigns: Campaign[]) => void;
    filteredCampaigns: Campaign[];
    isFiltered: boolean;

    // View mode
    viewMode: "list" | "calendar";
    setViewMode: (mode: "list" | "calendar") => void;

    // Calendar
    calendarDate: Date;
    setCalendarDate: (date: Date) => void;

    // Modal & New Campaign
    isOpenModal: boolean;
    toggleModal: () => void;
    newCampaign: Campaign;
    setNewCampaign: (campaign: Partial<Campaign>) => void;
    resetNewCampaign: () => void;
}

export const useCampaignsStore = create(immer<CampaignsState>((set) => ({
    // Filtering
    searchQuery: "",
    statusFilter: undefined,
    setSearchQuery: (query) => set(state => {
        state.searchQuery = query;
        state.isFiltered = query.trim() !== "" || state.statusFilter !== undefined;
    }),
    setStatusFilter: (status) => set(state => {
        state.statusFilter = status;
        state.isFiltered = state.searchQuery.trim() !== "" || status !== undefined;
    }),
    filterCampaigns: (campaigns) => set(state => {
        let filtered = campaigns;
        if (state.searchQuery.trim() !== "") {
            filtered = filtered.filter(s =>
                s.name?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                s.description?.toLowerCase().includes(state.searchQuery.toLowerCase())
            );
        }
        if (state.statusFilter !== undefined) {
            filtered = filtered.filter(s => s.isActive === state.statusFilter);
        }
        state.filteredCampaigns = filtered;
        state.isFiltered = state.searchQuery.trim() !== "" || state.statusFilter !== undefined;
    }),
    filteredCampaigns: [],
    isFiltered: false,

    // View mode
    viewMode: "list",
    setViewMode: (mode) => set(state => { state.viewMode = mode }),

    // Calendar
    calendarDate: new Date(),
    setCalendarDate: (date) => set(state => { state.calendarDate = date }),

    // Modal & New Campaign
    isOpenModal: false,
    toggleModal: () => set(state => { state.isOpenModal = !state.isOpenModal }),
    newCampaign: new Campaign(),
    setNewCampaign: (campaign) => set(state => { state.newCampaign = { ...state.newCampaign, ...campaign } }),
    resetNewCampaign: () => set(state => { state.newCampaign = new Campaign() }),
})));
