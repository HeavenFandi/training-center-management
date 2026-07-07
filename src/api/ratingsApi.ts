import axiosClient from "./axiosClient";

export interface RatingReview {
  id: number;
  courseName: string;
  username: string;
  rating: number;
  review: string;
}

export const getTopRatings = async (limit?: number): Promise<RatingReview[]> => {
  const params = limit ? { limit } : {};
  const response = await axiosClient.get<RatingReview[]>("/ratings/top", {
    params,
  });
  return response.data;
};
