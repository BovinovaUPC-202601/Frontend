import { useEffect } from "react";
import { AnimalCard } from "./AnimalCard";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useAnimalStore } from "../stores/animals-store";

export function AnimalList() {
    const { searchQuery, filteredAnimals, isFiltered, filterAnimals, stableFilter } = useAnimalStore();
    const { animals, stables, fetchAnimals, fetchStables } = useGlobalStore();

    useEffect(() => {
        fetchAnimals();
        fetchStables();
    }, []);

    useEffect(() => {
        if (isFiltered) {
            filterAnimals(animals);
        }
    }, [animals, isFiltered, filterAnimals]);

    let listToShow = animals;
    let showMessage = "";

    if (animals.length === 0) {
        showMessage = "No tienes animales registrados.";
    }
    else if (isFiltered) {
        if (filteredAnimals.length == 0) {
            if (stableFilter != null) {
                const stableName = stables.find(s => s.id === stableFilter)?.name ?? "";
                showMessage = `No hay animales en "${stableName}"`;
            } else {
                showMessage = `No se encontraron animales para "${searchQuery}"`;
            }
        } else {
            listToShow = filteredAnimals;
        }
    }

    return (
        <>
            {showMessage ? (
                <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-10">
                    <p className="text-[#4F6354] text-base font-inter italic text-center">{showMessage}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listToShow.map((animal) => <AnimalCard key={animal.id} animal={animal} />)}
                </div>
            )}
        </>
    );
}
