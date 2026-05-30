import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { useAuthStore } from "../store/auth-store";

export function AuthForm() {
    const options = ["Iniciar sesión", "Registrarse"];
    const { setUser, setError } = useAuthStore();
    const [selectedOption, setSelectedOption] = useState(options[0]);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center gap-10">
            <h1 className="font-rokkitt text-6xl text-brand-dark">VacApp</h1>
            <form className="flex flex-col items-center gap-8 h-120 ">
                <div className="p-1 rounded-md bg-neutral-100 flex justify-center">
                    <ToggleButtonGroup
                        value={selectedOption}
                        exclusive
                        onChange={(_, newValue) => {
                            if (newValue !== null) setSelectedOption(newValue);
                            setUser({})
                            setError(null);
                        }}
                    >
                        {
                            options.map((option) => (
                                <ToggleButton
                                    key={option}
                                    value={option}
                                    aria-label={option}
                                    sx={{ textTransform: "none", }}
                                    className={`font-mulish text-sm rounded-sm border-0 px-15 py-2 ${selectedOption === option ? 'bg-white' : ''}`}
                                >
                                    {option}
                                </ToggleButton>
                            ))
                        }
                    </ToggleButtonGroup>
                </div>
                {
                    selectedOption === options[0] ?
                        <LoginForm /> :
                        <RegisterForm />
                }
            </form>
        </div>
    )
}