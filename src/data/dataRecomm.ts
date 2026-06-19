
import Cardimg1 from "../assets/vectors/الامن السيبراني.jpg";
import Cardimg2 from "../assets/vectors/ui-ux.jpg";

export interface CourseStatistics {
  hours: string;
  lessons: string;
  students: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  img: string; 
  Statistics: CourseStatistics;
}

export const coursesData: Course[] = [
  {
    id: 1,
    name: "الأمن السيبراني",
    description: "تعلم الأمن السبراني والهكر الأخلاقي مع تعلم حماية بياناتك وبيانات الآخرين",
    img: Cardimg1,
    Statistics: {
      hours: "160 ساعة",
      lessons: "80 حصة",
      students: "1440 طالب",
    },
  },
  {
    id: 2,
    name: "UI/UX تصميم واجهات المستخدم",
    description: "تعلم تصميم واجهات المستخدم وتجربة المستخدم بأحدث المعايير العالمية",
    img: Cardimg2,
    Statistics: {
      hours: "160 ساعة",
      lessons: "80 حصة",
      students: "1440 طالب",
    },
  },
  {
    id: 3,
    name: "FLUTTER",
    description: "تعلم برمجة تطبيقات الموبايل باستخدام إطار عمل فلاتر ولغة دارت",
    img: Cardimg1, 
    Statistics: {
      hours: "160 ساعة",
      lessons: "80 حصة",
      students: "1440 طالب",
    },
  },
];
