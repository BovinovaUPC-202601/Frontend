import {Trash2 as DeleteIcon} from "lucide-react";
import {Pencil as EditIcon} from "lucide-react";
import {Check as CheckIcon} from "lucide-react"
import {X as CloseIcon} from "lucide-react";
import {Boxes as Inventory2Icon} from "lucide-react";
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useGlobalStore } from '../../shared/stores/global-store';
import type { Category } from '../model/Category';
import { EditCategoryDialog } from './EditCategoryDialog';

interface CategoryCardProps {
    category: Category;
    productCount: number;
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
    const { deleteCategory, updateCategory } = useGlobalStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(category.name ?? '');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSaveInline = async () => {
        if (!editedName.trim()) return;
        await updateCategory({ ...category, name: editedName });
        setIsEditing(false);
    };

    const handleCancelInline = () => {
        setEditedName(category.name ?? '');
        setIsEditing(false);
    };

    return (
        <>
            <div className="rounded-[16px] bg-white shadow-md border-l-[4px] border-[#7C5FA0] p-4 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
                <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#D4C8E8] flex items-center justify-center shrink-0">
                        <Inventory2Icon className="w-6 h-6 text-[#7C5FA0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            className="focus:outline-none border border-[#E1E7DF] px-3 py-1.5 rounded-[8px] text-sm text-[#0E1A12] font-inter transition-all duration-200 focus:border-[#10A065] focus:ring-2 focus:ring-[#C8F0DA]"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-[#0E1A12] text-base font-bold font-inter truncate">{category.name}</h3>
                                        <p className="text-[#4F6354] text-xs font-inter mt-0.5">{productCount} producto{productCount !== 1 ? 's' : ''}</p>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-1 shrink-0 ml-2">
                                {isEditing ? (
                                    <>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#10A065] hover:bg-[#C8F0DA] transition-all duration-150" onClick={handleSaveInline} title="Guardar">
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#D04A3A] hover:bg-[#FFD9D2] transition-all duration-150" onClick={handleCancelInline} title="Cancelar">
                                            <CloseIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#10A065] hover:bg-[#C8F0DA] transition-all duration-150" onClick={() => setIsEditing(true)} title="Editar">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#D04A3A] hover:bg-[#FFD9D2] transition-all duration-150" onClick={() => setShowDeleteConfirm(true)} title="Eliminar">
                                            <DeleteIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {!isEditing && productCount > 0 && (
                    <div className="h-px bg-gradient-to-r from-[#D4C8E8] to-transparent my-3" />
                )}
            </div>

            <EditCategoryDialog category={category} open={isEditOpen} onClose={() => setIsEditOpen(false)} />

            {showDeleteConfirm && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-[20px] shadow-xl w-full max-w-sm mx-4 p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#0E1A12] font-inter mb-2">Eliminar categoría</h3>
                        <p className="text-sm text-[#4F6354] font-inter mb-6">
                            ¿Estás seguro de que querés eliminar <strong>{category.name}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
                                onClick={() => setShowDeleteConfirm(false)}
                            >Cancelar</button>
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#D04A3A] to-[#B33A2E] transition-all duration-150 hover:shadow-lg active:scale-[0.97]"
                                onClick={() => { deleteCategory(category); setShowDeleteConfirm(false); }}
                            >Eliminar</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
