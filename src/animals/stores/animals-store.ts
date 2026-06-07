import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Animal } from "../model/animal";

interface AnimalState {
    // Filtering
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterAnimals: (animals: Animal[]) => void;
    filteredAnimals: Animal[];
    isFiltered: boolean;
    stableFilter: number | null;
    setStableFilter: (id: number | null) => void;

    // Modal & New Animal
    isOpenModal: boolean;
    toggleModal: () => void;
    newAnimal: Animal;
    setNewAnimal: (animal: Partial<Animal>) => void;
    resetNewAnimal: () => void;
}

export const useAnimalStore = create(immer<AnimalState>((set, get) => ({
    // Filtering
    searchQuery: "",
    setSearchQuery: (query) => set(state => {
        state.searchQuery = query;
    }),
    filterAnimals: (animals) => set(state => {
        const { searchQuery, stableFilter } = get();
        let filtered = animals;
        if (searchQuery.trim()) {
            filtered = filtered.filter(a =>
                a.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (stableFilter != null) {
            filtered = filtered.filter(a => a.stableId === stableFilter);
        }
        state.filteredAnimals = filtered;
        state.isFiltered = searchQuery.trim() !== "" || stableFilter != null;
    }),
    filteredAnimals: [],
    isFiltered: false,
    stableFilter: null,
    setStableFilter: (id) => set(state => {
        state.stableFilter = id;
    }),

    // Modal & New Animal
    isOpenModal: false,
    toggleModal: () => set(state => { state.isOpenModal = !state.isOpenModal }),
    newAnimal: new Animal(),
    setNewAnimal: (animal) => set(state => { state.newAnimal = { ...state.newAnimal, ...animal } }),
    resetNewAnimal: () => set(state => { state.newAnimal = new Animal() }),
})));