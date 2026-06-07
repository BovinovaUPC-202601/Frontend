import { useEffect } from "react";
import { AddStaffDialog } from "../components/AddStaffDialog";
import { SearchBar } from "../components/SearchBar";
import { StaffList } from "../components/StaffList";
import { useStaffStore } from "../stores/staff-store";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export function StaffPage() {
    const { setSearchQuery } = useStaffStore();

    useEffect(() => {
        setSearchQuery("");
    }, []);

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
