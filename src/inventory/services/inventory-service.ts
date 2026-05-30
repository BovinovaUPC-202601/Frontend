import http from "../../shared/services/http";
import type { Category } from "../model/Category";
import type { Product } from "../model/Product";


export class InventoryService {
    private endpoint = import.meta.env.VITE_API_BASE_URL + '/inventory';

    async getCategories() {
        return await http.get<Category[]>(`${this.endpoint}/categories`);
    }

    async createCategory(category: Category) {
        return await http.post<Category>(`${this.endpoint}/categories`, category);
    }

    async updateCategory(category: Category) {
        return await http.put<Category>(`${this.endpoint}/categories/${category.id}`, category);
    }

    async deleteCategory(category: Category) {
        return await http.delete<void>(`${this.endpoint}/categories/${category.id}`);
    }

    async getProducts() {
        return await http.get<Product[]>(`${this.endpoint}/products`);
    }

    async createProduct(product: Product) {
        return await http.post<Product>(`${this.endpoint}/products`, product);
    }

    async updateProduct(product: Product) {
        return await http.put<Product>(`${this.endpoint}/products/${product.id}`, product);
    }

    async deleteProduct(product: Product) {
        return await http.delete<void>(`${this.endpoint}/products/${product.id}`);
    }
}

export const inventoryService = new InventoryService();