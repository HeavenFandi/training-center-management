import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useForm } from "react-hook-form";

type StudentOption = {
  id: number;
  firstName: string;
  lastName: string;
};

type AddGradeForm = {
  studentId: string;
  score: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { studentId: number; score: number }) => void;
  students: StudentOption[];
};

const AddResultModal = ({ open, onClose, onAdd, students }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddGradeForm>({
    defaultValues: {
      studentId: "",
      score: 0,
    },
  });

  const handleAdd = handleSubmit((data) => {
    onAdd({
      studentId: Number(data.studentId),
      score: data.score,
    });

    reset({ studentId: "", score: 0 });
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        dir="rtl"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 420 },
          bgcolor: "#fff",
          borderRadius: "20px",
          p: 3,
          boxShadow: 24,
          fontFamily: "Tajawal",
        }}>
        <Stack direction="row-reverse" justifyContent="space-between" mb={2}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <Typography fontWeight="bold" fontSize={18}>
            إضافة علامة
          </Typography>

          <InfoOutlinedIcon />
        </Stack>

        <Stack spacing={2}>
          <TextField
            select
            label="اسم الطالب"
            fullWidth
            {...register("studentId")}
            error={!!errors.studentId}
            helperText={errors.studentId?.message}>
            {students.map((student) => (
              <MenuItem key={student.id} value={String(student.id)}>
                {student.firstName} {student.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="العلامة"
            type="number"
            fullWidth
            {...register("score", {
              valueAsNumber: true,
            })}
            error={!!errors.score}
            helperText={errors.score?.message}
            InputProps={{ style: { textAlign: "right" } }}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" mt={3}>
          <Button onClick={onClose} sx={{ color: "#999" }}>
            إلغاء
          </Button>

          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              backgroundColor: "#091c39",
              borderRadius: "10px",
              px: 3,
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#0d2d4a" },
            }}>
            إضافة
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddResultModal;
