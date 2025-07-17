import { OrderItem } from './OrderItem'

export interface Order {
    id: string;
    sellerId: string;
    name: string;
    address: string;
    phone: string;
    customTotalPrice: number;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}