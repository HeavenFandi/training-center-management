import { createSlice } from "@reduxjs/toolkit";
import actGetTeachers from "./act/actGetTeachers";
import actGetTeacherById from "./act/actGetTeacherById";
import { TeacherApiResponse } from "../../api/teacherApi";
import { RootState } from "../index";

interface ITeachersState {
  teachers: TeacherApiResponse[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  selectedTeacher: TeacherApiResponse | null;
  selectedTeacherLoading: "idle" | "pending" | "succeeded" | "failed";
  selectedTeacherError: string | null;
}

const initialState: ITeachersState = {
  teachers: [],
  loading: "idle",
  error: null,
  selectedTeacher: null,
  selectedTeacherLoading: "idle",
  selectedTeacherError: null,
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
        state.loading = "pending";
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
      });
  },
});

export const { resetTeachersError, resetSelectedTeacher } = teachersSlice.actions;
export const selectTeachersState = (state: RootState) => state.teachers;
export default teachersSlice.reducer;