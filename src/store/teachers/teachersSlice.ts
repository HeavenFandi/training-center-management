import { createSlice } from "@reduxjs/toolkit";
import actGetTeachers from "./act/actGetTeachers";
import actGetTeacherById from "./act/actGetTeacherById";
import actGetTeacherCourseProgress, {
  TeacherCourseProgress,
} from "./act/actGetTeacherCourseProgress";
import actCreateTeacher from "./act/actCreateTeacher";
import actUpdateTeacher from "./act/actUpdateTeacher";
import actDeleteTeacher from "./act/actDeleteTeacher";
import actUpdateTeacherProfileImage from "./act/actUpdateTeacherProfileImage";
import { TeacherApiResponse } from "../../api/teacherApi";
import { RootState } from "../index";

interface ITeachersState {
  teachers: TeacherApiResponse[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  createLoading: "idle" | "pending" | "succeeded" | "failed";
  updateLoading: "idle" | "pending" | "succeeded" | "failed";

  selectedTeacher: TeacherApiResponse | null;
  selectedTeacherLoading: "idle" | "pending" | "succeeded" | "failed";
  selectedTeacherError: string | null;

  courseProgress: TeacherCourseProgress[];
  courseProgressLoading: "idle" | "pending" | "succeeded" | "failed";
  courseProgressError: string | null;
}

const initialState: ITeachersState = {
  teachers: [],
  loading: "idle",
  error: null,
  createLoading: "idle",
  updateLoading: "idle",

  selectedTeacher: null,
  selectedTeacherLoading: "idle",
  selectedTeacherError: null,

  courseProgress: [],
  courseProgressLoading: "idle",
  courseProgressError: null,
};

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    resetTeachersError: (state) => {
      state.error = null;
    },
    resetSelectedTeacher: (state) => {
      state.selectedTeacher = null;
      state.selectedTeacherLoading = "idle";
      state.selectedTeacherError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetTeachers.pending, (state) => {
        // Only set loading to pending if we don't have data yet
        if (state.teachers.length === 0) {
          state.loading = "pending";
        }
        state.error = null;
      })
      .addCase(actGetTeachers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.teachers = action.payload;
      })
      .addCase(actGetTeachers.rejected, (state, action) => {
        state.loading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      // Create teacher cases
      .addCase(actCreateTeacher.pending, (state) => {
        state.createLoading = "pending";
        state.error = null;
      })
      .addCase(actCreateTeacher.fulfilled, (state, action) => {
        state.createLoading = "succeeded";
        state.teachers = [action.payload, ...state.teachers];
      })
      .addCase(actCreateTeacher.rejected, (state, action) => {
        state.createLoading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      // Update teacher cases
      .addCase(actUpdateTeacher.pending, (state) => {
        state.updateLoading = "pending";
        state.error = null;
      })
      .addCase(actUpdateTeacher.fulfilled, (state, action) => {
        state.updateLoading = "succeeded";
        const index = state.teachers.findIndex(
          (teacher) => teacher.id === action.payload.id
        );
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
      })
      .addCase(actUpdateTeacher.rejected, (state, action) => {
        state.updateLoading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      .addCase(actGetTeacherById.pending, (state) => {
        state.selectedTeacherLoading = "pending";
        state.selectedTeacherError = null;
      })
      .addCase(actGetTeacherById.fulfilled, (state, action) => {
        state.selectedTeacherLoading = "succeeded";
        state.selectedTeacher = action.payload;
      })
      .addCase(actGetTeacherById.rejected, (state, action) => {
        state.selectedTeacherLoading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.selectedTeacherError = action.payload;
        }
      })

      .addCase(actGetTeacherCourseProgress.pending, (state) => {
        state.courseProgressLoading = "pending";
        state.courseProgressError = null;
      })
      .addCase(actGetTeacherCourseProgress.fulfilled, (state, action) => {
        state.courseProgressLoading = "succeeded";
        state.courseProgress = action.payload;
      })
      .addCase(actGetTeacherCourseProgress.rejected, (state, action) => {
        state.courseProgressLoading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.courseProgressError = action.payload;
        }
      })
      
      // Delete teacher cases
      .addCase(actDeleteTeacher.pending, (state) => {
        state.error = null;
      })
      .addCase(actDeleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(
          (teacher) => teacher.id !== action.payload
        );
      })
      .addCase(actDeleteTeacher.rejected, (state, action) => {
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      // Update teacher profile image cases
      .addCase(actUpdateTeacherProfileImage.pending, (state) => {
        state.updateLoading = "pending";
        state.error = null;
      })
      .addCase(actUpdateTeacherProfileImage.fulfilled, (state, action) => {
        state.updateLoading = "succeeded";
        const index = state.teachers.findIndex(
          (teacher) => teacher.id === action.payload.id
        );
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
        if (state.selectedTeacher?.id === action.payload.id) {
          state.selectedTeacher = action.payload;
        }
      })
      .addCase(actUpdateTeacherProfileImage.rejected, (state, action) => {
        state.updateLoading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        }
      });
  },
});

export const { resetTeachersError, resetSelectedTeacher } =
  teachersSlice.actions;

export const selectTeachersState = (state: RootState) => state.teachers;

export default teachersSlice.reducer;
