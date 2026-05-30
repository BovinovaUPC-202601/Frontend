import { useEffect } from "react";
import { useGlobalStore } from "../../shared/stores/global-store";
import { ProductCard } from "./ProductCard";
import { useInventoryStore } from "../stores/inventory-store";

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
        <div className="flex flex-wrap gap-15">
            {
                showMessage ? (
                    <div className="text-neutral-500 text-center w-full py-10">{showMessage}</div>
                ) : (
                    listToShow.map((product) => <ProductCard key={product.id} product={product} />)
                )
            }
        </div>

    );
}
