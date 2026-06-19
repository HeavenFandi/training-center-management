import { ReactNode } from "react";

export interface Item {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ScheduleItem {
  id: number;
  title: string;
  time: string;
}

