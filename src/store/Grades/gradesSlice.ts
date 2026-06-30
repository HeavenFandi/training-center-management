import { createSlice } from "@reduxjs/toolkit";
import actGetGradesByQuiz, { Grade } from "./act/actGetGradesByQuiz";
import actCreateGrade from "./act/actCreateGrade";
import actDeleteGrade from "./act/actDeleteGrade";
import actUpdateGrade from "./act/actUpdateGrade";

interface GradesState {
  grades: Grade[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GradesState = {
  grades: [],
  loading: "idle",
  error: null,
};

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetGradesByQuiz.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(actGetGradesByQuiz.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.grades = action.payload;
      })
      .addCase(actGetGradesByQuiz.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          typeof action.payload === "string" ? action.payload : "حدث خطأ";
      });
    builder.addCase(actCreateGrade.fulfilled, (state, action) => {
      state.grades.push(action.payload);
    });
    builder.addCase(actDeleteGrade.fulfilled, (state, action) => {
      state.grades = state.grades.filter(
        (grade) => grade.id !== action.payload,
      );
    });
    builder.addCase(actUpdateGrade.fulfilled, (state, action) => {
      state.grades = state.grades.map((grade) =>
        grade.id === action.payload.id ? action.payload : grade,
      );
    });
  },
});

export default gradesSlice.reducer;
