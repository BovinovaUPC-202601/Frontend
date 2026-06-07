import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth-store";

export function RegisterForm() {
    const navigate = useNavigate();
    const { user, setUser, register, error, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ [name]: value });
    };

    return (
        <div className="w-full font-inter text-[#0E1A12] flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="username" className="text-sm font-medium text-[#4F6354]">Nombre</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-[#7E8F82] rounded-[12px] text-sm outline-none transition-[border-color] duration-200 focus:border-[#10A065] placeholder:text-[#9CA3AF]"
                    value={user.username}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#4F6354]">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@mail.com"
                    className="w-full px-4 py-3 border border-[#7E8F82] rounded-[12px] text-sm outline-none transition-[border-color] duration-200 focus:border-[#10A065] placeholder:text-[#9CA3AF]"
                    value={user.email}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="password" className="text-sm font-medium text-[#4F6354]">Contraseña</label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full px-4 py-3 border border-[#7E8F82] rounded-[12px] text-sm outline-none transition-[border-color] duration-200 focus:border-[#10A065] placeholder:text-[#9CA3AF] pr-12"
                        value={user.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E8F82] hover:text-[#4F6354]"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#4F6354]">Confirmar contraseña</label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full px-4 py-3 border border-[#7E8F82] rounded-[12px] text-sm outline-none transition-[border-color] duration-200 focus:border-[#10A065] placeholder:text-[#9CA3AF] pr-12"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E8F82] hover:text-[#4F6354]"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </button>
                </div>
            </div>

            {error && <p className="text-[#D04A3A] text-xs font-inter">{error}</p>}

            <button
                type="button"
                disabled={isSubmitting || isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#10A065] to-[#0A7E4D] text-white font-inter text-sm font-semibold rounded-[14px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-[0.97] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                onClick={async () => {
                    setIsSubmitting(true);
                    try {
                        const success = await register(confirmPassword);
                        if (success) {
                            navigate("/dashboard", { replace: true });
                        }
                    } finally {
                        setIsSubmitting(false);
                    }
                }}
                aria-busy={isSubmitting || isLoading}
            >
                {isSubmitting || isLoading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                    "Registrarse"
                )}
            </button>
        </div>
    );
}
