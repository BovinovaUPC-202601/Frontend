export class Staff {
    id?: number;
    name?: string;
    email?: string;
    status?: StaffStatus;
    accessLevel?: StaffAccessLevel;
    userId?: number;
    linkedUserId?: number | null;

    constructor(data: Partial<Staff> = {}) {
        if (data)
            Object.assign(this, data);
    }
}

export enum StaffStatus {
    Activo = 1,
    Inactivo
}

export enum StaffAccessLevel {
    ReadOnly = 1,
    Editor = 2,
    Manager = 3
}

export const accessLevelLabels: Record<StaffAccessLevel, string> = {
    [StaffAccessLevel.ReadOnly]: "Solo lectura",
    [StaffAccessLevel.Editor]: "Editor",
    [StaffAccessLevel.Manager]: "Administrador de rancho",
};
