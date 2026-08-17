import React, { useEffect } from "react";
import {
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import {
  UseFormRegister,
  FieldErrors,
  useController,
  Control,
} from "react-hook-form";
import AuthInput from "../../../Auth/AuthInput";
import { CourseFormData } from "../../../../validation/CourseSchema";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import actGetCategories from "../../../../store/Courses/act/actGetCategories";

interface CourseFormFieldsProps {
  register: UseFormRegister<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
  control: Control<CourseFormData>;
}

const CourseFormFields: React.FC<CourseFormFieldsProps> = ({
  register,
  errors,
  control,
}) => {
  const dispatch = useAppDispatch();
  const { categories, categoriesLoading, categoriesError } = useAppSelector(
    (state) => state.trainingSessions,
  );

  useEffect(() => {
    if (categories.length === 0 && categoriesLoading === "idle") {
      dispatch(actGetCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  const {
    field,
    fieldState: { isDirty, isTouched, invalid },
  } = useController({
    name: "categoryId",
    control,
    defaultValue: categories.length > 0 ? String(categories[0].id) : "1",
  });

  const handleSelectChange = (event: any) => {
    field.onChange(event);
  };

  const isLoading = categoriesLoading === "pending";

  return (
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
          <Select
            label="التصنيف"
            value={field.value}
            onChange={handleSelectChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            disabled={isLoading}
            startAdornment={
              isLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null
            }
          >
            {isLoading ? (
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
          <FormHelperText error={!!errors.categoryId || !!categoriesError}>
            {(errors.categoryId?.message as string) || categoriesError}
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
  );
};

export default React.memo(CourseFormFields);
