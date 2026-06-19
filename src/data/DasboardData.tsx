import { Item, ScheduleItem, ChartData } from "../types/dashboard";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export const statsAdmin: Item[] = [
  {
    title: "اجمالي المستخدمين",
    value: "1250",
    icon: <PeopleAltIcon />,
    color: "#1a2c4e",
  },
  {
    title: "الدورات النشطة",
    value: "340 طالب",
    icon: <MenuBookIcon />,
    color: "#f39c12",
  },
];

export const chartData: ChartData[] = [
  { name: "يناير", value: 30 },
  { name: "فبراير", value: 55 },
  { name: "مارس", value: 45 },
  { name: "ابريل", value: 95 },
  { name: "مايو", value: 55 },
  { name: "يونيو", value: 85 },
];

export const schedule: ScheduleItem[] = [
  { id: 1, title: "قاعة 1: دورة بايثون", time: "12:00 - 2:00" },
  { id: 2, title: "قاعة 1: تصميم", time: "12:00 - 2:00" },
];

export const financialData = [
  { name: "1", value: 400 },
  { name: "2", value: 300 },
  { name: "3", value: 600 },
  { name: "4", value: 800 },
];


