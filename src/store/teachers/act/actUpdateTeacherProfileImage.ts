import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateTeacherProfileImage, TeacherApiResponse } from "../../../api/teacherApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

interface UpdateTeacherProfileImagePayload {
  id: number;
  file: File;
}

const actUpdateTeacherProfileImage = createAsyncThunk(
  "teachers/actUpdateTeacherProfileImage",
  async ({ id, file }: UpdateTeacherProfileImagePayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Update teacher image id:", id);
      console.log("Update teacher image file:", file);
      const response = await updateTeacherProfileImage(id, file);
      return response;
    } catch (error) {
      console.error("actUpdateTeacherProfileImage error:", error);
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actUpdateTeacherProfileImage;
