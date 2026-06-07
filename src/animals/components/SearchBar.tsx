import {Plus as AddIcon} from "lucide-react";
import { useGlobalStore } from '../../shared/stores/global-store';
import { useAnimalStore } from '../stores/animals-store';

export function SearchBar() {
    const { toggleModal, searchQuery, setSearchQuery, filterAnimals } = useAnimalStore();
    const { animals } = useGlobalStore();

    return (
        <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center flex-1">
                    <input
                        className="focus:outline-none bg-white px-4 py-2.5 rounded-[12px] border border-[#E1E7DF] flex-1 font-inter text-sm text-[#0E1A12] placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                        type="text"
                        placeholder="Buscar animal por nombre"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            filterAnimals(animals);
                        }}
                    />
                </div>

                <button
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#10A065] to-[#0A7E4D] text-white font-inter font-medium text-sm rounded-[14px] h-12 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                    onClick={toggleModal}
                >
                    <AddIcon className="w-5 h-5" />
                    Añadir animal
                </button>
            </div>
        </div>
    )
}
