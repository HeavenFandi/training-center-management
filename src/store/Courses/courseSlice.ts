import { createSlice } from "@reduxjs/toolkit";
import actGetCoursesByTenantId from "./act/actGetCoursesByTenantId";
import actCreateCourse from "./act/actCreateCourse";
import actDeleteCourse from "./act/actDeleteCourse";
import actUpdateCourse from "./act/actUpdateCourse";
import actSearchCourses from "./act/actSearchCourses";
import { TCourse } from "../../types/cardType";
import { RootState } from "..";

interface CoursesState {
  courses: TCourse[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  createLoading: "idle" | "pending" | "succeeded" | "failed";
  createError: string | null;
  deleteLoading: "idle" | "pending" | "succeeded" | "failed";
  deleteError: string | null;
  updateLoading: "idle" | "pending" | "succeeded" | "failed";
  updateError: string | null;
  searchLoading: "idle" | "pending" | "succeeded" | "failed";
  searchError: string | null;
}

const initialState: CoursesState = {
  courses: [],
  loading: "idle",
  error: null,
  createLoading: "idle",
  createError: null,
  deleteLoading: "idle",
  deleteError: null,
  updateLoading: "idle",
  updateError: null,
  searchLoading: "idle",
  searchError: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actGetCoursesByTenantId.pending, (state) => {
      // Only set loading to pending if we don't have data yet
      if (state.courses.length === 0) {
        state.loading = "pending";
      }
      state.error = null;
    });
    builder.addCase(actGetCoursesByTenantId.fulfilled, (state, action) => {
      state.loading = "succeeded";
      // Map API response fields to TCourse fields
      state.courses = action.payload.map(course => ({
        ...course,
        title: course.title || course.name,
        category: course.category || course.categoryName,
      }));
    });
    builder.addCase(actGetCoursesByTenantId.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });
    builder.addCase(actSearchCourses.pending, (state) => {
      state.searchLoading = "pending";
      state.searchError = null;
    });
    builder.addCase(actSearchCourses.fulfilled, (state, action) => {
      state.searchLoading = "succeeded";
      // Map search response to TCourse
      state.courses = action.payload.map(course => ({
        id: course.id,
        title: course.name,
        name: course.name,
        description: course.description,
        requirements: course.requirements,
        hours: course.hours,
        categoryName: course.categoryName,
        category: course.categoryName,
        institute: course.tenantName,
        price: 0,
        image: "",
        lecturesCount: 0,
        instructor: { id: 0, name: "", title: "", image: "", email: "", phone: "", certificates: [], studentsCount: 0, courseCount: 0, experienceYears: 0, rating: 0, bio: "" },
        reviews: [],
        students: "",
        sessions: [],
      }));
    });
    builder.addCase(actSearchCourses.rejected, (state, action) => {
      state.searchLoading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.searchError = action.payload;
      }
    });
    builder.addCase(actCreateCourse.pending, (state) => {
      state.createLoading = "pending";
      state.createError = null;
    });
    builder.addCase(actCreateCourse.fulfilled, (state) => {
      state.createLoading = "succeeded";
    });
    builder.addCase(actCreateCourse.rejected, (state, action) => {
      state.createLoading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.createError = action.payload;
      }
    });
    builder.addCase(actDeleteCourse.pending, (state) => {
      state.deleteLoading = "pending";
      state.deleteError = null;
    });
    builder.addCase(actDeleteCourse.fulfilled, (state, action) => {
      state.deleteLoading = "succeeded";
      state.courses = state.courses.filter((course) => course.id !== action.payload);
    });
    builder.addCase(actDeleteCourse.rejected, (state, action) => {
      state.deleteLoading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.deleteError = action.payload;
      }
    });
    builder.addCase(actUpdateCourse.pending, (state) => {
      state.updateLoading = "pending";
      state.updateError = null;
    });
    builder.addCase(actUpdateCourse.fulfilled, (state, action) => {
      state.updateLoading = "succeeded";
      // Map API response fields to TCourse fields
      const updatedCourse = {
        ...action.payload,
        title: action.payload.title || action.payload.name,
        category: action.payload.category || action.payload.categoryName,
      };
      state.courses = state.courses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      );
    });
    builder.addCase(actUpdateCourse.rejected, (state, action) => {
      state.updateLoading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.updateError = action.payload;
      }
    });
  },
});

export const selectCoursesState = (state: RootState) => state.courses;
export default coursesSlice.reducer;
