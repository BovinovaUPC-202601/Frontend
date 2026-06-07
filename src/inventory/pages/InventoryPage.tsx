import { useEffect, useState } from "react";
import { AddCategoryDialog } from "../components/AddCategoryDialog";
import { AddProductDialog } from "../components/AddProductDialog";
import { CategoryList } from "../components/CategoryList";
import { ProductList } from "../components/ProductList";
import { SearchBar } from "../components/SearchBar";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useInventoryStore } from "../stores/inventory-store";
import {Package as InventoryIcon} from "lucide-react";
import {Boxes as Inventory2Icon} from "lucide-react";

export function InventoryPage() {
    const { setSearchQuery } = useInventoryStore();
    const { fetchCategories, fetchProducts } = useGlobalStore();
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        setSearchQuery("");
        fetchCategories();
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full px-6 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E1E7DF] flex items-center justify-center text-[#4F6354]">
                        <InventoryIcon className="w-5 h-5" />
                    </div>
                    <h1 className="text-[24px] leading-[32px] text-[#0E1A12] font-semibold font-inter">
                        Inventario
                    </h1>
                </div>

                <div className="flex items-center bg-[#F4F8F2] rounded-[12px] p-1 border border-[#E1E7DF]">
                    <button
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-sm font-medium font-inter transition-all duration-150 ${tabIndex === 0 ? "bg-white shadow-sm text-[#0E1A12]" : "text-[#7E8F82] hover:text-[#0E1A12]"}`}
                        onClick={() => setTabIndex(0)}
                    >
                        <InventoryIcon className="w-4 h-4" />
                        Productos
                    </button>
                    <button
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-sm font-medium font-inter transition-all duration-150 ${tabIndex === 1 ? "bg-white shadow-sm text-[#0E1A12]" : "text-[#7E8F82] hover:text-[#0E1A12]"}`}
                        onClick={() => setTabIndex(1)}
                    >
                        <Inventory2Icon className="w-4 h-4" />
                        Categorías
                    </button>
                </div>
            </div>

            {tabIndex === 0 ? (
                <div className="flex flex-col gap-6">
                    <SearchBar />
                    <ProductList />
                </div>
            ) : (
                <CategoryList />
            )}

            <AddCategoryDialog />
            <AddProductDialog />
        </div>
    )
}
