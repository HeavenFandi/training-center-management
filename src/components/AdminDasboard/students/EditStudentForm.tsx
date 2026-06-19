import React from "react";
import { Grid, MenuItem } from "@mui/material";
import AuthInput from "../../Auth/AuthInput";
import { CreateStudentResponse } from "../../../api/studentApi";

interface EditStudentFormProps {
  formData: CreateStudentResponse | null;
  onChange: (
    field: keyof CreateStudentResponse,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditStudentForm: React.FC<EditStudentFormProps> = ({
  formData,
  onChange,
}) => (
  <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الاسم الأول"
        placeholder="أدخل اسمك الأول"
        value={formData?.firstName || ""}
        onChange={onChange("firstName")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الاسم الأخير"
        placeholder="ادخل الاسم الأخير "
        value={formData?.lastName || ""}
        onChange={onChange("lastName")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="اسم المستخدم"
        placeholder="أدخل اسم المستخدم"
        value={formData?.username || ""}
        onChange={onChange("username")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="البريد الإلكتروني"
        type="email"
        placeholder="أدخل البريد الإلكتروني"
        value={formData?.email || ""}
        onChange={onChange("email")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="رقم الاتصال"
        placeholder="أدخل رقم الاتصال"
        value={formData?.contactInfo || ""}
        onChange={onChange("contactInfo")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="الجنس"
        select
        value={formData?.gender || "ذكر"}
        onChange={onChange("gender")}
        compact
      >
        <MenuItem value="ذكر">ذكر</MenuItem>
        <MenuItem value="أنثى">أنثى</MenuItem>
      </AuthInput>
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <AuthInput
        label="تاريخ الميلاد"
        type="date"
        value={formData?.birthDate || ""}
        onChange={onChange("birthDate")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12 }}>
      <AuthInput
        label="العنوان"
        placeholder="سوريا، حمص"
        value={formData?.address || ""}
        onChange={onChange("address")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12 }}>
      <AuthInput
        label="الاهتمام"
        placeholder="أدخل الاهتمامات"
        value={formData?.interest || ""}
        onChange={onChange("interest")}
        compact
      />
    </Grid>
    <Grid size={{ xs: 12 }}>
      <AuthInput
        label="السيرة الذاتية (Bio)"
        placeholder="أدخل نبذة عنك"
        value={formData?.bio || ""}
        onChange={onChange("bio")}
        compact
      />
    </Grid>
  </Grid>
);

export default EditStudentForm;
