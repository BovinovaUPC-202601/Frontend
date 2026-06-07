import { useEffect } from "react";
import { AddAnimalDialog } from "../components/AddAnimalDialog";
import { AnimalList } from "../components/AnimalList";
import { SearchBar } from "../components/SearchBar";
import { useAnimalStore } from "../stores/animals-store";
import { useGlobalStore } from "../../shared/stores/global-store";
import PetsIcon from '@mui/icons-material/Pets';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useSearchParams } from "react-router";

export function AnimalsPage() {
    const { setSearchQuery, setStableFilter, stableFilter, filterAnimals } = useAnimalStore();
    const { stables, animals } = useGlobalStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const stableIdParam = searchParams.get("stableId");
        if (stableIdParam) {
            const id = Number(stableIdParam);
            setStableFilter(id);
            setSearchQuery("");
        } else {
            setStableFilter(null);
            setSearchQuery("");
        }
    }, [searchParams]);

    useEffect(() => {
        filterAnimals(animals);
    }, [animals, stableFilter]);

    const filteredStable = stableFilter != null
        ? stables.find(s => s.id === stableFilter)
        : null;

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full px-6 py-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8F0DA] flex items-center justify-center text-[#10A065]">
                    <PetsIcon className="w-5 h-5" />
                </div>
                <h1 className="text-[24px] leading-[32px] text-[#0E1A12] font-semibold font-inter">
                    Ganado
                </h1>
            </div>

            {filteredStable && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#C8F0DA]/60 border border-[#C8F0DA] text-sm font-inter text-[#0E1A12]">
                    <span>Mostrando animales de <strong>{filteredStable.name}</strong></span>
                    <button
                        className="ml-1 p-0.5 rounded-full hover:bg-[#10A065]/20 transition-all"
                        onClick={() => navigate("/animals")}
                    >
                        <CloseIcon className="w-4 h-4 text-[#4F6354]" />
                    </button>
                </div>
            )}

            <SearchBar />
            <AnimalList />
            <AddAnimalDialog />
        </div>
    )
}
