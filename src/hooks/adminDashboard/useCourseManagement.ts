import { useState, useCallback } from "react";
import { TCourse, TSession } from "../../types/cardType";
import { coursesData } from "../../data/coursedata";
import { CourseFormData } from "../../validation/CourseSchema";

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<TCourse[]>(coursesData);
  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openEditModal, setOpenEditModel] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const handleDeleteCourse = useCallback(() => {
    if (!selectedCourse) return;
    setCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
    setIsDeleteOpen(false);
  }, [selectedCourse]);

  const handleOpenDetail = useCallback((course: TCourse) => {
    setSelectedCourse(course);
    setOpenDetailsModal(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setOpenDetailsModal(false);
  }, []);

  const handleOpenEdit = useCallback((course: TCourse) => {
    setSelectedCourse(course);
    setOpenEditModel(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setOpenEditModel(false);
  }, []);

  const handleDeleteClick = useCallback((course: TCourse) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteOpen(false);
  }, []);

  const handleSaveEdit = useCallback((updatedCourse: TCourse) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)),
    );
    setSelectedCourse(updatedCourse); 
    setOpenEditModel(false);
  }, []);

  const handleOpenAdd = useCallback(() => {
    setOpenAddModal(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setOpenAddModal(false);
  }, []);

  const handleSaveAdd = useCallback((data: CourseFormData) => {
    const newCourse: TCourse = {
      id: Date.now(),
      title: data.title,
      category: data.category,
      price: 0, 
      requirements: data.requirements,
      duration: data.hoursCount, 
      students: "0",
      description: data.description,
      image: data.image || "",
      institute: "",
      lecturesCount: 0,
      instructor: {
        id: 0,
        name: "غير محدد",
        title: "مدرب",
        image: "",
        email: "",
        phone: "",
        certificates: [],
        studentsCount: 0,
        courseCount: 0,
        experienceYears: 0,
        rating: 0,
        bio: "",
      },
      reviews: [],
      sessions: [],
    };
    setCourses((prev) => [...prev, newCourse]);
    setOpenAddModal(false);
  }, []);

  const handleAddSession = useCallback((sessionData: Omit<TSession, "id" | "lectures">) => {
    const newSession: TSession = {
      ...sessionData,
      id: Date.now(),
      lectures: [],
    };

    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === sessionData.courseId) {
          const updatedSessions = [...(course.sessions || []), newSession];
          const updatedCourse = { ...course, sessions: updatedSessions };
          if (selectedCourse?.id === sessionData.courseId) {
            setSelectedCourse(updatedCourse);
          }
          return updatedCourse;
        }
        return course;
      })
    );
  }, [selectedCourse]);

  return {
    courses,
    selectedCourse,
    isDeleteOpen,
    openEditModal,
    openAddModal,
    openDetailsModal,
    handleDeleteCourse,
    handleOpenDetail,
    handleCloseDetail,
    handleOpenEdit,
    handleCloseEdit,
    handleDeleteClick,
    handleCloseDelete,
    handleSaveEdit,
    handleOpenAdd,
    handleCloseAdd,
    handleSaveAdd,
    handleAddSession,
  };
};

