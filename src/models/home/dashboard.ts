import { DailySale } from "./dailySale";
import { SalesSummary } from "./salesSummary";
import { TopProduct } from "./topProduct";

export type Dashboard = {
    summary: SalesSummary;
    topProducts: TopProduct[];
    dailySales: DailySale[];
};
