import {Plus as AddIcon} from "lucide-react";
import { useGlobalStore } from '../../shared/stores/global-store';
import { useAuthStore } from '../../auth/store/auth-store';
import { canEdit } from '../../shared/utils/access-control';
import { useInventoryStore } from '../stores/inventory-store';

export function SearchBar() {
    const { toggleModalCategory, toggleModalProduct, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, filterProducts } = useInventoryStore();
    const { products, categories } = useGlobalStore();
    const editable = useAuthStore((s) => canEdit(s.user));

    return (
        <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center flex-1 gap-3">
                    <input
                        className="focus:outline-none bg-white px-4 py-2.5 rounded-[12px] border border-[#E1E7DF] flex-1 font-inter text-sm text-[#0E1A12] placeholder-[#7E8F82] transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                        type="text"
                        placeholder="Buscar producto por nombre"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); filterProducts(products); }}
                    />
                    <select
                        value={categoryFilter ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setCategoryFilter(value === "" ? undefined : Number(value));
                            filterProducts(products);
                        }}
                        className={`focus:outline-none bg-white px-3 py-2.5 rounded-[12px] border border-[#E1E7DF] font-inter text-sm transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA] ${categoryFilter === undefined ? "text-[#7E8F82]" : "text-[#0E1A12]"}`}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id} className="text-[#0E1A12]">
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {editable && (
                    <div className="flex gap-3 items-center">
                        <button
                            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-white text-[#4F6354] font-inter font-medium text-sm rounded-[12px] border border-[#E1E7DF] h-12 transition-all duration-150 hover:bg-[#F4F8F2] active:scale-[0.97]"
                            onClick={toggleModalCategory}
                        >
                            <AddIcon className="w-4 h-4" />
                            Categoría
                        </button>
                        <button
                            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#10A065] to-[#0A7E4D] text-white font-inter font-medium text-sm rounded-[14px] h-12 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                            onClick={toggleModalProduct}
                        >
                            <AddIcon className="w-5 h-5" />
                            Producto
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
