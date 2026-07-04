import http from "../../shared/services/http";
import type { User } from "../model/user";

export class AuthService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + '/user';

    async register(user: User) {
        return await http.post(this.endpoint + "/sign-up", user);
    }

    async login(user: User) {
        return await http.post(this.endpoint + "/sign-in", user);
    }

    // Profile includes the real permissions (isStaff, accessLevel, canEdit, ...)
    // resolved by the backend from the database — never trust the token alone.
    async getProfile() {
        return await http.get(this.endpoint + "/profile");
    }

    // RF-03 step 1: request a 6-digit recovery code by email. The backend always
    // responds 200 (even for unknown emails) so it never reveals who is registered.
    async forgotPassword(email: string) {
        return await http.post(this.endpoint + "/forgot-password", { email });
    }

    // RF-03 step 2: submit the emailed code and the new password.
    async resetPassword(payload: { email: string; code: string; newPassword: string }) {
        return await http.post(this.endpoint + "/reset-password", payload);
    }
}

export const authService = new AuthService();
