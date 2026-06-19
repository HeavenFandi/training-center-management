import React from "react";
import { Grid, MenuItem } from "@mui/material";
import AuthInput from "../../../Auth/AuthInput";
import { TeacherFormData } from "./EditInformationTeacher";

interface EditTeacherFormProps {
  formData: TeacherFormData | null;
  onChange: (
    field: keyof TeacherFormData,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditTeacherForm: React.FC<EditTeacherFormProps> = ({
  formData,
  onChange,
}) => (
  <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الاسم الأول"
        placeholder="أدخل الاسم الأول"
        value={formData?.fname || ""}
        onChange={onChange("fname")}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الاسم الأخير"
        placeholder="أدخل الاسم الأخير"
        value={formData?.lname || ""}
        onChange={onChange("lname")}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label=" اسم المستخدم"
        placeholder="أدخل اسم المستخدم"
        value={String(formData?.username ?? "")}
        onChange={onChange("username")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="التخصص"
        placeholder="أدخل التخصص"
        value={formData?.specialty || ""}
        onChange={onChange("specialty")}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الحالة"
        select
        value={formData?.status || "نشط"}
        onChange={onChange("status")}
        compact>
        <MenuItem value="نشط">نشط</MenuItem>
        <MenuItem value="غير نشط">غير نشط</MenuItem>
      </AuthInput>
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="المدينة"
        placeholder="أدخل المدينة"
        value={formData?.city || ""}
        onChange={onChange("city")}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="سنوات الخبرة"
        placeholder="مثال: 10+"
        value={formData?.experience || ""}
        onChange={onChange("experience")}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="البريد الإلكتروني"
        placeholder="أدخل البريد الإلكتروني"
        value={formData?.email || ""}
        onChange={onChange("email")}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="رقم الهاتف"
        placeholder="أدخل رقم الهاتف"
        value={formData?.phone || ""}
        onChange={onChange("phone")}
        compact
      />
    </Grid>

    <Grid size={{ xs: 12 }}>
      <AuthInput
        label="السيرة الذاتية (Bio)"
        placeholder="أدخل نبذة عن المعلم"
        value={formData?.bio || ""}
        onChange={onChange("bio")}
        compact
      />
    </Grid>
  </Grid>
);

export default EditTeacherForm;
