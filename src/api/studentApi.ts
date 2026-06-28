import axiosClient from "./axiosClient";

export interface CreateStudentRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactInfo: string;
  image: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  address: string;
  interest: string;
  bio: string;
}

export interface CreateStudentResponse {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  address: string;
  interest: string;
  bio: string;
  enrollmentDate: string;
  userId: number;
  username: string;
  email: string;
  contactInfo: string;
  image: string;
}

export type GetStudentsResponse = CreateStudentResponse[];

export const createStudent = async (data: CreateStudentRequest): Promise<CreateStudentResponse> => {
  const response = await axiosClient.post<CreateStudentResponse>("/students", data);
  return response.data;
};

export interface UpdateStudentRequest {
  firstName: string;
  lastName: string;
  username: string;
  gender: string;
  birthDate: string;
  address: string;
  bio: string;
  interest?: string;
  profilePicture?: File | string; // File object or base64 string
}

export const updateStudent = async (
  id: number,
  data: UpdateStudentRequest
): Promise<CreateStudentResponse> => {
  // Always use FormData (server doesn't support JSON)
  const formData = new FormData();
  
  // Debug logs
  console.log("updateStudent data:", data);
  
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("username", data.username);
  formData.append("gender", data.gender);
  formData.append("birthDate", data.birthDate);
  formData.append("address", data.address);
  formData.append("bio", data.bio);
  if (data.interest) formData.append("interest", data.interest);
  
  if (data.profilePicture) {
    if (data.profilePicture instanceof File) {
      console.log("Appending File:", data.profilePicture);
      formData.append("profilePicture", data.profilePicture);
    } else {
      console.log("Appending base64 image");
      try {
        const [header, base64Data] = data.profilePicture.split(",");
        const mimeMatch = header.match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeType });
        const file = new File([blob], "profilePicture.jpg", { type: mimeType });
        console.log("Created File from base64:", file);
        formData.append("profilePicture", file);
      } catch (error) {
        console.error("Error converting base64 to file:", error);
      }
    }
  }

  // Log all form data entries
  console.log("FormData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await axiosClient.put<CreateStudentResponse>(`/students/${id}`, formData, {
    headers: {
      // Don't set Content-Type manually! Axios will set it with boundary for FormData
    },
  });
  return response.data;
};

export const getStudents = async (tenantId: string | number): Promise<GetStudentsResponse> => {
  const response = await axiosClient.get<GetStudentsResponse>(`/institutes/tenant/${tenantId}/students`);
  return response.data;
};

export const deleteStudent = async (studentId: number, instituteId: number): Promise<void> => {
  await axiosClient.delete(`/students/${studentId}/register/institute/${instituteId}`);
};

export const getStudentActiveCourses = async (studentId: number): Promise<any[]> => {
  const response = await axiosClient.get(`/enrollments/student/${studentId}/active`);
  // Handle possible response formats
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (typeof response.data === "object" && response.data !== null) {
    if ("data" in response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if ("courses" in response.data && Array.isArray(response.data.courses)) {
      return response.data.courses;
    }
  }
  return [];
};

export const getAllStudents = async (): Promise<GetStudentsResponse> => {
  const response = await axiosClient.get<GetStudentsResponse>("/students");
  return response.data;
};
