export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface DashboardData {
  stats: DashboardStat[];
}
