import dayjs from "dayjs";
import http from "../../shared/services/http";
import type { Campaign } from "../model/campaign";


export class CampaignService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + '/campaign';

    async getCampaigns() {
        return await http.get<Campaign[]>(this.endpoint + "/all-campaigns");
    }

    async addCampaign(campaign: Campaign) {
        const data = {
            ...campaign,
            startDate: dayjs(campaign.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(campaign.endDate).format('YYYY-MM-DD'),
        }
        return await http.post<Campaign>(this.endpoint, data);
    }

    async updateCampaign(campaign: Campaign) {
        const data = {
            ...campaign,
            startDate: dayjs(campaign.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(campaign.endDate).format('YYYY-MM-DD'),
        };
        return await http.put<Campaign>(`${this.endpoint}/${campaign.id}`, data);
    }

    async deleteCampaign(campaign: Campaign) {
        return await http.delete(`${this.endpoint}/${campaign.id}`);
    }
}

export const campaignService = new CampaignService();