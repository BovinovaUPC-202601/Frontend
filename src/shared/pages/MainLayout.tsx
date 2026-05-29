import { Outlet, NavLink } from "react-router";
import { useNavigate } from "react-router";
import AppBar from '@mui/material/AppBar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import CabinIcon from '@mui/icons-material/Cabin';
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { useAuthStore } from "../../auth/store/auth-store";

export function MainLayout() {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `cursor-pointer rounded-sm flex items-center gap-2 px-2 py-1 
         ${isActive ? "bg-brand-default text-white" : "hover:bg-neutral-400 text-neutral-600 hover:text-white"}`;

    const handleLogout = () => {
        logout();
        navigate("/auth", { replace: true });
    };

    return (
        <div className="flex flex-col h-screen gap-10">
            <AppBar className="bg-neutral-100 border-b-1 border-neutral-300 shadow-none" position="static">
                <div className="flex mx-5 py-2 gap-5 font-mulish text-sm items-center flex-wrap">
                    <h1 className="font-rokkitt text-3xl text-neutral-700 font-semibold select-none">VacApp</h1>

                    <NavLink to="/dashboard" className={linkClass}>
                        <DashboardIcon className="w-5 h-auto" />
                        <span>Panel de control</span>
                    </NavLink>

                    <NavLink to="/animals" className={linkClass}>
                        <PetsIcon className="w-5 h-auto" />
                        <span>Ganado</span>
                    </NavLink>

                    <NavLink to="/stables" className={linkClass}>
                        <CabinIcon className="w-5 h-auto" />
                        <span>Establos</span>
                    </NavLink>

                    <NavLink to="/campaigns" className={linkClass}>
                        <CampaignIcon className="w-5 h-auto" />
                        <span>Campañas</span>
                    </NavLink>

                    <NavLink to="/staff" className={linkClass}>
                        <PeopleAltIcon className="w-5 h-auto" />
                        <span>Personal</span>
                    </NavLink>

                    <NavLink to="/inventory" className={linkClass}>
                        <InventoryIcon className="w-5 h-auto" />
                        <span>Inventario</span>
                    </NavLink>

                    <NavLink to="/ai-assistant" className={linkClass}>
                        <AutoAwesomeIcon className="w-5 h-auto" />
                        <span>Asistente IA</span>
                    </NavLink>

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        className="ml-auto !border-neutral-400 !text-neutral-700 hover:!border-brand-default hover:!text-brand-default"
                        sx={{ textTransform: "none" }}
                    >
                        Cerrar sesión
                    </Button>
                </div>
            </AppBar >
            <Outlet />
        </div>
    )
}
