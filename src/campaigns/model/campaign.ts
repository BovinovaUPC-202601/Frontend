export class Campaign {
    id?: number;
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
    stableIds?: number[];
    stableNames?: string[];
    bovineIds?: number[];
    bovineNames?: string[];

    constructor(data: Partial<Campaign> = {}) {
        Object.assign(this, data);

        if (data.startDate)
            this.startDate = typeof data.startDate === "string"
                ? new Date(data.startDate + "T00:00:00")
                : new Date(data.startDate);

        if (data.endDate)
            this.endDate = typeof data.endDate === "string"
                ? new Date(data.endDate + "T00:00:00")
                : new Date(data.endDate);

        if (this.startDate && this.endDate) {
            const now = new Date();
            this.isActive = this.startDate <= now && now <= this.endDate;
        }

        this.stableIds = data.stableIds ?? [];
        this.stableNames = data.stableNames ?? [];
        this.bovineIds = data.bovineIds ?? [];
        this.bovineNames = data.bovineNames ?? [];
    }
}