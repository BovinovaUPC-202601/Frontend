export class HealthRecord {
    id: number = 0;
    bovineId: number = 0;
    deviceId: string = '';
    temperature: number = 0;
    heartRate: number = 0;
    isAlert: boolean = false;
    recordedAt: string = '';

    constructor(data: Partial<HealthRecord> = {}) {
        Object.assign(this, data);
    }
}

// Normal bovine ranges — mirrors backend constants
export const BOVINE_RANGES = {
    temperature: { min: 38.0, max: 39.5 },
    heartRate:   { min: 40,   max: 80   },
};
