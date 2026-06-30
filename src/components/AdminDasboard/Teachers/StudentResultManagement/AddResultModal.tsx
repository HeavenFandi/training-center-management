// import React, { useEffect } from "react";
// import {
//   Box,
//   Modal,
//   Typography,
//   TextField,
//   Button,
//   Stack,
//   IconButton,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import { useForm, type Resolver } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { resultSchema, ResultFormData } from "../../../../validation/ResultSchema";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onAdd: (result: ResultFormData) => void;
//   initialData?: ResultFormData;
// };

// const AddResultModal = ({ open, onClose, onAdd, initialData }: Props) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//     reset,
//   } = useForm<ResultFormData>({
//     resolver: zodResolver(resultSchema) as Resolver<ResultFormData>,
//     defaultValues: initialData ?? {
//       student: "",
//       course: "",
//       grade: 0,
//       status: "ناجح",
//     },
//   });

//   const status = watch("status");

//   useEffect(() => {
//     reset(
//       initialData ?? {
//         student: "",
//         course: "",
//         grade: 0,
//         status: "ناجح",
//       },
//     );
//   }, [initialData, open, reset]);

//   const handleAdd = handleSubmit((data: ResultFormData) => {
//     onAdd(data);
//     reset({ student: "", course: "", grade: 0, status: "ناجح" });
//     onClose();
//   });

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         dir="rtl"
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: { xs: "90%", sm: 420 },
//           bgcolor: "#fff",
//           borderRadius: "20px",
//           p: 3,
//           boxShadow: 24,
//           fontFamily: "Tajawal",
//         }}>
//         <Stack direction="row-reverse" justifyContent="space-between" mb={2}>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>

//           <Typography fontWeight="bold" fontSize={18}>
//             إضافة علامة
//           </Typography>

//           <InfoOutlinedIcon />
//         </Stack>

//         <Stack spacing={2}>
//           <TextField
//             label="اسم الطالب"
//             fullWidth
//             {...register("student")}
//             error={!!errors.student}
//             helperText={errors.student?.message}
//             InputProps={{ style: { textAlign: "right" } }}
//           />

//           <TextField
//             label="الدورة"
//             fullWidth
//             {...register("course")}
//             error={!!errors.course}
//             helperText={errors.course?.message}
//             InputProps={{ style: { textAlign: "right" } }}
//           />

//           <TextField
//             label="العلامة"
//             type="number"
//             fullWidth
//             {...register("grade", { valueAsNumber: true })}
//             error={!!errors.grade}
//             helperText={errors.grade?.message}
//             InputProps={{ style: { textAlign: "right" } }}
//           />

//           <Stack direction="row" spacing={2} justifyContent="center">
//             <Button
//               variant={status === "ناجح" ? "contained" : "outlined"}
//               onClick={() => setValue("status", "ناجح", { shouldValidate: true })}
//               sx={{
//                 borderRadius: "20px",
//                 px: 3,
//                 backgroundColor: status === "ناجح" ? "#4CAF50" : "transparent",
//                 color: status === "ناجح" ? "#fff" : "#4CAF50",
//                 borderColor: "#4CAF50",
//                 fontWeight: "bold",
//               }}>
//               ناجح
//             </Button>

//             <Button
//               variant={status === "راسب" ? "contained" : "outlined"}
//               onClick={() => setValue("status", "راسب", { shouldValidate: true })}
//               sx={{
//                 borderRadius: "20px",
//                 px: 3,
//                 backgroundColor: status === "راسب" ? "#E74C3C" : "transparent",
//                 color: status === "راسب" ? "#fff" : "#E74C3C",
//                 borderColor: "#E74C3C",
//                 fontWeight: "bold",
//               }}>
//               راسب
//             </Button>
//           </Stack>

//           {errors.status && (
//             <Typography color="error" variant="body2" textAlign="center">
//               {errors.status.message}
//             </Typography>
//           )}
//         </Stack>

//         <Stack direction="row" justifyContent="space-between" mt={3}>
//           <Button onClick={onClose} sx={{ color: "#999" }}>
//             إلغاء
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleAdd}
//             sx={{
//               backgroundColor: "#091c39",
//               borderRadius: "10px",
//               px: 3,
//               fontWeight: "bold",
//               "&:hover": { backgroundColor: "#0d2d4a" },
//             }}>
//             إضافة
//           </Button>
//         </Stack>
//       </Box>
//     </Modal>
//   );
// };

// export default AddResultModal;

// ...............................................................................................................
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
