import { useEffect } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useStaffStore } from "../stores/staff-store";
import { StaffCard } from "./StaffCard";
import {Users as PeopleAltIcon} from "lucide-react";

export function StaffList() {
    const { searchQuery, filteredStaff, isFiltered, statusFilter, filterStaff } = useStaffStore();
    const { staff, fetchStaff } = useGlobalStore();

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        if (isFiltered) {
            filterStaff(staff);
        }
    }, [staff, isFiltered, filterStaff]);

    let listToShow = staff;
    let showMessage = "";

    if (staff.length === 0) {
        showMessage = "No tienes personal registrado.";
    }
    else if (isFiltered) {
        if (filteredStaff.length === 0) {
            if (searchQuery.trim() !== "") {
                showMessage = `No se encontró personal para "${searchQuery}".`;
            } else {
                showMessage = `No se encontró personal ${statusFilter === 1 ? "activo" : "inactivo"}.`;
            }
        } else {
            listToShow = filteredStaff;
        }
    }

    return (
        <>
            {showMessage ? (
                <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-12 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#F4F8F2] flex items-center justify-center text-[#7E8F82]">
                        <PeopleAltIcon className="w-7 h-7" />
                    </div>
                    <p className="text-[#0E1A12] text-base font-inter font-medium">{showMessage}</p>
                    <p className="text-[#7E8F82] text-sm font-inter">
                        {staff.length === 0
                            ? "Agrega un empleado para comenzar"
                            : "Intenta con otros términos de búsqueda"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listToShow.map((s) => <StaffCard key={s.id} staff={s} />)}
                </div>
            )}
        </>
    );
}
