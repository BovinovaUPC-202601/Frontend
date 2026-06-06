// The real device id (physical ESP32) is never shown in the assignment UI.
// We encode a positional collar number N inside a globally-unique deviceId so
// the UI can render a friendly "Collar N" label without exposing the raw id.
// Format: collar-{N}-{random}. The random suffix guarantees global uniqueness
// (the backend enforces a UNIQUE constraint on device_id across all users).

const DEVICE_ID_RE = /^collar-(\d+)-/;

/** Builds a hidden, globally-unique deviceId that carries the collar number. */
export function makeCollarDeviceId(n: number): string {
    const rand = crypto.randomUUID().slice(0, 8);
    return `collar-${n}-${rand}`;
}

/** Extracts the positional collar number from a deviceId, or null if it does
 *  not follow our convention (e.g. legacy raw ESP32 ids). */
export function parseCollarNumber(deviceId: string): number | null {
    const match = DEVICE_ID_RE.exec(deviceId);
    return match ? Number(match[1]) : null;
}

/** Friendly label shown in place of the real device id. */
export function collarLabel(deviceId: string): string {
    const n = parseCollarNumber(deviceId);
    return n !== null ? `Collar ${n}` : "Collar";
}
