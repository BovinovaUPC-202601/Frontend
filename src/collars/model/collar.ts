export interface Collar {
    id: number;
    deviceId: string;
    bovineId: number;
    operationalStatus?: string;
    lifecycleStatus?: string;
    temperature?: number | null;
    heartRate?: number | null;
    batteryLevel?: number | null;
    lastReadingAt?: string | null;
    registeredAt?: string;
}

export interface CollarCapacity {
    active: number;
    allowance: number;
    available: number;
}
