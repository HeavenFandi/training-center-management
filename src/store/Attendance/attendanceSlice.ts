import { createSlice } from "@reduxjs/toolkit";
import actSaveAttendance from "./act/actSaveAttendance";
import actGetEnrollmentsBySession, {
  EnrollmentBySession,
} from "./act/actGetEnrollmentsBySession";
import actGetAttendanceByLecture, {
  AttendanceRecordResponse,
} from "./act/actGetAttendanceByLecture";

interface AttendanceState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  success: boolean;
  enrollments: EnrollmentBySession[];
  enrollmentsLoading: "idle" | "pending" | "succeeded" | "failed";
  enrollmentsError: string | null;
  attendanceRecords: AttendanceRecordResponse[];
  attendanceRecordsLoading: "idle" | "pending" | "succeeded" | "failed";
  attendanceRecordsError: string | null;
}

const initialState: AttendanceState = {
  loading: "idle",
  error: null,
  success: false,
  enrollments: [],
  enrollmentsLoading: "idle",
  enrollmentsError: null,
  attendanceRecords: [],
  attendanceRecordsLoading: "idle",
  attendanceRecordsError: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    resetAttendanceStatus: (state) => {
      state.loading = "idle";
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actSaveAttendance.pending, (state) => {
        state.loading = "pending";
        state.error = null;
        state.success = false;
      })
      .addCase(actSaveAttendance.fulfilled, (state) => {
        state.loading = "succeeded";
        state.success = true;
      })
      .addCase(actSaveAttendance.rejected, (state, action) => {
        state.loading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        }
      });
    builder.addCase(actGetEnrollmentsBySession.pending, (state) => {
      state.enrollmentsLoading = "pending";
      state.enrollmentsError = null;
    });

    builder.addCase(actGetEnrollmentsBySession.fulfilled, (state, action) => {
      state.enrollmentsLoading = "succeeded";
      state.enrollments = action.payload;
    });

    builder.addCase(actGetEnrollmentsBySession.rejected, (state, action) => {
      state.enrollmentsLoading = "failed";
      state.enrollmentsError =
        typeof action.payload === "string" ? action.payload : "حدث خطأ";
    });

    builder.addCase(actGetAttendanceByLecture.pending, (state) => {
      state.attendanceRecordsLoading = "pending";
      state.attendanceRecordsError = null;
    });

    builder.addCase(actGetAttendanceByLecture.fulfilled, (state, action) => {
      state.attendanceRecordsLoading = "succeeded";
      state.attendanceRecords = action.payload;
    });

    builder.addCase(actGetAttendanceByLecture.rejected, (state, action) => {
      state.attendanceRecordsLoading = "failed";
      state.attendanceRecordsError =
        typeof action.payload === "string" ? action.payload : "حدث خطأ";
    });
  },
});

export const { resetAttendanceStatus } = attendanceSlice.actions;

export default attendanceSlice.reducer;
