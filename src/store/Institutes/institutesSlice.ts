import { createSlice } from "@reduxjs/toolkit";
import actCreateInstitute from "./act/actCreateInstitute";
import actGetInstituteById from "./act/actGetInstituteById";
import actGetInstituteByTenantId from "./act/actGetInstituteByTenantId";
import actGetInstituteByUserId from "./act/actGetInstituteByUserId";
import actUpdateInstitute from "./act/actUpdateInstitute";
import actGetInstituteMonthlyRegistrations from "./act/actGetInstituteMonthlyRegistrations";
import actGetStudentsCount from "./act/actGetStudentsCount";

interface InstitutesState {
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  createdInstitute: any | null;
  currentInstitute: any | null;
  currentInstituteLoading: boolean;
  currentInstituteError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
  monthlyRegistrations: any[];
  monthlyRegistrationsLoading: boolean;
  monthlyRegistrationsError: string | null;
  studentsCount: number | null;
  studentsCountLoading: boolean;
  studentsCountError: string | null;
}

const initialState: InstitutesState = {
  createLoading: false,
  createError: null,
  createSuccess: false,
  createdInstitute: null,
  currentInstitute: null,
  currentInstituteLoading: false,
  currentInstituteError: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
  monthlyRegistrations: [],
  monthlyRegistrationsLoading: false,
  monthlyRegistrationsError: null,
  studentsCount: null,
  studentsCountLoading: false,
  studentsCountError: null,
};

const institutesSlice = createSlice({
  name: "institutes",
  initialState,
  reducers: {
    resetInstituteState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
      state.createdInstitute = null;
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateInstitute.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(actCreateInstitute.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        state.createSuccess = true;
        state.createdInstitute = action.payload;
        state.currentInstitute = action.payload;
      })
      .addCase(actCreateInstitute.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      })
      .addCase(actGetInstituteById.pending, (state) => {
        state.currentInstituteLoading = true;
        state.currentInstituteError = null;
      })
      .addCase(actGetInstituteById.fulfilled, (state, action) => {
        state.currentInstituteLoading = false;
        state.currentInstituteError = null;
        state.currentInstitute = action.payload;
      })
      .addCase(actGetInstituteById.rejected, (state, action) => {
        state.currentInstituteLoading = false;
        state.currentInstituteError = action.payload as string;
        state.currentInstitute = null;
      })
      .addCase(actGetInstituteByTenantId.pending, (state) => {
        state.currentInstituteLoading = true;
        state.currentInstituteError = null;
      })
      .addCase(actGetInstituteByTenantId.fulfilled, (state, action) => {
        state.currentInstituteLoading = false;
        state.currentInstituteError = null;
        state.currentInstitute = action.payload.length > 0 ? action.payload[0] : null;
      })
      .addCase(actGetInstituteByTenantId.rejected, (state, action) => {
        state.currentInstituteLoading = false;
        state.currentInstituteError = action.payload as string;
        state.currentInstitute = null;
      })
      .addCase(actGetInstituteByUserId.pending, (state) => {
        state.currentInstituteLoading = true;
        state.currentInstituteError = null;
      })
      .addCase(actGetInstituteByUserId.fulfilled, (state, action) => {
        state.currentInstituteLoading = false;
        state.currentInstituteError = null;
        state.currentInstitute = action.payload;
      })
      .addCase(actGetInstituteByUserId.rejected, (state, action) => {
        state.currentInstituteLoading = false;
        state.currentInstituteError = action.payload as string;
        state.currentInstitute = null;
      })
      .addCase(actUpdateInstitute.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(actUpdateInstitute.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        state.updateSuccess = true;
        state.currentInstitute = action.payload;
      })
      .addCase(actUpdateInstitute.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      })
      .addCase(actGetInstituteMonthlyRegistrations.pending, (state) => {
        state.monthlyRegistrationsLoading = true;
        state.monthlyRegistrationsError = null;
      })
      .addCase(actGetInstituteMonthlyRegistrations.fulfilled, (state, action) => {
        state.monthlyRegistrationsLoading = false;
        state.monthlyRegistrationsError = null;
        state.monthlyRegistrations = action.payload;
      })
      .addCase(actGetInstituteMonthlyRegistrations.rejected, (state, action) => {
        state.monthlyRegistrationsLoading = false;
        state.monthlyRegistrationsError = action.payload as string;
      })
      .addCase(actGetStudentsCount.pending, (state) => {
        state.studentsCountLoading = true;
        state.studentsCountError = null;
      })
      .addCase(actGetStudentsCount.fulfilled, (state, action) => {
        state.studentsCountLoading = false;
        state.studentsCountError = null;
        state.studentsCount = action.payload;
      })
      .addCase(actGetStudentsCount.rejected, (state, action) => {
        state.studentsCountLoading = false;
        state.studentsCountError = action.payload as string;
      });
  },
});

export { actCreateInstitute, actGetInstituteById, actGetInstituteByTenantId, actGetInstituteByUserId, actUpdateInstitute, actGetInstituteMonthlyRegistrations, actGetStudentsCount };
export const { resetInstituteState } = institutesSlice.actions;
export default institutesSlice.reducer;
