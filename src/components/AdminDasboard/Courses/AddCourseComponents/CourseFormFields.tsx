import React from "react";
import { Grid, MenuItem } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import AuthInput from "../../../Auth/AuthInput";
import { CourseFormData } from "../../../../validation/CourseSchema";

interface CourseFormFieldsProps {
  register: UseFormRegister<CourseFormData>;
  errors: FieldErrors<CourseFormData>;
}

const CourseFormFields: React.FC<CourseFormFieldsProps> = ({
  register,
  errors,
}) => {
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
        <AuthInput
          label="التصنيف"
          select
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
          compact>
          <MenuItem value="برمجة">برمجة</MenuItem>
          <MenuItem value="علوم">علوم</MenuItem>
          <MenuItem value="تصميم">تصميم</MenuItem>
          <MenuItem value="لغات">لغات</MenuItem>
        </AuthInput>
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


