import { createSlice } from "@reduxjs/toolkit";
import actCreateQuiz, { Quiz } from "./act/actCreateQuiz";
import actGetQuizzes from "./act/actGetQuizzes";
import actDeleteQuiz from "./act/actDeleteQuiz";
import actUpdateQuiz from "./act/actUpdateQuiz";
interface QuizzesState {
  quizzes: Quiz[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;

  createLoading: "idle" | "pending" | "succeeded" | "failed";
  createError: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  loading: "idle",
  error: null,

  createLoading: "idle",
  createError: null,
};
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetQuizzes.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(actGetQuizzes.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.quizzes = action.payload;
      })
      .addCase(actGetQuizzes.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
    builder
      .addCase(actCreateQuiz.pending, (state) => {
        state.createLoading = "pending";
        state.createError = null;
      })
      .addCase(actCreateQuiz.fulfilled, (state, action) => {
        state.createLoading = "succeeded";
        state.quizzes = [action.payload, ...state.quizzes];
      })
      .addCase(actCreateQuiz.rejected, (state, action) => {
        state.createLoading = "failed";
        state.createError =
          action.payload && typeof action.payload === "string"
            ? action.payload
            : "حدث خطأ أثناء إنشاء الاختبار";
      });
    // actDeleteQuiz
    builder.addCase(actDeleteQuiz.fulfilled, (state, action) => {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz.id !== action.payload,
      );
    });
    // actUpdateQuiz
    builder.addCase(actUpdateQuiz.fulfilled, (state, action) => {
      state.quizzes = state.quizzes.map((quiz) =>
        quiz.id === action.payload.id ? action.payload : quiz,
      );
    });
  },
});

export default quizzesSlice.reducer;
