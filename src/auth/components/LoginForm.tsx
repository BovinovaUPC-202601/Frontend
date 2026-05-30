import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth-store";

export function LoginForm() {
    const navigate = useNavigate();
    const { user, login, setUser, error, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ [name]: value });
    };

    return (
        <div className="w-full font-mulish text-neutral-700 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@mail.com"
                    className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm"
                    value={user.email}
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-col gap-2 relative justify-center">
                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="focus:outline-none border-1 border-neutral-300 px-3 py-2 rounded-sm pr-10"
                    value={user.password}
                    onChange={handleChange}
                />
                <button
                    type="button"
                    className="absolute right-3 top-10 text-neutral-500"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
            </div>

            {error && <span className="text-red-500 text-sm">{error}</span>}

            <button
                type="button"
                disabled={isSubmitting || isLoading}
                className="cursor-pointer rounded-sm flex items-center justify-center gap-2 px-2 py-1 bg-brand-default text-white disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
                onClick={async () => {
                    setIsSubmitting(true);
                    try {
                        const success = await login();
                        if (success) {
                            navigate("/dashboard", { replace: true });
                        }
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
                aria-busy={isSubmitting || isLoading}
            >
                <span className="font-mulish text-lg">
                    {isSubmitting || isLoading ? <CircularProgress size={16} color="inherit" /> : "Iniciar sesión"}
                </span>
            </button>
        </div>
    )
}