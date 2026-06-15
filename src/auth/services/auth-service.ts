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
}

export const authService = new AuthService();
