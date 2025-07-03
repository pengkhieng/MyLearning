import { Dashboard } from "./dashboard";

type DashboardData = {
    title: string;
    key: string;
    value: Dashboard['summary'] | Dashboard['topProducts'] | Dashboard['dailySales'];
  };
  