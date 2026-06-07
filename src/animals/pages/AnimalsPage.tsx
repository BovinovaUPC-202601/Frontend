import { useEffect } from "react";
import { AddAnimalDialog } from "../components/AddAnimalDialog";
import { AnimalList } from "../components/AnimalList";
import { SearchBar } from "../components/SearchBar";
import { useAnimalStore } from "../stores/animals-store";
import PetsIcon from '@mui/icons-material/Pets';

export function AnimalsPage() {
    const { setSearchQuery } = useAnimalStore();

    useEffect(() => {
        setSearchQuery("");
    }, []);

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
            <SearchBar />
            <AnimalList />
            <AddAnimalDialog />
        </div>
    )
}
