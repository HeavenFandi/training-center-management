import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EditResultModal from "../../components/AdminDasboard/Teachers/StudentResultManagement/EditResultModal";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import AddResultModal from "../../components/AdminDasboard/Teachers/StudentResultManagement/AddResultModal";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetGradesByQuiz from "../../store/Grades/act/actGetGradesByQuiz";
import actCreateGrade from "../../store/Grades/act/actCreateGrade";
import actGetAllStudents from "../../store/Students/act/actGetAllStudents";
import actDeleteGrade from "../../store/Grades/act/actDeleteGrade";
import actUpdateGrade from "../../store/Grades/act/actUpdateGrade";

const StudentsResults = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const quizId = location.state?.quizId;
  const quizName = location.state?.quizName;

  const { grades } = useAppSelector((state) => state.grades);
  const { students } = useAppSelector((state) => state.students);

  const getStudentName = (studentId: number) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : studentId;
  };

  useEffect(() => {
    if (quizId) {
      dispatch(actGetGradesByQuiz(Number(quizId)));
    }

    dispatch(actGetAllStudents());
  }, [dispatch, quizId]);

  if (!quizId) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">لم يتم اختيار اختبار</Typography>

        <Button
          sx={{ mt: 2 }}
          onClick={() => navigate("/teacher-dashboard/exams")}>
          الرجوع للاختبارات
        </Button>
      </Box>
    );
  }

  const handleAdd = async (data: { studentId: number; score: number }) => {
    await dispatch(
      actCreateGrade({
        studentId: data.studentId,
        quizId: Number(quizId),
        score: data.score,
      }),
    ).unwrap();

    dispatch(actGetGradesByQuiz(Number(quizId)));
    setOpenAdd(false);
  };

  const handleDelete = async () => {
    if (!selectedResult) return;

    await dispatch(actDeleteGrade(selectedResult.id)).unwrap();

    setOpenDelete(false);
    setSelectedResult(null);
  };

  const handleSave = async (updatedResult: {
    studentId: number;
    score: number;
  }) => {
    if (!selectedResult) return;

    await dispatch(
      actUpdateGrade({
        id: selectedResult.id,
        studentId: updatedResult.studentId,
        quizId: Number(quizId),
        score: updatedResult.score,
      }),
    ).unwrap();

    dispatch(actGetGradesByQuiz(Number(quizId)));

    setOpenEdit(false);
    setSelectedResult(null);
  };

  return (
    <Box dir="rtl" sx={{ p: { xs: 1, sm: 4 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 4,
          p: { xs: 1, sm: 0 },
        }}
        dir="rtl">
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <IconButton
              sx={{
                mb: 2,
                backgroundColor: "#091c39",
                color: "white",
                "&:hover": { backgroundColor: "#0d2d4a" },
                width: 28,
                height: 28,
              }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>

            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  fontSize: { xs: 20, md: 24 },
                  fontWeight: 900,
                  color: "#1e293b",
                  mb: 0.5,
                  fontFamily: "Tajawal",
                }}>
                نتائج الطلاب
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 15, md: 18 },
                  color: "#64748b",
                  fontWeight: 900,
                  fontFamily: "Tajawal",
                  mb: 3,
                  mt: 1,
                }}>
                الاختبار: {quizName}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontFamily: "Tajawal",
              fontSize: { xs: 14, sm: 16 },
            }}>
            إدارة ومتابعة علامات الطلاب
          </Typography>
        </Box>

        <Button
          onClick={() => setOpenAdd(true)}
          variant="contained"
          sx={{
            backgroundColor: "#091c39",
            color: "white",
            borderRadius: "50px",
            px: { xs: 2, sm: 4 },
            py: 1.2,
            fontWeight: "bold",
            fontSize: "15px",
            boxShadow: "0px 8px 20px rgba(19, 62, 101, 0.2)",
            fontFamily: "Tajawal",
            "&:hover": { backgroundColor: "#0d2d4a" },
          }}>
          إضافة علامة
        </Button>
      </Stack>

      <EditResultModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        selectedResult={selectedResult}
        onSave={handleSave}
      />

      <GenericDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        itemName={selectedResult?.studentName}
      />

      <AddResultModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={handleAdd}
        students={students}
      />

      <TableContainer>
        {isMobile ? (
          <Box>
            {grades.map((grade) => (
              <Box
                key={grade.id}
                sx={{
                  background: "#fff",
                  borderRadius: "16px",
                  p: 3,
                  mb: 2,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                }}>
                <Typography textAlign="right" fontWeight="bold" mb={1}>
                  #{grade.id}
                </Typography>

                <Typography textAlign="right">
                  <strong>اسم الطالب:</strong>{" "}
                  {grade.studentName || getStudentName(grade.studentId)}
                </Typography>

                <Typography textAlign="right">
                  <strong>الدورة:</strong> {grade.quizName || quizName}
                </Typography>

                <Typography textAlign="right" mb={1}>
                  <strong>العلامة:</strong> {grade.score}
                </Typography>

                <Box display="flex" justifyContent="flex-start" mb={2}>
                  <Box
                    sx={{
                      backgroundColor:
                        grade.score >= 60 ? "#4CAF50" : "#EF5350",
                      color: "#fff",
                      px: 3,
                      py: 0.5,
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}>
                    {grade.score >= 60 ? "ناجح" : "راسب"}
                  </Box>
                </Box>

                <Stack direction="row" justifyContent="center" gap={2} mt={2}>
                  <IconButton
                    onClick={() => {
                      setSelectedResult(grade);
                      setOpenEdit(true);
                    }}
                    sx={{ background: "#e8f5e9" }}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setSelectedResult(grade);
                      setOpenDelete(true);
                    }}
                    sx={{ background: "#fdecea" }}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#dbe9f6" }}>
                {[
                  "#",
                  "اسم الطالب",
                  "الدورة",
                  "العلامة",
                  "الحالة",
                  "الإجراءات",
                ].map((head) => (
                  <TableCell
                    key={head}
                    align="center"
                    sx={{ fontWeight: "bold", border: "1px solid #0A1931" }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {grades.map((grade) => {
                const isPassed = grade.score >= 60;

                return (
                  <TableRow key={grade.id}>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      {grade.id}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      {grade.studentName || getStudentName(grade.studentId)}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      {grade.quizName || quizName}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931", fontWeight: "bold" }}>
                      {grade.score}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      <Chip
                        label={isPassed ? "ناجح" : "راسب"}
                        sx={{
                          backgroundColor: isPassed ? "#4CAF50" : "#EF5350",
                          color: "#fff",
                          fontWeight: "bold",
                          borderRadius: "20px",
                          px: 2,
                        }}
                      />
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      <Stack direction="row" justifyContent="center" gap={2}>
                        <IconButton
                          onClick={() => {
                            setSelectedResult(grade);
                            setOpenEdit(true);
                          }}
                          sx={{
                            background: "#e9f7ef",
                            width: 40,
                            height: 40,
                          }}>
                          <EditIcon sx={{ color: "#2ecc71" }} />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            setSelectedResult(grade);
                            setOpenDelete(true);
                          }}
                          sx={{
                            background: "#fdecea",
                            width: 40,
                            height: 40,
                          }}>
                          <DeleteIcon sx={{ color: "#e74c3c" }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Stack
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
        mt={3}>
        <Stack direction="row" spacing={2} gap={1}>
          <IconButton
            sx={{
              border: "2px solid black",
              borderRadius: "16px",
              color: "#091c39",
            }}>
            <ChevronRightIcon />
          </IconButton>

          <IconButton
            sx={{
              border: "2px solid black",
              borderRadius: "16px",
              color: "#091c39",
            }}>
            <ChevronLeftIcon />
          </IconButton>
        </Stack>

        <Typography fontWeight="bold">عرض {grades.length} نتيجة</Typography>
      </Stack>
    </Box>
  );
};

export default StudentsResults;
