import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { useAuthStore } from "../store/auth-store";

export function AuthForm() {
  const options = ["Iniciar sesión", "Registrarse"];
  const { setUser, setError } = useAuthStore();
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#B8E4CB] via-[#DCF1DE] to-[#F4F8F2] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#D8E8DD]/40 blur-[80px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[#D8E8DD]/30 blur-[80px]" />
      <div className="absolute top-[40%] right-[15%] w-[250px] h-[250px] rounded-full bg-[#D8E8DD]/20 blur-[60px]" />

      <div className="relative w-full max-w-[480px] bg-white rounded-[20px] shadow-xl px-[22px] py-[26px] mx-4 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="font-inter text-[28px] font-bold text-[#0A7E4D] -tracking-[0.3px]">
            VacApp
          </h1>
          <div className="w-12 h-[3px] bg-gradient-to-r from-[#10A065] to-[#0A7E4D] rounded-full mx-auto mt-4" />
        </div>

        <div className="flex bg-[#E1E7DF] rounded-[12px] p-1 mb-6 shadow-sm">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`flex-1 py-2 rounded-[10px] text-sm font-semibold font-inter transition-all duration-200 ${
                selectedOption === option
                  ? "bg-white text-[#0E1A12] shadow-sm"
                  : "text-[#4F6354] hover:text-[#0E1A12]"
              }`}
              onClick={() => {
                setSelectedOption(option);
                setUser({});
                setError(null);
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedOption === options[0] ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
