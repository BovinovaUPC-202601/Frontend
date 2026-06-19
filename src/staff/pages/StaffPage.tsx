import { useEffect } from "react";
import { AddStaffDialog } from "../components/AddStaffDialog";
import { SearchBar } from "../components/SearchBar";
import { StaffList } from "../components/StaffList";
import { useStaffStore } from "../stores/staff-store";
import { useAuthStore } from "../../auth/store/auth-store";
import { canManageStaff } from "../../shared/utils/access-control";
import { Users as PeopleAltIcon } from "lucide-react";
import { ShieldX as ShieldOffIcon } from "lucide-react";

export function StaffPage() {
    const { setSearchQuery } = useStaffStore();
    const user = useAuthStore(state => state.user);
    const permissionsLoaded = useAuthStore(state => state.permissionsLoaded);

    useEffect(() => {
        setSearchQuery("");
    }, []);

    // Wait for the backend permissions before deciding, so a manager refreshing
    // the page is not bounced out before their access level is known.
    if (!permissionsLoaded) return null;

    if (!canManageStaff(user)) {
        return (
            <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full px-6 py-6">
                <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-12 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#FFD9D2] flex items-center justify-center text-[#D04A3A]">
                        <ShieldOffIcon className="w-7 h-7" />
                    </div>
                    <p className="text-[#0E1A12] text-base font-inter font-medium">Acceso denegado</p>
                    <p className="text-[#7E8F82] text-sm font-inter">
                        Solo el dueño del rancho o un administrador pueden gestionar el personal.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full px-6 py-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#CFE6F2] flex items-center justify-center text-[#3A82B0]">
                    <PeopleAltIcon className="w-5 h-5" />
                </div>
                <h1 className="text-[24px] leading-[32px] text-[#0E1A12] font-semibold font-inter">
                    Personal
                </h1>
            </div>

            <SearchBar />
            <StaffList />
            <AddStaffDialog />
        </div>
    )
}
