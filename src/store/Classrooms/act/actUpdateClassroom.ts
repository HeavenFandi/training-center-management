import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateClassroom, UpdateClassroomRequest, Classroom } from "../../../api/classroomApi";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

type UpdateClassroomPayload = {
  id: number;
  data: UpdateClassroomRequest;
};

const actUpdateClassroom = createAsyncThunk(
  "classrooms/actUpdateClassroom",
  async ({ id, data }: UpdateClassroomPayload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await updateClassroom(id, data);
      return response;
    } catch (error) {
      const errorMsg = axiosErrorHandler(error);
      return rejectWithValue(errorMsg);
    }
  },
);

export default actUpdateClassroom;
