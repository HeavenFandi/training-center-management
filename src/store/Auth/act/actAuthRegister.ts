import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { SignUpType } from "../../../validation/SingUpSchema";
import axios from "axios";

interface BackendError {
  message?: string;
  errors?: Record<string, string[]>;
  error?: string;
}

const actAuthRegister = createAsyncThunk<
  any,
  SignUpType,
  { rejectValue: string | Record<string, string[]> }
>(
  "auth/actAuthRegister",
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      console.log("[DEBUG actAuthRegister] === STEP 1: Register Student (JSON) ===");
      console.log("[DEBUG actAuthRegister] Registration data.bio:", data.bio);

      // Step 1: Register student with JSON, no image file
      const registrationPayload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        confirmPassword: data.confirmPassword,
        contactInfo: String(data.phoneNumber).trim(),
        image: "", // Empty image for registration
        gender: data.gender,
        birthDate: data.birthDate,
        address: data.address?.trim() || "",
        interest: data.bio?.trim() || "",
        bio: data.bio?.trim() || "",
      };

      console.log("[DEBUG actAuthRegister] Registration payload.bio:", registrationPayload.bio);
      console.log("[DEBUG actAuthRegister] Registration payload:", JSON.stringify(registrationPayload, null, 2));

      const registrationResponse = await axiosClient.post("/students", registrationPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("[DEBUG actAuthRegister] Registration response:", registrationResponse.data);
      console.log("[DEBUG actAuthRegister] Registration response.bio:", registrationResponse.data?.bio);

      // Extract student ID from response
      const studentId = registrationResponse.data?.id || registrationResponse.data?.data?.id;

      if (!studentId) {
        console.error("[DEBUG actAuthRegister] Could not find student ID in registration response");
        return registrationResponse.data;
      }

      console.log("[DEBUG actAuthRegister] === STEP 2: Upload Profile Image ===");

      // Step 2: If image file exists, upload it in a separate request
      if (data.profileImage && data.profileImage instanceof File) {
        console.log("[DEBUG actAuthRegister] Uploading image for student ID:", studentId);

        const imageFormData = new FormData();
        imageFormData.append("file", data.profileImage);

        console.log("[DEBUG actAuthRegister] Image FormData entries:");
        for (const pair of imageFormData.entries()) {
          console.log("[IMAGE UPLOAD FORMDATA]", pair[0], pair[1]);
        }

        const imageUploadResponse = await axiosClient.put(
          `/students/${studentId}/profile-image`,
          imageFormData
        );

        console.log("[DEBUG actAuthRegister] Image Upload Response:", imageUploadResponse.data);
      } else {
        console.log("[DEBUG actAuthRegister] No profile image selected, skipping upload");
      }

      return registrationResponse.data;
    } catch (error) {
      console.error("[DEBUG actAuthRegister] Registration Failed:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverData = error.response?.data as BackendError;

        console.error("[DEBUG actAuthRegister] Full Error Details:", {
          status,
          statusText: error.response?.statusText,
          serverData,
          message: error.message,
          requestURL: error.config?.baseURL + error.config?.url,
          requestMethod: error.config?.method,
        });

        if (status === 400) {
          // Handle field-specific errors
          if (serverData?.errors && Object.keys(serverData.errors).length > 0) {
            console.error("[DEBUG actAuthRegister] 400 Bad Request - Field Errors:", serverData.errors);
            return rejectWithValue(serverData.errors);
          }
          const errorMsg =
            typeof serverData === "string"
              ? serverData
              : serverData?.message || serverData?.error || "يرجى التأكد من صحة البيانات المدخلة";
          return rejectWithValue(errorMsg);
        }

        if (status === 409) {
          const message =
            typeof serverData === "string" ? serverData : serverData?.message || JSON.stringify(serverData);
          console.error("[DEBUG actAuthRegister] 409 Conflict - Detailed Message:", message);

          // Check for field-specific conflicts
          if (serverData?.errors) {
            return rejectWithValue(serverData.errors);
          }

          let errorMessage = "هذا الحساب موجود بالفعل";
          if (message) {
            if (message.toLowerCase().includes("email")) {
              errorMessage = "البريد الإلكتروني مستخدم بالفعل";
            } else if (message.toLowerCase().includes("username")) {
              errorMessage = "اسم المستخدم محجوز بالفعل";
            } else if (message.toLowerCase().includes("contact")) {
              errorMessage = "رقم الاتصال مستخدم بالفعل";
            }
          }
          return rejectWithValue(errorMessage);
        }

        if (status === 500) {
          console.error("[DEBUG actAuthRegister] 500 Internal Server Error - Check backend logs");
          const errorMsg =
            typeof serverData === "string"
              ? serverData
              : serverData?.message || serverData?.error || "حدث خطأ في السيرفر، يرجى المحاولة لاحقاً";
          return rejectWithValue(errorMsg);
        }

        if (!error.response) {
          return rejectWithValue("خطأ في الاتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.");
        }

        const genericMessage =
          typeof serverData === "string"
            ? serverData
            : serverData?.message || serverData?.error || "حدث خطأ غير متوقع";
        return rejectWithValue(genericMessage);
      }

      return rejectWithValue(axiosErrorHandler(error));
    }
  },
);

export default actAuthRegister;
