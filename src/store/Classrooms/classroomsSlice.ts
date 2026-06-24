import { createSlice } from "@reduxjs/toolkit";
import actGetClassroomsByInstituteId from "./act/actGetClassroomsByInstituteId";
import actUpdateClassroom from "./act/actUpdateClassroom";
import actCreateClassroom from "./act/actCreateClassroom";
import actDeleteClassroom from "./act/actDeleteClassroom";
import { Classroom } from "../../api/classroomApi";

interface ClassroomsState {
  list: Classroom[];
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  createLoading: boolean;
  createError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: ClassroomsState = {
  list: [],
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  createLoading: false,
  createError: null,
  deleteLoading: false,
  deleteError: null,
};

const classroomsSlice = createSlice({
  name: "classrooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetClassroomsByInstituteId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetClassroomsByInstituteId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload;
      })
      .addCase(actGetClassroomsByInstituteId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(actUpdateClassroom.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(actUpdateClassroom.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(actUpdateClassroom.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      .addCase(actCreateClassroom.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(actCreateClassroom.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        state.list.push(action.payload);
      })
      .addCase(actCreateClassroom.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })
      .addCase(actDeleteClassroom.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(actDeleteClassroom.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.list = state.list.filter(c => c.id !== action.payload);
      })
      .addCase(actDeleteClassroom.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export { actGetClassroomsByInstituteId, actUpdateClassroom, actCreateClassroom, actDeleteClassroom };
export default classroomsSlice.reducer;
