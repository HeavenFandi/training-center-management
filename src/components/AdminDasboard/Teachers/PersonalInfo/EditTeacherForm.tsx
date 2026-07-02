import React from "react";
import { Grid, MenuItem } from "@mui/material";
import AuthInput from "../../../Auth/AuthInput";
import { TeacherFormData, TeacherFormErrors } from "./EditInformationTeacher";

interface EditTeacherFormProps {
  formData: TeacherFormData | null;
  errors: TeacherFormErrors;
  onChange: (
    field: keyof TeacherFormData,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditTeacherForm: React.FC<EditTeacherFormProps> = ({
  formData,
  errors,
  onChange,
}) => (
  <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الاسم الأول"
        placeholder="أدخل الاسم الأول"
        value={formData?.fname || ""}
        onChange={onChange("fname")}
        error={!!errors.fname}
        helperText={errors.fname}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الاسم الأخير"
        placeholder="أدخل الاسم الأخير"
        value={formData?.lname || ""}
        onChange={onChange("lname")}
        error={!!errors.lname}
        helperText={errors.lname}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="اسم المستخدم"
        placeholder="أدخل اسم المستخدم"
        value={formData?.username || ""}
        onChange={onChange("username")}
        error={!!errors.username}
        helperText={errors.username}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="التخصص"
        placeholder="أدخل التخصص"
        value={formData?.specialty || ""}
        onChange={onChange("specialty")}
        error={!!errors.specialty}
        helperText={errors.specialty}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="المدينة"
        placeholder="أدخل المدينة"
        value={formData?.city || ""}
        onChange={onChange("city")}
        error={!!errors.city}
        helperText={errors.city}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="سنوات الخبرة"
        placeholder="مثال: 10+"
        value={formData?.experience || ""}
        onChange={onChange("experience")}
        error={!!errors.experience}
        helperText={errors.experience}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="البريد الإلكتروني"
        placeholder="أدخل البريد الإلكتروني"
        value={formData?.email || ""}
        onChange={onChange("email")}
        error={!!errors.email}
        helperText={errors.email}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="رقم الهاتف"
        placeholder="أدخل رقم الهاتف"
        value={formData?.phone || ""}
        onChange={onChange("phone")}
        error={!!errors.phone}
        helperText={errors.phone}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12 }}>
      <AuthInput
        label="السيرة الذاتية (Bio)"
        placeholder="أدخل نبذة عن المعلم"
        value={formData?.bio || ""}
        onChange={onChange("bio")}
        error={!!errors.bio}
        helperText={errors.bio}
        compact
      />
    </Grid>
  </Grid>
);

export default EditTeacherForm;
