import http from "../../shared/services/http";
import type { Staff, StaffAccessLevel, StaffStatus } from "../model/staff";

export interface UserSearchResult {
    id: number;
    username: string;
    email: string;
}

export interface CreateStaffWithNewUserPayload {
    name: string;
    email: string;
    password: string;
    accessLevel: StaffAccessLevel;
}

export interface GrantAccessToExistingUserPayload {
    email: string;
    accessLevel: StaffAccessLevel;
}

export interface UpdateStaffAccessPayload {
    employeeStatus: StaffStatus;
    accessLevel: StaffAccessLevel;
}

export class StaffService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + '/staff';

    async getStaff() {
        return await http.get<Staff[]>(this.endpoint);
    }

    async searchUserByEmail(email: string) {
        return await http.get<UserSearchResult>(
            `${this.endpoint}/users/search?email=${encodeURIComponent(email)}`);
    }

    async createStaffWithNewUser(payload: CreateStaffWithNewUserPayload) {
        return await http.post(`${this.endpoint}/access/create-user`, payload);
    }

    async grantAccessToExistingUser(payload: GrantAccessToExistingUserPayload) {
        return await http.post(`${this.endpoint}/access/existing-user`, payload);
    }

    async updateStaffAccess(staffId: number, payload: UpdateStaffAccessPayload) {
        return await http.put(`${this.endpoint}/${staffId}/access`, payload);
    }

    async deleteStaff(staff: Staff) {
        return await http.delete(`${this.endpoint}/${staff.id}`);
    }
}

export const staffService = new StaffService();
