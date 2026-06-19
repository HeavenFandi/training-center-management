import { createSlice, createSelector } from "@reduxjs/toolkit";
import {
  TTrainingSessionListItem,
  TTrainingSessionDetails,
} from "../../types/cardType";
import actGetTrainingSessions from "./act/actGetTrainingSessions";
import actSearchTrainingSessions from "./act/actSearchTrainingSessions";
import actGetTrainingSessionDetails from "./act/actGetTrainingSessionDetails";
import actGetFilteredTrainingSessions from "./act/actGetFilteredTrainingSessions";
import actAddCourseRating from "./act/actAddCourseRating";
import actEnrollInSession from "./act/actEnrollInSession";
import actInitiatePayment from "./act/actInitiatePayment";
import actGetCategories, { Category } from "./act/actGetCategories";
import actGetCourseRatings, { CourseRating } from "./act/actGetCourseRatings";
import actGetCourseAverageRating from "./act/actGetCourseAverageRating";
import { RootState } from "..";

interface AppliedFilters {
  institute: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
}

interface ITrainingSessionsState {
  trainingSessions: TTrainingSessionListItem[];

  selectedTrainingSession: TTrainingSessionDetails | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
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
}

const initialState: ITrainingSessionsState = {
  trainingSessions: [],
  selectedTrainingSession: null,
  loading: "idle",
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
  },
  extraReducers: (builder) => {
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
      state.loading = "pending";
      state.error = null;
      state.selectedTrainingSession = null;
    });
    builder.addCase(actGetTrainingSessionDetails.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.selectedTrainingSession = action.payload;
    });
    builder.addCase(actGetTrainingSessionDetails.rejected, (state, action) => {
      state.loading = "failed";
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
          name: action.payload.username,
          role: "طالب",
          text: action.payload.review,
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

    return trainingSessions.map((session: TTrainingSessionListItem) => ({
      id: session.id,
      title: session.title,
      institute: session.institute || "",
      price: session.price,
      category: session.category || "",
      location: session.location || "",
      image: session.image || "",
      teacherName: session.teacherName,
      duration: session.duration,
      availableSeats: session.availableSeats,
      status: session.status,
    }));
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
  actAddCourseRating,
  actEnrollInSession,
  actGetCategories,
  actGetCourseRatings,
  actGetCourseAverageRating,
};
export default trainingSessionsSlice.reducer;
