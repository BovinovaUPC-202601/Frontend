import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { BovineBreed } from "../model/bovine-breed";

interface BreedState {
    isOpenModal: boolean;
    toggleModal: () => void;
    editingBreed: BovineBreed | null;
    setEditingBreed: (breed: BovineBreed | null) => void;
}

export const useBreedStore = create(immer<BreedState>((set) => ({
    isOpenModal: false,
    toggleModal: () => set(state => {
        state.isOpenModal = !state.isOpenModal;
        if (!state.isOpenModal) state.editingBreed = null;
    }),
    editingBreed: null,
    setEditingBreed: (breed) => set(state => {
        state.editingBreed = breed;
    }),
})));
