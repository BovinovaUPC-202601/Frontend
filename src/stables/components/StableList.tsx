import { useEffect } from "react";
import { useStableStore } from "../stores/stable-store";
import { StableCard } from "./StableCard";
import { useGlobalStore } from "../../shared/stores/global-store";

export function StableList() {
    const { searchQuery, filteredStables, isFiltered, filterStables } = useStableStore();
    const { stables, fetchStables } = useGlobalStore();

    useEffect(() => {
        fetchStables();
    }, []);

    useEffect(() => {
        if (isFiltered) {
            filterStables(stables);
        }
    }, [stables, isFiltered, filterStables]);

    let listToShow = stables;
    let showMessage = "";

    if (stables.length === 0) {
        showMessage = "No tienes establos creados.";
    }
    else if (isFiltered && filteredStables.length === 0) {
        showMessage = `No se encontraron establos para "${searchQuery}"`;
    }
    else if (isFiltered) {
        listToShow = filteredStables;
    }

    return (
        <>
            {showMessage ? (
                <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-10">
                    <p className="text-[#4F6354] text-base font-inter italic text-center">{showMessage}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listToShow.map((stable) => <StableCard key={stable.id} stable={stable} />)}
                </div>
            )}
        </>
    );
}
