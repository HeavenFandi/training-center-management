import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { createCategory, CreateCategoryRequest, CreateCategoryResponse } from "../../../api/courseApi";

const actCreateCategory = createAsyncThunk<
  CreateCategoryResponse,
  CreateCategoryRequest,
  { rejectValue: string }
>("trainingSessions/actCreateCategory", async (data, { rejectWithValue }) => {
  try {
    const response = await createCategory(data);
    return response;
  } catch (error) {
    return rejectWithValue(axiosErrorHandler(error));
  }
});

export default actCreateCategory;
