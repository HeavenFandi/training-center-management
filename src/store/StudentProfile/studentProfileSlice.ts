import { createSlice } from "@reduxjs/toolkit";
import actFetchProfile from "./act/actFetchProfile";
import actUpdateProfile from "./act/actUpdateProfile";
import actUpdateProfileImage from "./act/actUpdateProfileImage";
import actFetchTrainingHours from "./act/actFetchTrainingHours";
import actFetchCompletionPercentage from "./act/actFetchCompletionPercentage";
import actFetchWeeklySchedule from "./act/actFetchWeeklySchedule";
import actFetchActiveStudentCourses from "./act/actFetchActiveStudentCourses";
import { Student, WeeklyScheduleItem, ActiveCourse } from "../../types/studentDashboard";

interface StudentProfileState {
  profile: Student | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  success: boolean;
  imageUpdateLoading: boolean;
  imageUpdateError: string | null;
  trainingHours: number;
  trainingHoursLoading: boolean;
  trainingHoursError: string | null;
  completionPercentage: number;
  completionPercentageLoading: boolean;
  completionPercentageError: string | null;
  weeklySchedule: WeeklyScheduleItem[];
  scheduleLoading: boolean;
  scheduleError: string | null;
  activeCourses: ActiveCourse[];
  activeCoursesLoading: boolean;
  activeCoursesError: string | null;
}

const initialState: StudentProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  success: false,
  imageUpdateLoading: false,
  imageUpdateError: null,
  trainingHours: 0,
  trainingHoursLoading: false,
  trainingHoursError: null,
  completionPercentage: 0,
  completionPercentageLoading: false,
  completionPercentageError: null,
  weeklySchedule: [],
  scheduleLoading: false,
  scheduleError: null,
  activeCourses: [],
  activeCoursesLoading: false,
  activeCoursesError: null,
};

const studentProfileSlice = createSlice({
  name: "studentProfile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.error = null;
      state.updateError = null;
      state.imageUpdateError = null;
      state.trainingHoursError = null;
      state.completionPercentageError = null;
      state.scheduleError = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actFetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actFetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        // Update localStorage user data
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.image = action.payload.image;
          user.student = action.payload;
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(actFetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(actUpdateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.success = false;
      })
      .addCase(actUpdateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload;
        state.updateError = null;
        state.success = true;
        // Update localStorage user data
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.image = action.payload.image;
          user.student = action.payload;
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(actUpdateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.success = false;
      });

    builder
      .addCase(actUpdateProfileImage.pending, (state) => {
        state.imageUpdateLoading = true;
        state.imageUpdateError = null;
      })
      .addCase(actUpdateProfileImage.fulfilled, (state, action) => {
        state.imageUpdateLoading = false;
        state.profile = action.payload;
        state.imageUpdateError = null;
        // Update localStorage user data with new image
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          user.image = action.payload.image;
          user.student = action.payload;
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(actUpdateProfileImage.rejected, (state, action) => {
        state.imageUpdateLoading = false;
        state.imageUpdateError = action.payload as string;
      });

    builder
      .addCase(actFetchTrainingHours.pending, (state) => {
        state.trainingHoursLoading = true;
        state.trainingHoursError = null;
      })
      .addCase(actFetchTrainingHours.fulfilled, (state, action) => {
        state.trainingHoursLoading = false;
        state.trainingHours = action.payload;
        state.trainingHoursError = null;
      })
      .addCase(actFetchTrainingHours.rejected, (state, action) => {
        state.trainingHoursLoading = false;
        state.trainingHoursError = action.payload as string;
      });

    builder
      .addCase(actFetchCompletionPercentage.pending, (state) => {
        state.completionPercentageLoading = true;
        state.completionPercentageError = null;
      })
      .addCase(actFetchCompletionPercentage.fulfilled, (state, action) => {
        state.completionPercentageLoading = false;
        state.completionPercentage = action.payload;
        state.completionPercentageError = null;
      })
      .addCase(actFetchCompletionPercentage.rejected, (state, action) => {
        state.completionPercentageLoading = false;
        state.completionPercentageError = action.payload as string;
      });

    builder
      .addCase(actFetchWeeklySchedule.pending, (state) => {
        state.scheduleLoading = true;
        state.scheduleError = null;
      })
      .addCase(actFetchWeeklySchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.weeklySchedule = action.payload;
        state.scheduleError = null;
      })
      .addCase(actFetchWeeklySchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleError = action.payload as string;
      });

    builder
      .addCase(actFetchActiveStudentCourses.pending, (state) => {
        state.activeCoursesLoading = true;
        state.activeCoursesError = null;
      })
      .addCase(actFetchActiveStudentCourses.fulfilled, (state, action) => {
        state.activeCoursesLoading = false;
        state.activeCourses = action.payload;
        state.activeCoursesError = null;
      })
      .addCase(actFetchActiveStudentCourses.rejected, (state, action) => {
        state.activeCoursesLoading = false;
        state.activeCoursesError = action.payload as string;
      });
  },
});

export { actFetchProfile, actUpdateProfile, actUpdateProfileImage, actFetchTrainingHours, actFetchCompletionPercentage, actFetchWeeklySchedule, actFetchActiveStudentCourses };
export const { resetProfileState } = studentProfileSlice.actions;
export default studentProfileSlice.reducer;
