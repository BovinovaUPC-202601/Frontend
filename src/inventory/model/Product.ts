export class Product {
    id: number = 0;
    name: string = '';
    categoryId: number = 0;
    quantity: number = 0;
    expirationDate?: string;
    unit?: string;

    constructor(data: Partial<Product> = {}) {
        Object.assign(this, data);
    }
}