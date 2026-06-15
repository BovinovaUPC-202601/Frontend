import {Trash2 as DeleteIcon} from "lucide-react";
import {Pencil as EditIcon} from "lucide-react";
import {Package as InventoryIcon} from "lucide-react";
import {Calendar as CalendarTodayIcon} from "lucide-react";
import {Scale as ScaleIcon} from "lucide-react"
import {Tags as CategoryIcon} from "lucide-react";
import { useState } from 'react';
import { createPortal } from "react-dom";
import { useGlobalStore } from "../../shared/stores/global-store";
import type { Product } from '../model/Product';
import dayjs from 'dayjs';
import { EditProductDialog } from './EditProductDialog';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { deleteProduct, categories } = useGlobalStore();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const categoryName = categories.find(c => c.id === product.categoryId)?.name ?? "Sin categoría";
    const expDate = product.expirationDate ? dayjs(product.expirationDate).format("DD/MM/YYYY") : null;

    return (
        <>
            <div className="rounded-[16px] bg-white shadow-md border-l-[4px] border-[#4F6354] p-4 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
                <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#E1E7DF] flex items-center justify-center shrink-0">
                        <InventoryIcon className="w-6 h-6 text-[#4F6354]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-[#0E1A12] text-base font-bold font-inter truncate">{product.name}</h3>
                                <p className="text-[#4F6354] text-xs font-inter mt-0.5">{categoryName}</p>
                            </div>
                            <div className="flex gap-1 shrink-0 ml-2">
                                <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#10A065] hover:bg-[#C8F0DA] transition-all duration-150" onClick={() => setIsEditOpen(true)} title="Editar">
                                    <EditIcon className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded-[8px] text-[#7E8F82] hover:text-[#D04A3A] hover:bg-[#FFD9D2] transition-all duration-150" onClick={() => setShowDeleteConfirm(true)} title="Eliminar">
                                    <DeleteIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-[#E1E7DF] to-transparent my-3" />

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <ScaleIcon className="w-3.5 h-3.5 text-[#4F6354] shrink-0" />
                        <div>
                            <span className="text-[9px] text-[#7E8F82] font-inter uppercase tracking-wider block">Cantidad</span>
                            <span className="text-[#0E1A12] text-sm font-medium font-inter">
                                {product.quantity}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ScaleIcon className="w-3.5 h-3.5 text-[#4F6354] shrink-0" />
                        <div>
                            <span className="text-[9px] text-[#7E8F82] font-inter uppercase tracking-wider block">Unidad</span>
                            <span className="text-[#0E1A12] text-sm font-medium font-inter">
                                {product.unit || "—"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <CategoryIcon className="w-3.5 h-3.5 text-[#4F6354] shrink-0" />
                        <div>
                            <span className="text-[9px] text-[#7E8F82] font-inter uppercase tracking-wider block">Categoría</span>
                            <span className="text-[#0E1A12] text-sm font-medium font-inter truncate">{categoryName}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarTodayIcon className="w-3.5 h-3.5 text-[#4F6354] shrink-0" />
                        <div>
                            <span className="text-[9px] text-[#7E8F82] font-inter uppercase tracking-wider block">Vencimiento</span>
                            <span className="text-[#0E1A12] text-sm font-medium font-inter">{expDate || "—"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <EditProductDialog product={product} open={isEditOpen} onClose={() => setIsEditOpen(false)} />

            {showDeleteConfirm && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-[20px] shadow-xl w-full max-w-sm mx-4 p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#0E1A12] font-inter mb-2">Eliminar producto</h3>
                        <p className="text-sm text-[#4F6354] font-inter mb-6">
                            ¿Estás seguro de que querés eliminar <strong>{product.name}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-[#4F6354] font-inter bg-[#F4F8F2] hover:bg-[#E1E7DF] transition-all duration-150"
                                onClick={() => setShowDeleteConfirm(false)}
                            >Cancelar</button>
                            <button
                                className="cursor-pointer px-4 py-2 rounded-[12px] text-sm font-medium text-white font-inter bg-gradient-to-r from-[#D04A3A] to-[#B33A2E] transition-all duration-150 hover:shadow-lg active:scale-[0.97]"
                                onClick={() => { deleteProduct(product); setShowDeleteConfirm(false); }}
                            >Eliminar</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
