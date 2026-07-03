import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateStudentRequest, createStudent, CreateStudentResponse } from "../../../api/studentApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

const actCreateStudent = createAsyncThunk(
  "students/actCreateStudent",
  async (data: CreateStudentRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Create student payload:", data);
      const response = await createStudent(data);
      console.log("Create student response:", response);
      return response;
    } catch (error) {
      console.error("actCreateStudent error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actCreateStudent;
