import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { AddCategoryDialog } from "../components/AddCategoryDialog";
import { AddProductDialog } from "../components/AddProductDialog";
import { CategoryList } from "../components/CategoryList";
import { ProductList } from "../components/ProductList";
import { SearchBar } from "../components/SearchBar";
import { useGlobalStore } from "../../shared/stores/global-store";
import { useInventoryStore } from "../stores/inventory-store";

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
        <div className="flex flex-col mx-20 gap-8">
            <Box className="rounded-md border border-neutral-300 bg-white px-4 py-3 shadow-sm">
                <Tabs
                    value={tabIndex}
                    onChange={(_, value) => setTabIndex(value)}
                    textColor="inherit"
                    variant="fullWidth"
                    TabIndicatorProps={{ className: 'bg-brand-default' }}
                >
                    <Tab label="Productos" className="font-mulish text-sm font-bold text-neutral-700" />
                    <Tab label="Categorías" className="font-mulish text-sm font-bold text-neutral-700" />
                </Tabs>
            </Box>

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
        </div >
    )
}