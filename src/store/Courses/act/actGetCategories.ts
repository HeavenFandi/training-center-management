import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { RootState } from "../../index";

export interface Category {
  id: number;
  name: string;
}

const actGetCategories = createAsyncThunk(
  "trainingSessions/actGetCategories",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    
    // If we already have categories data and fetch succeeded, don't fetch again
    if (state.trainingSessions.categories.length > 0 && state.trainingSessions.categoriesLoading === "succeeded") {
      return state.trainingSessions.categories;
    }
    
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
