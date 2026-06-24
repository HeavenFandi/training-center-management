import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import { CourseFormData } from "../../../validation/CourseSchema";

import CloseIcon from "@mui/icons-material/Close";
import CourseFormFields from "./AddCourseComponents/CourseFormFields";
import AddCourseActionButtons from "./AddCourseComponents/AddCourseActionButtons";

import { useAddCourseForm } from "../../../hooks/adminDashboard/useAddCourseForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CourseFormData) => void;
  isLoading?: boolean;
}

const AddCourseModal: React.FC<Props> = ({ open, onClose, onSave, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    onError,
    handleFileChange,
    fileInputRef,
    control,
  } = useAddCourseForm({ onClose, onSave });

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit, onError)}
          sx={{ direction: "rtl" }}>
          <DialogContent
            sx={{
              borderRadius: "25px",
              backgroundColor: "#F8FAFC",
              p: { xs: 2, md: 3 },
              maxHeight: "95vh",
              overflowY: "auto",
            }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}>
              <IconButton onClick={onClose} sx={{ color: "#999" }} disabled={isLoading}>
                <CloseIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="h6"
                fontWeight="900"
                color="#1E3A5F"
                sx={{ fontSize: "1.1rem" }}>
                إضافة كورس جديد
              </Typography>
              <Box sx={{ width: { xs: 0, sm: 30 } }} />
            </Stack>

            <CourseFormFields register={register} errors={errors} control={control} />

            <AddCourseActionButtons onClose={onClose} isLoading={isLoading} />
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default AddCourseModal;


