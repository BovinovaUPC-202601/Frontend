export interface BovineBreed {
    id: number;
    name: string;
    minTemperature: number;
    maxTemperature: number;
    minHeartRate: number;
    maxHeartRate: number;
    userId?: number | null;
}
