import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  TTrainingSessionListItem,
  TTrainingSessionDetails,
} from "../../types/cardType";
import { LectureResponse } from "../../api/trainingSessionApi";
import actGetTrainingSessions from "./act/actGetTrainingSessions";
import actSearchTrainingSessions from "./act/actSearchTrainingSessions";
import actGetTrainingSessionDetails from "./act/actGetTrainingSessionDetails";
import actGetFilteredTrainingSessions from "./act/actGetFilteredTrainingSessions";
import actGetActiveOrUpcomingByCourseAndInstitute from "./act/actGetActiveOrUpcomingByCourseAndInstitute";
import actAddCourseRating from "./act/actAddCourseRating";
import actEnrollInSession from "./act/actEnrollInSession";
import actInitiatePayment from "./act/actInitiatePayment";
import actGetCategories, { Category } from "./act/actGetCategories";
import actGetCourseRatings, { CourseRating } from "./act/actGetCourseRatings";
import actGetCourseAverageRating from "./act/actGetCourseAverageRating";
import actGetLecturesBySessionId from "./act/actGetLecturesBySessionId";
import actUpdateLecture from "./act/actUpdateLecture";
import actDeleteLecture from "./act/actDeleteLecture";
import actDeleteTrainingSession from "./act/actDeleteTrainingSession";
import actCreateLecture from "./act/actCreateLecture";
import actGetAllLectures from "./act/actGetAllLectures";
import actUpdateTrainingSession from "./act/actUpdateTrainingSession";
import { RootState } from "..";
import actGetActiveTrainingSessions, {
  TrainingSession,
} from "../TrainingSessions/actGetActiveTrainingSessions";
interface AppliedFilters {
  institute: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
}

interface ITrainingSessionsState {
  trainingSessions: TTrainingSessionListItem[];

  activeSessions: TrainingSession[];
  activeSessionsLoading: "idle" | "pending" | "succeeded" | "failed";
  activeSessionsError: string | null;

  selectedTrainingSession: TTrainingSessionDetails | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  sessionDetailsLoading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  addRatingLoading: boolean;
  addRatingError: string | null;

  categories: Category[];
  categoriesLoading: "idle" | "pending" | "succeeded" | "failed";
  categoriesError: string | null;

  ratings: CourseRating[];
  ratingsLoading: "idle" | "pending" | "succeeded" | "failed";
  ratingsError: string | null;

  averageRating: number | null;
  averageRatingLoading: "idle" | "pending" | "succeeded" | "failed";
  averageRatingError: string | null;

  searchTerm: string;
  instituteInput: string;
  categoryInput: string;
  minPriceInput: string;
  maxPriceInput: string;
  locationInput: string;
  appliedFilters: AppliedFilters;
  page: number;

  courseSessions: Record<number, TTrainingSessionListItem[]>;
  courseSessionsLoading: Record<number, boolean>;
  courseSessionsError: Record<number, string | null>;

  sessionLectures: Record<number, LectureResponse[]>;
  sessionLecturesLoading: Record<number, boolean>;
  sessionLecturesError: Record<number, string | null>;

  lectureUpdateLoading: boolean;
  lectureUpdateError: string | null;

  deletingLectureId: number | null;
  lectureDeleteError: string | null;
  deletingSessionId: number | null;
  sessionDeleteError: string | null;
  lectureCreateLoading: boolean;
  lectureCreateError: string | null;

  allLectures: LectureResponse[];
  allLecturesLoading: "idle" | "pending" | "succeeded" | "failed";
  allLecturesError: string | null;
}

const initialState: ITrainingSessionsState = {
  trainingSessions: [],
  activeSessions: [],
  activeSessionsLoading: "idle",
  activeSessionsError: null,
  selectedTrainingSession: null,
  loading: "idle",
  sessionDetailsLoading: "idle",
  error: null,
  addRatingLoading: false,
  addRatingError: null,
  categories: [],
  categoriesLoading: "idle",
  categoriesError: null,
  ratings: [],
  ratingsLoading: "idle",
  ratingsError: null,
  averageRating: null,
  averageRatingLoading: "idle",
  averageRatingError: null,
  searchTerm: "",
  instituteInput: "",
  categoryInput: "",
  minPriceInput: "",
  maxPriceInput: "",
  locationInput: "",
  appliedFilters: {
    institute: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
  },
  page: 1,
  courseSessions: {},
  courseSessionsLoading: {},
  courseSessionsError: {},
  sessionLectures: {},
  sessionLecturesLoading: {},
  sessionLecturesError: {},
  lectureUpdateLoading: false,
  lectureUpdateError: null,
  deletingLectureId: null,
  lectureDeleteError: null,
  deletingSessionId: null,
  sessionDeleteError: null,
  lectureCreateLoading: false,
  lectureCreateError: null,
  allLectures: [],
  allLecturesLoading: "idle",
  allLecturesError: null,
};

const trainingSessionsSlice = createSlice({
  name: "trainingSessions",
  initialState: initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setInstituteInput: (state, action) => {
      state.instituteInput = action.payload;
    },
    setCategoryInput: (state, action) => {
      state.categoryInput = action.payload;
    },
    setMinPriceInput: (state, action) => {
      state.minPriceInput = action.payload;
    },
    setMaxPriceInput: (state, action) => {
      state.maxPriceInput = action.payload;
    },
    setLocationInput: (state, action) => {
      state.locationInput = action.payload;
    },
    applyFilters: (state) => {
      state.appliedFilters = {
        institute: state.instituteInput,
        category: state.categoryInput,
        minPrice: state.minPriceInput,
        maxPrice: state.maxPriceInput,
        location: state.locationInput,
      };
      state.page = 1;
    },
    resetFilters: (state) => {
      state.searchTerm = "";
      state.instituteInput = "";
      state.categoryInput = "";
      state.minPriceInput = "";
      state.maxPriceInput = "";
      state.locationInput = "";
      state.appliedFilters = {
        institute: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        location: "",
      };
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearDeleteSessionState: (state) => {
      state.deletingSessionId = null;
      state.sessionDeleteError = null;
    },
    clearDeleteLectureState: (state) => {
      state.deletingLectureId = null;
      state.lectureDeleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      actGetActiveOrUpcomingByCourseAndInstitute.pending,
      (state, action) => {
        const courseId = action.meta.arg.courseId;
        state.courseSessionsLoading[courseId] = true;
        state.courseSessionsError[courseId] = null;
      },
    );
    builder.addCase(
      actGetActiveOrUpcomingByCourseAndInstitute.fulfilled,
      (state, action) => {
        const courseId = action.meta.arg.courseId;
        state.courseSessionsLoading[courseId] = false;
        state.courseSessions[courseId] = action.payload;
      },
    );
    builder.addCase(
      actGetActiveOrUpcomingByCourseAndInstitute.rejected,
      (state, action) => {
        const courseId = action.meta.arg.courseId;
        state.courseSessionsLoading[courseId] = false;
        if (action.payload && typeof action.payload == "string")
          state.courseSessionsError[courseId] = action.payload;
      },
    );
    builder.addCase(actGetCategories.pending, (state) => {
      state.categoriesLoading = "pending";
      state.categoriesError = null;
    });
    builder.addCase(actGetCategories.fulfilled, (state, action) => {
      state.categoriesLoading = "succeeded";
      state.categories = action.payload;
    });
    builder.addCase(actGetCategories.rejected, (state, action) => {
      state.categoriesLoading = "failed";
      if (action.payload && typeof action.payload == "string")
        state.categoriesError = action.payload;
    });

    builder.addCase(actGetTrainingSessions.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetTrainingSessions.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.trainingSessions = action.payload;
    });
    builder.addCase(actGetTrainingSessions.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload == "string")
        state.error = action.payload;
    });

    // actSearchTrainingSessions
    builder.addCase(actSearchTrainingSessions.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actSearchTrainingSessions.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.trainingSessions = action.payload;
    });
    builder.addCase(actSearchTrainingSessions.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload == "string")
        state.error = action.payload;
    });

    builder.addCase(actGetTrainingSessionDetails.pending, (state) => {
      state.sessionDetailsLoading = "pending";
      state.error = null;
      state.selectedTrainingSession = null;
    });
    builder.addCase(actGetTrainingSessionDetails.fulfilled, (state, action) => {
      state.sessionDetailsLoading = "succeeded";
      state.selectedTrainingSession = action.payload;
    });
    builder.addCase(actGetTrainingSessionDetails.rejected, (state, action) => {
      state.sessionDetailsLoading = "failed";
      if (action.payload && typeof action.payload == "string")
        state.error = action.payload;
    });

    builder.addCase(actGetFilteredTrainingSessions.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(
      actGetFilteredTrainingSessions.fulfilled,
      (state, action) => {
        state.loading = "succeeded";
        state.trainingSessions = action.payload;
      },
    );
    builder.addCase(
      actGetFilteredTrainingSessions.rejected,
      (state, action) => {
        state.loading = "failed";
        if (action.payload && typeof action.payload == "string")
          state.error = action.payload;
      },
    );

    // actAddCourseRating
    builder.addCase(actAddCourseRating.pending, (state) => {
      state.addRatingLoading = true;
      state.addRatingError = null;
    });
    builder.addCase(actAddCourseRating.fulfilled, (state, action) => {
      state.addRatingLoading = false;
      state.addRatingError = null;
      if (
        state.selectedTrainingSession &&
        state.selectedTrainingSession.id === action.payload.courseId
      ) {
        // إذا كان التقييم لنفس الدورة المختارة، نقوم بإضافته للمراجعات
        const newReview = {
          id: action.payload.id,
          username: action.payload.username,
          name: action.payload.username,
          role: "طالب",
          text: action.payload.review,
          review: action.payload.review,
          rating: action.payload.rating,
          image: "https://via.placeholder.com/150", // افتراضي
        };
        state.selectedTrainingSession.reviews = [
          ...(state.selectedTrainingSession.reviews || []),
          newReview,
        ];
      }
    });
    builder.addCase(actAddCourseRating.rejected, (state, action) => {
      state.addRatingLoading = false;
      if (action.payload && typeof action.payload == "string")
        state.addRatingError = action.payload;
    });

    // actEnrollInSession
    builder.addCase(actEnrollInSession.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actEnrollInSession.fulfilled, (state) => {
      state.loading = "succeeded";
    });
    builder.addCase(actEnrollInSession.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload == "string")
        state.error = action.payload;
    });

    // actInitiatePayment
    builder.addCase(actInitiatePayment.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actInitiatePayment.fulfilled, (state) => {
      state.loading = "succeeded";
    });
    builder.addCase(actInitiatePayment.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload == "string")
        state.error = action.payload;
    });

    // actGetCourseRatings
    builder.addCase(actGetCourseRatings.pending, (state) => {
      state.ratingsLoading = "pending";
      state.ratingsError = null;
    });
    builder.addCase(actGetCourseRatings.fulfilled, (state, action) => {
      state.ratingsLoading = "succeeded";
      state.ratings = action.payload;
      state.ratingsError = null;
      console.log("ratings fulfilled:", action.payload);
    });
    builder.addCase(actGetCourseRatings.rejected, (state, action) => {
      state.ratingsLoading = "failed";
      state.ratings = [];
      state.ratingsError =
        action.payload && typeof action.payload == "string"
          ? action.payload
          : null;
    });

    // actGetCourseAverageRating
    builder.addCase(actGetCourseAverageRating.pending, (state) => {
      state.averageRatingLoading = "pending";
      state.averageRatingError = null;
    });
    builder.addCase(actGetCourseAverageRating.fulfilled, (state, action) => {
      state.averageRatingLoading = "succeeded";
      state.averageRating = action.payload;
      state.averageRatingError = null;
    });
    builder.addCase(actGetCourseAverageRating.rejected, (state, action) => {
      state.averageRatingLoading = "failed";
      state.averageRating = null;
      state.averageRatingError =
        action.payload && typeof action.payload == "string"
          ? action.payload
          : null;
    });

    // actGetLecturesBySessionId
    builder.addCase(actGetLecturesBySessionId.pending, (state, action) => {
      const sessionId = action.meta.arg;
      state.sessionLecturesLoading[sessionId] = true;
      state.sessionLecturesError[sessionId] = null;
    });
    builder.addCase(actGetLecturesBySessionId.fulfilled, (state, action) => {
      const { sessionId, lectures } = action.payload;
      state.sessionLecturesLoading[sessionId] = false;
      state.sessionLectures[sessionId] = lectures;
      state.sessionLecturesError[sessionId] = null;
    });
    builder.addCase(actGetLecturesBySessionId.rejected, (state, action) => {
      const sessionId = action.meta.arg;
      state.sessionLecturesLoading[sessionId] = false;
      if (action.payload && typeof action.payload == "string")
        state.sessionLecturesError[sessionId] = action.payload;
    });

    // actUpdateLecture
    builder.addCase(actUpdateLecture.pending, (state) => {
      state.lectureUpdateLoading = true;
      state.lectureUpdateError = null;
    });
    builder.addCase(actUpdateLecture.rejected, (state, action) => {
      state.lectureUpdateLoading = false;
      if (action.payload && typeof action.payload == "string")
        state.lectureUpdateError = action.payload;
    });

    // actDeleteLecture
    builder.addCase(actDeleteLecture.pending, (state, action) => {
      state.deletingLectureId = action.meta.arg;
      state.lectureDeleteError = null;
    });
    builder.addCase(actDeleteLecture.rejected, (state, action) => {
      // Reset deletingLectureId so modal isn't stuck loading, but keep error
      state.deletingLectureId = null;
      if (action.payload && typeof action.payload == "string")
        state.lectureDeleteError = action.payload;
    });

    // actCreateLecture
    builder.addCase(actCreateLecture.pending, (state) => {
      state.lectureCreateLoading = true;
      state.lectureCreateError = null;
    });
    builder.addCase(actCreateLecture.fulfilled, (state, action) => {
      state.lectureCreateLoading = false;
      state.lectureCreateError = null;
      const newLecture = action.payload;
      let sessionId = newLecture.sessionId;
      // Fallback to sessionId from action's argument if newLecture doesn't have it
      if (!sessionId) {
        sessionId = action.meta.arg.sessionId;
      }
      if (sessionId && state.sessionLectures[sessionId]) {
        state.sessionLectures[sessionId] = [
          ...state.sessionLectures[sessionId],
          newLecture,
        ];
      }
      // Also add to allLectures
      state.allLectures = [...state.allLectures, newLecture];
    });
    builder.addCase(actCreateLecture.rejected, (state, action) => {
      state.lectureCreateLoading = false;
      if (action.payload && typeof action.payload == "string")
        state.lectureCreateError = action.payload;
    });

    // actGetAllLectures
    builder.addCase(actGetAllLectures.pending, (state) => {
      state.allLecturesLoading = "pending";
      state.allLecturesError = null;
    });
    builder.addCase(actGetAllLectures.fulfilled, (state, action) => {
      state.allLecturesLoading = "succeeded";
      state.allLectures = action.payload;
    });
    builder.addCase(actGetAllLectures.rejected, (state, action) => {
      state.allLecturesLoading = "failed";
      if (action.payload && typeof action.payload == "string")
        state.allLecturesError = action.payload;
    });

    // When a lecture is updated, also update it in allLectures
    builder.addCase(actUpdateLecture.fulfilled, (state, action) => {
      state.lectureUpdateLoading = false;
      state.lectureUpdateError = null;
      // Update the lecture in sessionLectures
      const updatedLecture = action.payload;
      let sessionId = updatedLecture.sessionId;
      // Fallback to sessionId from action.meta.arg.data if not present in updatedLecture
      if (!sessionId && action.meta.arg?.data?.sessionId) {
        sessionId = action.meta.arg.data.sessionId;
      }
      if (sessionId && state.sessionLectures[sessionId]) {
        state.sessionLectures[sessionId] = state.sessionLectures[sessionId].map(
          (lecture) =>
            lecture.id === updatedLecture.id ? updatedLecture : lecture,
        );
      }
      // Also update in allLectures
      state.allLectures = state.allLectures.map((lecture) =>
        lecture.id === updatedLecture.id ? updatedLecture : lecture,
      );
    });

    // When a lecture is deleted, also remove it from allLectures
    builder.addCase(actDeleteLecture.fulfilled, (state, action) => {
      state.deletingLectureId = null;
      state.lectureDeleteError = null;
      // Remove the deleted lecture from sessionLectures
      const deletedLectureId = action.meta.arg;
      // We need to find which session this lecture belonged to
      for (const sessionId in state.sessionLectures) {
        if (
          state.sessionLectures[sessionId].some(
            (lecture) => lecture.id === deletedLectureId,
          )
        ) {
          state.sessionLectures[sessionId] = state.sessionLectures[
            sessionId
          ].filter((lecture) => lecture.id !== deletedLectureId);
          break;
        }
      }
      // Also remove from allLectures
      state.allLectures = state.allLectures.filter(
        (lecture) => lecture.id !== deletedLectureId,
      );
    });

    // actUpdateTrainingSession
    builder.addCase(actUpdateTrainingSession.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actUpdateTrainingSession.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.error = null;
      // Update selectedTrainingSession, convert TimeObject to string if needed
      const payload = action.payload as any;
      state.selectedTrainingSession = {
        ...payload,
        startTime: typeof payload.startTime === "object" 
          ? `${String(payload.startTime.hour).padStart(2, "0")}:${String(payload.startTime.minute).padStart(2, "0")}:00` 
          : payload.startTime,
        endTime: typeof payload.endTime === "object" 
          ? `${String(payload.endTime.hour).padStart(2, "0")}:${String(payload.endTime.minute).padStart(2, "0")}:00` 
          : payload.endTime,
      } as any;
      // Update trainingSessions list
      state.trainingSessions = state.trainingSessions.map((session) =>
        session.id === action.payload.id ? {
          ...session,
          ...(action.payload as any),
        } as any : session
      );
      // Update courseSessions
      for (const courseId in state.courseSessions) {
        if (state.courseSessions[courseId]) {
          state.courseSessions[courseId] = state.courseSessions[courseId].map(
            (session) =>
              session.id === action.payload.id ? {
                ...session,
                ...(action.payload as any),
              } as any : session
          );
        }
      }
    });
    builder.addCase(actUpdateTrainingSession.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string")
        state.error = action.payload;
    });
    // actDeleteTrainingSession
    builder.addCase(actDeleteTrainingSession.pending, (state, action) => {
      state.deletingSessionId = action.meta.arg;
      state.sessionDeleteError = null;
    });
    builder.addCase(actDeleteTrainingSession.fulfilled, (state, action) => {
      state.deletingSessionId = null;
      state.sessionDeleteError = null;
      // Remove the deleted session from trainingSessions
      state.trainingSessions = state.trainingSessions.filter(
        (session) => session.id !== action.payload,
      );
      // Remove from activeSessions
      state.activeSessions = state.activeSessions.filter(
        (session) => session.id !== action.payload,
      );
      // Also remove from courseSessions if exists
      for (const courseId in state.courseSessions) {
        if (state.courseSessions[courseId]) {
          state.courseSessions[courseId] = state.courseSessions[
            courseId
          ].filter((session) => session.id !== action.payload);
        }
      }
    });
    builder.addCase(actDeleteTrainingSession.rejected, (state, action) => {
      // Reset deletingSessionId so modal isn't stuck loading, but keep error
      state.deletingSessionId = null;
      if (action.payload && typeof action.payload == "string")
        state.sessionDeleteError = action.payload;
    });
    // actGetActiveTrainingSessions
    builder.addCase(actGetActiveTrainingSessions.pending, (state) => {
      state.activeSessionsLoading = "pending";
      state.activeSessionsError = null;
    });

    builder.addCase(actGetActiveTrainingSessions.fulfilled, (state, action) => {
      state.activeSessionsLoading = "succeeded";
      state.activeSessions = action.payload;
    });

    builder.addCase(actGetActiveTrainingSessions.rejected, (state, action) => {
      state.activeSessionsLoading = "failed";
      state.activeSessionsError =
        action.payload && typeof action.payload === "string"
          ? action.payload
          : "حدث خطأ";
    });
  },
});
export const {
  setSearchTerm,
  setInstituteInput,
  setCategoryInput,
  setMinPriceInput,
  setMaxPriceInput,
  setLocationInput,
  applyFilters,
  resetFilters,
  setPage,
  clearDeleteSessionState,
  clearDeleteLectureState,
} = trainingSessionsSlice.actions;
const selectTrainingSessionsState = (state: RootState) =>
  state.trainingSessions;

export const selectIsFiltered = createSelector(
  [selectTrainingSessionsState],
  (state) => {
    const { appliedFilters } = state;
    return (
      appliedFilters.institute !== "" ||
      appliedFilters.category !== "" ||
      appliedFilters.minPrice !== "" ||
      appliedFilters.maxPrice !== "" ||
      appliedFilters.location !== ""
    );
  },
);

export const selectSessions = createSelector(
  [selectTrainingSessionsState],
  (state) => {
    const { trainingSessions } = state;
    if (!Array.isArray(trainingSessions)) return [];

    return trainingSessions;
  },
);

export const selectCategories = createSelector(
  [selectTrainingSessionsState],
  (state) => {
    const { trainingSessions } = state;
    return Array.isArray(trainingSessions)
      ? [
          ...new Set(
            trainingSessions.map((session) => session.category).filter(Boolean),
          ),
        ]
      : [];
  },
);

export const selectFilteredTrainingSessions = createSelector(
  [selectSessions, selectTrainingSessionsState],
  (sessions, state) => {
    const { searchTerm, loading } = state;

    if (loading === "pending" || !Array.isArray(sessions)) return [];

    return sessions.filter((session: TTrainingSessionListItem) => {
      const matchesSearch =
        !searchTerm.trim() ||
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.institute &&
          session.institute.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (session.teacherName &&
          session.teacherName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Note: We don't re-filter by institute, category, price, or location here
      // because these are handled by the server in actGetFilteredTrainingSessions.
      // Re-filtering on the client can lead to issues if the mapping is not perfect.

      return matchesSearch;
    });
  },
);

export const selectTotalPages = createSelector(
  [selectFilteredTrainingSessions],
  (filtered) => {
    const ITEMS_PER_PAGE = 8;
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  },
);

export const selectPaginatedTrainingSessions = createSelector(
  [
    selectFilteredTrainingSessions,
    (state: RootState) => state.trainingSessions.page,
  ],
  (filtered, page) => {
    const ITEMS_PER_PAGE = 8;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  },
);

export {
  actGetTrainingSessions,
  actSearchTrainingSessions,
  actGetTrainingSessionDetails,
  actGetFilteredTrainingSessions,
  actGetActiveOrUpcomingByCourseAndInstitute,
  actAddCourseRating,
  actEnrollInSession,
  actGetCategories,
  actGetCourseRatings,
  actGetCourseAverageRating,
  actGetLecturesBySessionId,
  actUpdateLecture,
  actDeleteLecture,
  actCreateLecture,
  actGetAllLectures,
  actUpdateTrainingSession,
};
export default trainingSessionsSlice.reducer;
