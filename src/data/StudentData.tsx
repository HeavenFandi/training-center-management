import React from "react";
import { ActiveCourse, Day, Lecture, Student } from "../types/studentDashboard";
import { Item } from "../types/dashboard";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";

export const statsStudent: Item[] = [
  {
    title: "اجمالي الطلاب",
    value: "1250",
    icon: <GroupIcon />,
    color: "#2196f3",
  },
  {
    title: "الطلاب النشطون",
    value: "40 طالب",
    icon: <PersonIcon />,
    color: "#4caf50",
  },
];

export const studentInitialData: Student = {
  id: 1,
  firstName: "علي",
  lastName: "عبود",
  username: "ali_aboud",
  gender: "ذكر",
  birthDate: "2004-05-01",
  address: "سوريا، حمص",
  bio: "تصميم واجهات، برمجة ويب",
  enrollmentDate: "2026-01-06",
  image: "https://i.pravatar.cc/150?u=ali",
};

export const dashboardDays: Day[] = [
  {
    name: "الأحد",
    date: 22,
    dateString: "2026-07-05",
    fullDate: new Date("2026-07-05"),
  },
  {
    name: "الاثنين",
    date: 23,
    dateString: "2026-07-06",
    fullDate: new Date("2026-07-06"),
  },
  {
    name: "الثلاثاء",
    date: 24,
    dateString: "2026-07-07",
    fullDate: new Date("2026-07-07"),
  },
  {
    name: "الأربعاء",
    date: 25,
    dateString: "2026-07-08",
    fullDate: new Date("2026-07-08"),
  },
  {
    name: "الخميس",
    date: 26,
    dateString: "2026-07-09",
    fullDate: new Date("2026-07-09"),
  },
];

export const studentLecturesData: Record<string, Lecture[]> = {
  الأحد: [
    {
      title: "الرياضيات",
      startTime: "8:00",
      endTime: "9:00",
      room: "القاعة 4",
      instructor: "أستاذ أحمد",
    },
    {
      title: "تصميم",
      startTime: "8:00",
      endTime: "9:00",
      room: "القاعة 5",
      instructor: "أستاذ أحمد",
    },
  ],
  الاثنين: [
    {
      title: "الرياضيات",
      startTime: "8:00",
      endTime: "9:00",
      room: "القاعة 4",
      instructor: "أستاذ أحمد",
    },
  ],
  الثلاثاء: [
    {
      title: "الرياضيات",
      startTime: "8:00",
      endTime: "9:00",
      room: "القاعة 4",
      instructor: "أستاذ أحمد",
    },
  ],
  الأربعاء: [
    {
      title: "برمجة",
      startTime: "8:00",
      endTime: "9:00",
      room: "القاعة 3",
      instructor: "أستاذ أحمد",
    },
  ],
  الخميس: [
    {
      title: "الرياضيات",
      startTime: "8:00",
      endTime: "9:00",
      room: "القاعة 4",
      instructor: "أستاذ أحمد",
    },
  ],
};

export const activeCoursesData: ActiveCourse[] = [
  {
    studentId: 1,
    trainingSessionId: 101,
    courseName: "تصميم واجهات المستخدم ui/ux",
    totalLectures: 32,
    lecturesAttended: 21,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    startDate: "2026-01-01",
    attendancePercentage: 65,
  },
  {
    studentId: 1,
    trainingSessionId: 102,
    courseName: "الأمن السيبراني",
    totalLectures: 100,
    lecturesAttended: 50,
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop",
    startDate: "2026-02-01",
    attendancePercentage: 50,
  },
];

export const studentsData: Student[] = [
  {
    id: 1,
    firstName: "علي",
    lastName: "خليل",
    username: "ali_khaleel",
    gender: "ذكر",
    birthDate: "1998-05-15",
    address: "سوريا - حمص",
    bio: "  تعلم البرمجيات وهندسة النظم",
    enrollmentDate: "2025-09-01",
    image: "https://via.placeholder.com/40",
  },
  {
    id: 2,
    firstName: "لارا",
    lastName: "سليمان",
    username: "lara_s",
    gender: "أنثى",
    birthDate: "2000-02-10",
    address: "سوريا - دمشق",
    bio: "  تعلم البرمجيات وهندسة النظم",
    enrollmentDate: "2025-10-15",
    image: "https://via.placeholder.com/40",
  },
  {
    id: 3,
    firstName: "مسك",
    lastName: "محمد",
    username: "mesk_m",
    gender: "أنثى",
    birthDate: "2002-11-20",
    address: "سوريا - اللاذقية",
    bio: "  تعلم البرمجيات وهندسة النظم",
    enrollmentDate: "2025-11-01",
    image: "https://via.placeholder.com/40",
  },
  {
    id: 4,
    firstName: "علي",
    lastName: "خليل",
    username: "ali_k2",
    gender: "ذكر",
    birthDate: "1999-08-30",
    address: "سوريا - طرطوس",
    bio: "  تعلم البرمجيات وهندسة النظم",
    enrollmentDate: "2025-12-10",
    image: "https://via.placeholder.com/40",
  },
];
