import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

export interface Category {
  id: number;
  name: string;
}

const actGetCategories = createAsyncThunk(
  "trainingSessions/actGetCategories",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log("Fetching categories from API");
      const response = await axiosClient.get<Category[]>("/categories");
      console.log("Categories API Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetCategories;
