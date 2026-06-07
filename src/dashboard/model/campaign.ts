export class Campaign {
    id?: number;
    name?: string;
    date?: Date;
    startDate?: Date;
    endDate?: Date;

    constructor(data: Partial<Campaign> = {}) {
        Object.assign(this, data);

        if (data.date)
            this.date = new Date(data.date);
        if (data.startDate)
            this.startDate = new Date(data.startDate);
        if (data.endDate)
            this.endDate = new Date(data.endDate);
    }
}
