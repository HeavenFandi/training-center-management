import { createSlice } from "@reduxjs/toolkit";
import actGetStudents from "./act/actGetStudents";
import actUpdateStudent from "./act/actUpdateStudent";
import actCreateStudent from "./act/actCreateStudent";
import actDeleteStudent from "./act/actDeleteStudent";
import actGetAllStudents from "./act/actGetAllStudents";
import { CreateStudentResponse } from "../../api/studentApi";
import { RootState } from "..";

interface IStudentsState {
  students: CreateStudentResponse[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  createLoading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: IStudentsState = {
  students: [],
  loading: "idle",
  error: null,
  createLoading: "idle",
};

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.students = [action.payload, ...state.students];
    },
    resetStudentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetStudents.pending, (state) => {
      // Only set loading to pending if we don't have data yet
      if (state.students.length === 0) {
        state.loading = "pending";
      }
      state.error = null;
    });
    builder.addCase(actGetStudents.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.students = action.payload;
    });
    builder.addCase(actGetStudents.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload == "string") {
        state.error = action.payload;
      }
    });

    // Create student cases
    builder.addCase(actCreateStudent.pending, (state) => {
      state.createLoading = "pending";
      state.error = null;
    });
    builder.addCase(actCreateStudent.fulfilled, (state, action) => {
      state.createLoading = "succeeded";
      state.students = [action.payload, ...state.students];
    });
    builder.addCase(actCreateStudent.rejected, (state, action) => {
      state.createLoading = "failed";
      if (action.payload && typeof action.payload == "string") {
        state.error = action.payload;
      }
    });

    // Update student cases
    builder.addCase(actUpdateStudent.pending, (state) => {
      state.error = null;
    });
    builder.addCase(actUpdateStudent.fulfilled, (state, action) => {
      const index = state.students.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    });
    builder.addCase(actUpdateStudent.rejected, (state, action) => {
      if (action.payload && typeof action.payload == "string") {
        state.error = action.payload;
      }
    });

    // Delete student cases
    builder.addCase(actDeleteStudent.pending, (state) => {
      state.error = null;
    });
    builder.addCase(actDeleteStudent.fulfilled, (state, action) => {
      state.students = state.students.filter(
        (student) => student.id !== action.payload,
      );
    });
    builder.addCase(actDeleteStudent.rejected, (state, action) => {
      if (action.payload && typeof action.payload == "string") {
        state.error = action.payload;
      }
    });
    // Get all students cases
    builder.addCase(actGetAllStudents.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });

    builder.addCase(actGetAllStudents.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.students = action.payload;
    });

    builder.addCase(actGetAllStudents.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });
  },
});

export const { addStudent, resetStudentsError } = studentsSlice.actions;
export const selectStudentsState = (state: RootState) => state.students;
export default studentsSlice.reducer;
