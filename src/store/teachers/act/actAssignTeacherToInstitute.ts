import { createAsyncThunk } from "@reduxjs/toolkit";
import { assignTeacherToInstitute, AssignTeacherToInstituteRequest } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

const actAssignTeacherToInstitute = createAsyncThunk(
  "teachers/actAssignTeacherToInstitute",
  async (data: AssignTeacherToInstituteRequest, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await assignTeacherToInstitute(data);
      return response;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAssignTeacherToInstitute;
