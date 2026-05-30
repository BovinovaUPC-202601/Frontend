import AddIcon from '@mui/icons-material/Add';
import { useGlobalStore } from '../../shared/stores/global-store';
import { useInventoryStore } from '../stores/inventory-store';
import { CategoryCard } from './CategoryCard';

export function CategoryList() {
    const { categories, products } = useGlobalStore();
    const { toggleModalCategory } = useInventoryStore();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-bold text-neutral-700">Categorías</div>
                <button
                    className="cursor-pointer rounded-sm flex items-center gap-2 px-2 py-1 bg-brand-default text-white"
                    onClick={toggleModalCategory}
                >
                    <AddIcon className="w-6 h-auto" />
                    Añadir categoría
                </button>
            </div>
            <div className="flex flex-wrap gap-4">
                {categories.length === 0 ? (
                    <div className="text-neutral-500 text-center w-full py-6">No tienes categorías registradas.</div>
                ) : (
                    categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            productCount={products.filter((product) => product.categoryId === category.id).length}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
