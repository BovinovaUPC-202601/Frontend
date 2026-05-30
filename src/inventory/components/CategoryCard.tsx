import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useState } from 'react';
import { useGlobalStore } from '../../shared/stores/global-store';
import type { Category } from '../model/Category';
import { EditCategoryDialog } from './EditCategoryDialog';

interface CategoryCardProps {
    category: Category;
    productCount: number;
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
    const { deleteCategory } = useGlobalStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <>
            <Card className="bg-neutral-100 font-mulish border-1 border-neutral-300 shadow-none rounded-md">
                <CardContent>
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-lg font-semibold text-neutral-800 py-1 px-2 w-full border-1 border-transparent">
                                {category.name}
                            </span>
                            <span className="text-sm text-neutral-500 py-1 px-2 w-full border-1 border-transparent">
                                Productos registrados: {productCount}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <EditIcon
                                className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-brand-default"
                                onClick={() => setIsEditOpen(true)}
                            />
                            <DeleteIcon
                                className="w-6 h-auto cursor-pointer text-neutral-500 hover:text-state-error"
                                onClick={() => deleteCategory(category)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditCategoryDialog
                category={category}
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />
        </>
    );
}
