import { TCourse } from "../types/cardType";

export const instituteInfo = {
  name: "معهد النور",
  description: "معهد متخصص في تدريب علوم الحاسوب والبرمجة بأحدث المعايير العالمية",
  location: "سوريا - حمص - شارع الحضارة",
  workingHours: [
    { days: "الأحد - الخميس", time: "08:00 - 15:00", status: "open" },
  ],
  contact: { 
    phone: "0912345678", 
    email: "al-nour@gmail.com" 
  }
};

export const coursesData: TCourse[] = [
  {
    id: 1,
    title: "الأمن السيبراني",
    description: "تعلم الأمن السبراني والهكر الأخلاقي مع تعلم حماية بياناتك وبيانات الآخرين",
    category: "أمن معلومات",
    categoryName: "أمن معلومات",
    price: 150,
    requirements: "معرفة أساسية بالشبكات",
    duration: "160 ساعة",
    hours: 160,
    students: "1440",
    image: "https://via.placeholder.com/300x200?text=Cyber+Security",
    institute: "معهد النور",
    lecturesCount: 80,
    instructor: {
      id: 1,
      name: "علي خليل",
      title: "مهندس أمن معلومات",
      image: "https://via.placeholder.com/150",
      email: "ali@gmail.com",
      phone: "0947883611",
      certificates: ["CompTIA Security+", "CEH"],
      studentsCount: 1200,
      courseCount: 5,
      experienceYears: 8,
      rating: 4.8,
      bio: "خبير في مجال الأمن السيبراني واختبار الاختراق",
    },
    reviews: [
      {
        id: 1,
        name: "محمد أحمد",
        role: "طالب",
        text: "دورة ممتازة وشرح وافي",
        image: "https://via.placeholder.com/50",
        rating: 5,
      }
    ],
    sessions: [
      {
        id: 101,
        title: "دفعة الربيع 2026",
        courseId: 1,
        instructorId: 1,
        semester: "الربيع",
        price: 150,
        availableSeats: 20,
        minCapacity: 5,
        sessionsCount: 20,
        duration: "3 أشهر",
        status: "نشطة",
        requiredEquipment: "حاسوب محمول",
        startDate: "2026-03-01",
        startTime: "10:00",
        endDate: "2026-06-01",
        days: ["الأحد", "الثلاثاء"],
        hall: "قاعة 1",
        lectures: [],
        teacherId: 1,
        classroomId: 1,
      }
    ]
  },
  {
    id: 2,
    title: "UI/UX تصميم واجهات المستخدم",
    description: "تعلم تصميم واجهات المستخدم وتجربة المستخدم بأحدث المعايير العالمية",
    category: "تصميم",
    categoryName: "تصميم",
    price: 120,
    requirements: "لا يوجد",
    duration: "120 ساعة",
    hours: 120,
    students: "850",
    image: "https://via.placeholder.com/300x200?text=UI+UX+Design",
    institute: "معهد النور",
    lecturesCount: 60,
    instructor: {
      id: 3,
      name: "مسك محمد",
      title: "مصممة واجهات",
      image: "https://via.placeholder.com/150",
      email: "mesk@gmail.com",
      phone: "0955112233",
      certificates: ["Google UX Design Professional Certificate"],
      studentsCount: 500,
      courseCount: 3,
      experienceYears: 4,
      rating: 4.9,
      bio: "مصممة واجهات بخبرة واسعة في تطبيقات الموبايل",
    },
    reviews: [],
    sessions: []
  }
];
