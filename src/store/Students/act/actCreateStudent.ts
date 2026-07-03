import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateStudentRequest, createStudent, CreateStudentResponse } from "../../../api/studentApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actCreateStudent = createAsyncThunk(
  "students/actCreateStudent",
  async (data: CreateStudentRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await createStudent(data);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actCreateStudent;
