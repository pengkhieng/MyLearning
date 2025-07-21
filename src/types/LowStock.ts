export interface lowStockItems {
    id: string;
    name: string;
    stock: number;
    category: CategoryResponse;
}


export interface CategoryResponse {
    id: string;
    name: string;
}
