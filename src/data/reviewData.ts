

export interface Review {
  id: number;
  text: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

export const reviewsData: Review[] = [
  {
    id: 1,
    text: "الدورة كانت أكثر من رائعة! المحتوى عملي جداً وتطبيق المشاريع ساعدني كثير في فهم المفاهيم الأساسية وتطبيقها في عملي الحالي.",
    name: "علي حيدر",
    role: "خريج دورة التسويق",
    avatar: "https://i.pravatar.cc/40?img=1",
    rating: 5,
  },
  {
    id: 2,
    text: "المحتوى العلمي متميز جداً والمدربون متعاونون للغاية. استفدت كثيراً من ورش العمل التطبيقية.",
    name: "سارة أحمد",
    role: "خريجة دورة التصميم",
    avatar: "https://i.pravatar.cc/40?img=5",
    rating: 5,
  },
  {
    id: 3,
    text: "تجربة تعليمية فريدة، أنصح الجميع بالالتحاق بهذه الأكاديمية لمن يبحث عن تطوير حقيقي لمهاراته.",
    name: "محمد خالد",
    role: "خريج دورة البرمجة",
    avatar: "https://i.pravatar.cc/40?img=8",
    rating: 4,
  },
];
