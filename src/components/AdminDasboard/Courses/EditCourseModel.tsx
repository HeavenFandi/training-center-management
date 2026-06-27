import React, { useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";

import { TCourse } from "../../../types/cardType";
import AuthInput from "../../Auth/AuthInput";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import actGetCategories from "../../../store/Courses/act/actGetCategories";
import { UpdateCourseRequest } from "../../../api/courseApi";

const editCourseSchema = z.object({
  title: z.string().min(1, "اسم الكورس مطلوب"),
  hoursCount: z.string().min(1, "عدد الساعات مطلوب"),
  categoryId: z.string().min(1, "التصنيف مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  requirements: z.string().min(1, "متطلبات الكورس مطلوبة"),
});

type EditCourseFormData = z.infer<typeof editCourseSchema>;

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
  onSave: (data: UpdateCourseRequest) => Promise<void>;
  tenantId: number;
  isLoading?: boolean;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  open,
  onClose,
  course,
  onSave,
  tenantId,
  isLoading = false,
}) => {
  const dispatch = useAppDispatch();
  const { categories, categoriesLoading, categoriesError } = useAppSelector(
    (state) => state.trainingSessions
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<EditCourseFormData>({
    resolver: zodResolver(editCourseSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (categories.length === 0 && categoriesLoading === "idle") {
      dispatch(actGetCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  useEffect(() => {
    if (open && course) {
      reset({
        title: course.title || course.name || "",
        hoursCount: String(course.hours || ""),
        categoryId: categories.find(cat => cat.name === (course.category || course.categoryName))?.id ? String(categories.find(cat => cat.name === (course.category || course.categoryName))?.id) : categories[0]?.id ? String(categories[0].id) : "1",
        description: course.description || "",
        requirements: course.requirements || "",
      });
    }
  }, [open, course, categories, reset]);

  const onSubmit = async (data: EditCourseFormData) => {
    if (!course) return;
    const payload: UpdateCourseRequest = {
      id: course.id,
      name: data.title,
      description: data.description,
      requirements: data.requirements,
      hours: parseInt(data.hoursCount, 10),
      categoryId: parseInt(data.categoryId, 10),
      tenantId: tenantId,
    };
    await onSave(payload);
  };

  if (!open || !course) return null;

  const isCategoriesLoading = categoriesLoading === "pending";

  return (
    <Dialog open={open} onClose={onClose} sx={{ direction: "rtl" }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: { xs: "90vw", sm: 500 },
          p: 3,
          borderRadius: "20px",
          backgroundColor: "#F8FAFC",
          fontFamily: "Tajawal",
        }}
      >
        <Typography fontWeight="bold" mb={2} sx={{ fontFamily: "Tajawal" }}>
          تعديل بيانات الكورس
        </Typography>

        <Stack spacing={2}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AuthInput
                label="اسم الكورس"
                placeholder="أدخل اسم الكورس"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
                compact
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <AuthInput
                label="عدد الساعات"
                placeholder="0"
                {...register("hoursCount")}
                error={!!errors.hoursCount}
                helperText={errors.hoursCount?.message}
                compact
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>التصنيف</InputLabel>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="التصنيف"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={isCategoriesLoading}
                      startAdornment={isCategoriesLoading ? (
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                      ) : null}
                    >
                      {isCategoriesLoading ? (
                        <MenuItem disabled value="">
                          جار تحميل التصنيفات...
                        </MenuItem>
                      ) : categoriesError ? (
                        <MenuItem disabled value="">
                          فشل تحميل التصنيفات
                        </MenuItem>
                      ) : (
                        categories.map((cat) => (
                          <MenuItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
                <FormHelperText error={!!errors.categoryId || !!categoriesError}>
                  {errors.categoryId?.message as string || categoriesError}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <AuthInput
                label="الوصف"
                placeholder="أدخل وصف الكورس"
                multiline
                rows={3}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
                compact
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <AuthInput
                label="(متطلبات الكورس / المدرب)"
                placeholder="أدخل متطلبات الكورس أو ملاحظات المدرب"
                multiline
                rows={2}
                {...register("requirements")}
                error={!!errors.requirements}
                helperText={errors.requirements?.message}
                compact
              />
            </Grid>
          </Grid>
        </Stack>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={!isValid || isLoading}
          sx={{
            backgroundColor: "#133E65",
            color: "white",
            borderRadius: "50px",
            padding: { xs: "6px 16px", sm: "6px 20px" },
            marginTop: "10px",
            fontWeight: "bold",
            fontSize: { xs: "0.75rem", sm: "1rem" },
            whiteSpace: "nowrap",
            boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
            "&:hover": { backgroundColor: "#0d2d4a" },
            "&:disabled": { backgroundColor: "#7a8b9f" },
          }}
        >
          {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "حفظ التعديلات"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditCourseModal;
