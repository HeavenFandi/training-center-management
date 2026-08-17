import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { TInstructor } from "../../types/cardType";
import {
  getTeacherById,
  getTeacherCourseProgress,
  TeacherCourseProgress,
} from "../../api/teacherApi";

export default function useTeacherDetails() {
  const { id } = useParams();
  const location = useLocation();

  const teacherFromState = location.state?.teacher as TInstructor | undefined;

  const [teacher, setTeacher] = useState<TInstructor | undefined>(
    teacherFromState,
  );

  const [teacherCourses, setTeacherCourses] = useState<TeacherCourseProgress[]>(
    [],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const [teacherData, coursesData] = await Promise.all([
          getTeacherById(id),
          getTeacherCourseProgress(id),
        ]);

        const fullName =
          `${teacherData.firstName || ""} ${teacherData.lastName || ""}`.trim() ||
          teacherData.username ||
          teacherFromState?.name ||
          "اسم المعلم غير متوفر";

        const mappedTeacher: TInstructor = {
          id: teacherData.id,
          userId: teacherData.userId,
          name: fullName,
          title:
            teacherData.specialization || teacherFromState?.title || "مدرب",
          image: teacherData.image || teacherFromState?.image || "",
          email: teacherData.email || teacherFromState?.email || "",
          phone: teacherData.contactInfo || teacherFromState?.phone || "",
          certificates: teacherData.certificates
            ? [teacherData.certificates]
            : teacherFromState?.certificates || [],
          studentsCount:
            teacherData.numberOfStudents ??
            teacherFromState?.studentsCount ??
            0,
          courseCount: coursesData.length,
          experienceYears:
            teacherData.experienceYears ??
            teacherFromState?.experienceYears ??
            0,
          rating: teacherFromState?.rating ?? 0,
          bio: teacherData.cv || teacherFromState?.bio || "",
        };

        setTeacher(mappedTeacher);
        setTeacherCourses(coursesData);
      } catch (error) {
        console.error("GET TEACHER DETAILS ERROR:", error);

        if (teacherFromState) {
          setTeacher(teacherFromState);
          return;
        }

        setError("تعذر تحميل بيانات المعلم");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [id, teacherFromState]);

  return {
    teacher,
    teacherCourses,
    loading,
    error,
  };
}
