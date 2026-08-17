import { createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateStudentRequest, updateStudent, CreateStudentResponse } from "../../../api/studentApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface UpdateStudentArgs {
  id: number;
  data: UpdateStudentRequest;
}

const actUpdateStudent = createAsyncThunk(
  "students/actUpdateStudent",
  async ({ id, data }: UpdateStudentArgs, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await updateStudent(id, data);
      return response;
    } catch (error) {
      console.error("actUpdateStudent error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actUpdateStudent;
