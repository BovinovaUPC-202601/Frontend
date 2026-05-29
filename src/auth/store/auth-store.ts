import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { User } from "../model/user";
import { authService } from "../services/auth-service";

interface AuthState {
    user: User;
    error: string | null;
    setUser: (user: Partial<User>) => void;
    setError: (error: string | null) => void;
    logout: () => void;
    login: (onSuccess: () => void) => Promise<void>;
    register: (confirmPassword: string, onSuccess: () => void) => Promise<void>;
}

export const useAuthStore = create(immer<AuthState>((set, get) => ({
    user: new User(),
    error: null,
    setUser: (user: Partial<User>) => set(state => { state.user = { ...state.user, ...user }; }),
    setError: (error: string | null) => set(state => { state.error = error; }),
    logout: () => {
        localStorage.removeItem("token");
        set(state => {
            state.user = new User();
            state.error = null;
        });
    },
    login: async (onSuccess) => {
        try {
            const { user } = get();
            const res = await authService.login(user);
            if (res.data.token) localStorage.setItem("token", res.data.token);
            onSuccess();
        } catch (error: any) {
            console.error("Login failed:", error);
            set(state => { state.error = `Error al iniciar sesión: ${error.message}`; });
        }
    },
    register: async (confirmPassword, onSuccess) => {
        const { user } = get();
        if (user.password !== confirmPassword) {
            set(state => { state.error = "Las contraseñas no coinciden"; });
            return;
        }
        try {
            const res = await authService.register(user);
            if (res.data.token) localStorage.setItem("token", res.data.token);
            onSuccess();
        } catch (error: any) {
            console.error("Registration failed:", error);
            set(state => { state.error = `Error al registrar el usuario: ${error.message}`; });
        }
    }
})));
