import React from "react";
import { Teacher } from "../types/teacher";
import { Item } from "../types/dashboard";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";

export const statsTeacher: Item[] = [
  {
    title: "اجمالي المعلمين",
    value: "1250",
    icon: <GroupIcon />,
    color: "#2196f3",
  },
  {
    title: "المدربون النشطون",
    value: "40 طالب",
    icon: <PersonIcon />,
    color: "#4caf50",
  },
];

export const TeachersData: Teacher[] = [
  {
    id: 1,
    name: "علي خليل",
    email: "alikhaleel@gmail.com",
    specialization: "هندسة البرمجيات",
    image: "https://via.placeholder.com/40",
    phone: "0947883611",
    address: "سوريا - حمص",
    birthDate: "1998-05-15",
  },
  {
    id: 2,
    name: "لارا سليمان",
    email: "lara@gmail.com",
    specialization: "بايثون",
    image: "https://via.placeholder.com/40",
    phone: "0933123456",
    address: "سوريا - دمشق",
    birthDate: "2000-02-10",
  },
  {
    id: 3,
    name: "مسك محمد",
    email: "mesk@gmail.com",
    specialization: "تصميم واجهات",
    image: "https://via.placeholder.com/40",
    phone: "0955112233",
    address: "سوريا - اللاذقية",
    birthDate: "2002-11-20",
  },
  {
    id: 4,
    name: "علي خليل",
    email: "alikhaleel2@gmail.com",
    specialization: "فلاتر",
    image: "https://via.placeholder.com/40",
    phone: "0944778899",
    address: "سوريا - طرطوس",
    birthDate: "1999-08-30",
  },
];


