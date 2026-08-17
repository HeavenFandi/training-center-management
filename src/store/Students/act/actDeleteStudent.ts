import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { deleteStudent } from "../../../api/studentApi";
import { RootState } from "../../index";

const actDeleteStudent = createAsyncThunk(
  "students/actDeleteStudent",
  async (studentId: number, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    try {
      const state = getState() as RootState;
      const instituteId = state.institutes.currentInstitute?.id;
      
      if (!instituteId) {
        throw new Error("لم يتم العثور على معرف المعهد");
      }
      
      await deleteStudent(studentId, instituteId);
      return studentId;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actDeleteStudent;
