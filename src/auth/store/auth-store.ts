import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { User } from "../model/user";
import { authService } from "../services/auth-service";
import { useGlobalStore } from "../../shared/stores/global-store";

interface AuthState {
    user: User;
    error: string | null;
    isLoading: boolean;
    setUser: (user: Partial<User>) => void;
    setError: (error: string | null) => void;
    logout: () => void;
    login: () => Promise<boolean>;
    register: (confirmPassword: string) => Promise<boolean>;
}

export const useAuthStore = create(immer<AuthState>((set, get) => ({
    user: new User(),
    error: null,
    isLoading: false,
    setUser: (user: Partial<User>) => set(state => { state.user = { ...state.user, ...user }; }),
    setError: (error: string | null) => set(state => { state.error = error; }),
    logout: () => {
        localStorage.removeItem("token");
        set(state => {
            state.user = new User();
            state.error = null;
            state.isLoading = false;
        });
    },
    login: async () => {
        set(state => { state.isLoading = true; });
        try {
            const { user } = get();
            const res = await authService.login(user);
            if (res.data.token) localStorage.setItem("token", res.data.token);
            await useGlobalStore.getState().loadAppData();
            return true;
        } catch (error: any) {
            console.error("Login failed:", error);
            set(state => { state.error = `Error al iniciar sesión: ${error.message}`; });
            return false;
        } finally {
            set(state => { state.isLoading = false; });
        }
    },
    register: async (confirmPassword) => {
        const { user } = get();
        if (user.password !== confirmPassword) {
            set(state => { state.error = "Las contraseñas no coinciden"; });
            return false;
        }
        set(state => { state.isLoading = true; });
        try {
            const res = await authService.register(user);
            if (res.data.token) localStorage.setItem("token", res.data.token);
            await useGlobalStore.getState().loadAppData();
            return true;
        } catch (error: any) {
            console.error("Registration failed:", error);
            set(state => { state.error = `Error al registrar el usuario: ${error.message}`; });
            return false;
        } finally {
            set(state => { state.isLoading = false; });
        }
    }
})));
