import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { collarService } from "../services/collar-service";
import type { Collar, CollarCapacity } from "../model/collar";
import { parseCollarNumber } from "../lib/collar-id";

interface CollarState {
    collars: Collar[];
    capacity: CollarCapacity;
    loading: boolean;
    error: string | null;

    // deviceId of the collar just registered, so the UI can show it for the
    // rancher to flash into the ESP32. Cleared once shown/dismissed.
    justRegisteredDeviceId: string | null;

    fetchCollars: () => Promise<void>;
    register: (deviceId: string, bovineId: number) => Promise<boolean>;
    reassign: (collarId: number, bovineId: number) => Promise<boolean>;
    remove: (collarId: number) => Promise<boolean>;
    clearJustRegistered: () => void;
    collarForBovine: (bovineId: number) => Collar | undefined;
    // Free collar numbers (1..allowance) not currently taken by an active collar.
    availableNumbers: () => number[];
}

const extractError = (err: any) =>
    err?.response?.data ?? err?.message ?? "Error inesperado";

export const useCollarStore = create(
    immer<CollarState>((set, get) => ({
        collars: [],
        capacity: { active: 0, allowance: 0, available: 0 },
        loading: false,
        error: null,
        justRegisteredDeviceId: null,

        fetchCollars: async () => {
            set(state => { state.loading = true; });
            try {
                const [collarsRes, capacityRes] = await Promise.all([
                    collarService.getMyCollars(),
                    collarService.getCapacity(),
                ]);
                set(state => {
                    state.collars = collarsRes.data;
                    state.capacity = capacityRes.data;
                    state.loading = false;
                    state.error = null;
                });
            } catch {
                // Free users get 403 here; just leave the lists empty.
                set(state => {
                    state.collars = [];
                    state.capacity = { active: 0, allowance: 0, available: 0 };
                    state.loading = false;
                });
            }
        },

        register: async (deviceId: string, bovineId: number) => {
            set(state => { state.loading = true; state.error = null; });
            try {
                const res = await collarService.register(deviceId, bovineId);
                await get().fetchCollars();
                set(state => { state.justRegisteredDeviceId = res.data.deviceId; });
                return true;
            } catch (err: any) {
                set(state => { state.loading = false; state.error = extractError(err); });
                return false;
            }
        },

        reassign: async (collarId: number, bovineId: number) => {
            set(state => { state.loading = true; state.error = null; });
            try {
                await collarService.reassign(collarId, bovineId);
                await get().fetchCollars();
                return true;
            } catch (err: any) {
                set(state => { state.loading = false; state.error = extractError(err); });
                return false;
            }
        },

        remove: async (collarId: number) => {
            set(state => { state.loading = true; state.error = null; });
            try {
                await collarService.remove(collarId);
                await get().fetchCollars();
                return true;
            } catch (err: any) {
                set(state => { state.loading = false; state.error = extractError(err); });
                return false;
            }
        },

        clearJustRegistered: () =>
            set(state => { state.justRegisteredDeviceId = null; }),

        collarForBovine: (bovineId: number) =>
            get().collars.find(c => c.bovineId === bovineId),

        availableNumbers: () => {
            const { collars, capacity } = get();
            // Exclude numbers already taken by app-created collars (collar-N-rand).
            const taken = new Set(
                collars
                    .map(c => parseCollarNumber(c.deviceId))
                    .filter((n): n is number => n !== null),
            );
            const numbers: number[] = [];
            for (let n = 1; n <= capacity.allowance; n++) {
                if (!taken.has(n)) numbers.push(n);
            }
            // Cap by the real free slots from the backend, so collars that don't
            // follow the collar-N convention (legacy/raw ids) still consume a slot
            // and the picker never offers more than the actual capacity.
            return numbers.slice(0, Math.max(0, capacity.available));
        },
    }))
);
