export interface Teacher {
  id: number;
  name: string;
  email: string;
  image: string;
  specialization: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  rating?: number;
  bio?: string;
  experience?: string;
}

export interface NewTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  phone: string;
  address: string;
  experience: string;
  cvFile: File | null;
}

