export class Campaign {
    id?: number;
    name?: string;
    date?: Date;
    startDate?: Date;
    endDate?: Date;

    constructor(data: Partial<Campaign> = {}) {
        Object.assign(this, data);

        if (data.date)
            this.date = typeof data.date === "string"
                ? new Date(data.date + "T00:00:00")
                : new Date(data.date);
        if (data.startDate)
            this.startDate = typeof data.startDate === "string"
                ? new Date(data.startDate + "T00:00:00")
                : new Date(data.startDate);
        if (data.endDate)
            this.endDate = typeof data.endDate === "string"
                ? new Date(data.endDate + "T00:00:00")
                : new Date(data.endDate);
    }
}
