import { useEffect } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { ProductCard } from "./ProductCard";
import { useInventoryStore } from "../stores/inventory-store";
import {Package as InventoryIcon} from "lucide-react";

export function ProductList() {
    const { searchQuery, filteredProducts, isFiltered, categoryFilter, filterProducts } = useInventoryStore();
    const { products, categories } = useGlobalStore();

    useEffect(() => {
        if (isFiltered) {
            filterProducts(products);
        }
    }, [products, isFiltered, filterProducts]);

    let listToShow = products;
    let showMessage = "";

    if (products.length === 0) {
        showMessage = "No tienes productos registrados.";
    }
    else if (isFiltered) {
        if (filteredProducts.length === 0) {
            if (searchQuery.trim() !== "") {
                showMessage = `No se encontró producto para "${searchQuery}".`;
            } else if (categoryFilter !== undefined) {
                const categoryName = categories.find(c => c.id === categoryFilter)?.name || "desconocida";
                showMessage = `No se encontraron productos para la categoría "${categoryName}".`;
            }
        } else {
            listToShow = filteredProducts;
        }
    }

    return (
        <>
            {showMessage ? (
                <div className="rounded-[16px] bg-white shadow-md border border-[#E1E7DF] p-12 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#F4F8F2] flex items-center justify-center text-[#7E8F82]">
                        <InventoryIcon className="w-7 h-7" />
                    </div>
                    <p className="text-[#0E1A12] text-base font-inter font-medium">{showMessage}</p>
                    <p className="text-[#7E8F82] text-sm font-inter">
                        {products.length === 0
                            ? "Agrega un producto para comenzar"
                            : "Intenta con otros términos de búsqueda"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listToShow.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            )}
        </>
    );
}
