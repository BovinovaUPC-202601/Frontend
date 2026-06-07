import {Plus as AddIcon} from "lucide-react";
import { useGlobalStore } from '../../shared/stores/global-store';
import { useInventoryStore } from '../stores/inventory-store';
import { CategoryCard } from './CategoryCard';
import {Boxes as Inventory2Icon} from "lucide-react";

export function CategoryList() {
    const { categories, products } = useGlobalStore();
    const { toggleModalCategory } = useInventoryStore();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0E1A12] font-inter">Categorías</h2>
                <button
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#10A065] to-[#0A7E4D] text-white font-inter font-medium text-sm rounded-[14px] transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                    onClick={toggleModalCategory}
                >
                    <AddIcon className="w-5 h-5" />
                    Añadir categoría
                </button>
            </div>

            {categories.length === 0 ? (
                <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-12 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#F4F8F2] flex items-center justify-center text-[#7E8F82]">
                        <Inventory2Icon className="w-7 h-7" />
                    </div>
                    <p className="text-[#0E1A12] text-base font-inter font-medium">No tienes categorías registradas.</p>
                    <p className="text-[#7E8F82] text-sm font-inter">Agrega una categoría para comenzar</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            productCount={products.filter((product) => product.categoryId === category.id).length}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
