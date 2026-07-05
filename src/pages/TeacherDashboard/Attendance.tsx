import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  MenuItem,
  Select,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useState, memo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import actGetLecturesBySessionId from "../../store/Courses/act/actGetLecturesBySessionId";
import actSaveAttendance from "../../store/Attendance/act/actSaveAttendance";
import actGetActiveTrainingSessions from "../../store/TrainingSessions/actGetActiveTrainingSessions";
import actGetEnrollmentsBySession from "../../store/Attendance/act/actGetEnrollmentsBySession";
import actGetAttendanceByLecture from "../../store/Attendance/act/actGetAttendanceByLecture";
import { useSnackbar } from "../../Context/SnackbarContext";

type ActiveTrainingSession = {
  id: number;
  courseName: string;
  teacherId: number;
};

const Attendance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  const { lecturesBySession } = useAppSelector((state) => state.courses);
  const { loading, enrollments, attendanceRecords } = useAppSelector(
    (state) => state.attendance,
  );
  const { activeSessions } = useAppSelector((state) => state.trainingSessions);

  const activeTrainingSessions = activeSessions;

  const [selectedSessionId, setSelectedSessionId] = useState<number | "">("");
  const [selectedLectureId, setSelectedLectureId] = useState<number | "">("");
  const lectures =
    selectedSessionId === "" ? [] : lecturesBySession[selectedSessionId] || [];
  useEffect(() => {
    dispatch(actGetActiveTrainingSessions());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedSessionId) return;

    dispatch(actGetLecturesBySessionId(selectedSessionId));
  }, [dispatch, selectedSessionId]);

  useEffect(() => {
    if (!selectedSessionId) return;

    dispatch(actGetEnrollmentsBySession(selectedSessionId));
  }, [dispatch, selectedSessionId]);

  const [students, setStudents] = useState<
    {
      id: number;
      name: string;
      image: string | null;
      status: "present" | "absent";
    }[]
  >([]);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    const formattedStudents = enrollments.map((enrollment) => ({
      id: enrollment.student.id,
      name: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      image: enrollment.student.image,
      status: "present",
    }));

    setCurrentPage(1);

    setStudents(formattedStudents);
  }, [enrollments]);

  const handleStatusChange = (id: number, status: "present" | "absent") => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student,
      ),
    );
  };
  useEffect(() => {
    if (!selectedLectureId) return;

    dispatch(actGetAttendanceByLecture(selectedLectureId));
  }, [dispatch, selectedLectureId]);

  const formatTime = (time: any) => {
    if (!time) return "";
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",
        flexDirection: "column",
        p: { xs: 1.5, sm: 2.5 },
      }}
      dir="rtl">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          width: { xs: "100%", sm: "90%" },
          mr: { xs: 0, sm: 4 },
          mb: 3,
        }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            sx={{
              backgroundColor: "#091c39",
              color: "white",
              "&:hover": { backgroundColor: "#0d2d4a" },
              width: 32,
              height: 32,
            }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={900}
            color="#091c39"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              fontFamily: "Tajawal",
            }}>
            تسجيل الحضور
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={async () => {
            if (!selectedLectureId) {
              showSnackbar("اختاري المحاضرة أولاً", "warning");
              return;
            }

            try {
              await dispatch(
                actSaveAttendance({
                  lectureId: selectedLectureId,
                  records: students.map((student) => ({
                    studentId: student.id,
                    status: student.status === "present" ? "PRESENT" : "ABSENT",
                  })),
                }),
              ).unwrap();

              showSnackbar("تم حفظ الحضور بنجاح", "success");
            } catch {
              showSnackbar("حدث خطأ أثناء حفظ الحضور", "error");
            }
          }}
          sx={{
            backgroundColor: "#091c39",
            color: "white",
            borderRadius: "50px",
            px: { xs: 2, sm: 4 },
            py: 1.2,
            fontWeight: 800,
            fontSize: "14px",
            fontFamily: "Tajawal",
            boxShadow: "0 4px 12px rgba(9, 28, 57, 0.2)",
            "&:hover": { backgroundColor: "#0d2d4a" },
          }}>
          {loading === "pending" ? "جاري الحفظ..." : "حفظ الحضور"}
        </Button>
      </Stack>

      <Paper
        sx={{
          mr: { xs: 0, sm: 4 },
          p: 2.5,
          borderRadius: "20px",
          mb: 2,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                color: "#091c39",
                fontWeight: 800,
                fontSize: "14px",
                mb: 1,
                fontFamily: "Tajawal",
              }}>
              الدورة
            </Typography>
            <Select
              fullWidth
              size="small"
              value={selectedSessionId}
              onChange={(e) => {
                setSelectedSessionId(Number(e.target.value));
                setSelectedLectureId("");
              }}
              displayEmpty
              sx={{
                borderRadius: "12px",
                backgroundColor: "#fff",
                height: "45px",
                fontSize: "13px",
                fontFamily: "Tajawal",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(9, 28, 57, 0.1)",
                },
              }}>
              <MenuItem value="">اختر الدورة</MenuItem>

              {activeTrainingSessions.map((session: ActiveTrainingSession) => (
                <MenuItem key={session.id} value={session.id}>
                  {session.courseName}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                color: "#091c39",
                fontWeight: 800,
                fontSize: "14px",
                mb: 1,
                fontFamily: "Tajawal",
              }}>
              المحاضرة
            </Typography>
            <Select
              fullWidth
              size="small"
              value={selectedLectureId}
              onChange={(e) => setSelectedLectureId(Number(e.target.value))}
              displayEmpty
              disabled={!selectedSessionId}
              sx={{
                borderRadius: "12px",
                backgroundColor: "#fff",
                height: "45px",
                fontSize: "13px",
                fontFamily: "Tajawal",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(9, 28, 57, 0.1)",
                },
              }}>
              <MenuItem value="">اختر المحاضرة</MenuItem>

              {lectures.map((lecture) => (
                <MenuItem key={lecture.id} value={lecture.id}>
                  {lecture.lectureDate} - {formatTime(lecture.startTime)} إلى{" "}
                  {formatTime(lecture.endTime)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {paginatedStudents.map((student) => (
            <Card
              key={student.id}
              sx={{
                borderRadius: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                p: 2,
              }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar
                  src={student.image || undefined}
                  alt={student.name}
                  sx={{ bgcolor: "#091c39", width: 40, height: 40 }}>
                  {student.name.charAt(0)}
                </Avatar>
                <Typography
                  fontWeight={800}
                  color="#091c39"
                  sx={{ fontFamily: "Tajawal" }}>
                  {student.name}
                </Typography>
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  mt: "auto",
                }}>
                <Button
                  sx={{
                    flex: 1,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "12px",
                    fontFamily: "Tajawal",
                    backgroundColor:
                      student.status === "present" ? "#4CAF50" : "transparent",
                    color: student.status === "present" ? "#fff" : "#4CAF50",
                    borderColor: "#4CAF50",
                    "&:hover": {
                      backgroundColor:
                        student.status === "present"
                          ? "#43A047"
                          : "rgba(76, 175, 80, 0.1)",
                    },
                    height: "40px",
                  }}
                  variant={
                    student.status === "present" ? "contained" : "outlined"
                  }
                  onClick={() => handleStatusChange(student.id, "present")}>
                  حاضر <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
                </Button>
                <Button
                  sx={{
                    flex: 1,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "12px",
                    fontFamily: "Tajawal",
                    backgroundColor:
                      student.status === "absent" ? "#ef5350" : "transparent",
                    color: student.status === "absent" ? "#fff" : "#ef5350",
                    borderColor: "#ef5350",
                    "&:hover": {
                      backgroundColor:
                        student.status === "absent"
                          ? "#e53935"
                          : "rgba(239, 83, 80, 0.1)",
                    },
                    height: "40px",
                  }}
                  variant={
                    student.status === "absent" ? "contained" : "outlined"
                  }
                  onClick={() => handleStatusChange(student.id, "absent")}>
                  غائب <CloseIcon sx={{ fontSize: 16, mr: 0.5 }} />
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      ) : (
        <Paper
          sx={{
            mr: 4,
            p: 2,
            borderRadius: "24px",
            backgroundColor: "rgba(248, 251, 254, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
          <Stack
            direction="row-reverse"
            justifyContent="space-between"
            sx={{
              pb: 1.5,
              borderBottom: "1px solid rgba(9, 28, 57, 0.1)",
              mb: 1,
            }}>
            <Typography
              sx={{
                color: "#4E6982",
                fontWeight: 800,
                fontSize: "14px",
                ml: 12,
                fontFamily: "Tajawal",
              }}>
              حالة الحضور
            </Typography>
            <Typography
              sx={{
                color: "#4E6982",
                fontWeight: 800,
                fontSize: "14px",
                mr: 2,
                fontFamily: "Tajawal",
              }}>
              الطالب
            </Typography>
          </Stack>
          <Box sx={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
            {paginatedStudents.map((student) => (
              <Stack
                key={student.id}
                direction="row-reverse"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  py: 1.2,
                  borderBottom: "1px solid rgba(9, 28, 57, 0.05)",
                  "&:last-child": { borderBottom: "none" },
                }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    ml: 2,
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    flexShrink: 0,
                  }}>
                  <Button
                    size="small"
                    variant={
                      student.status === "present" ? "contained" : "outlined"
                    }
                    onClick={() => handleStatusChange(student.id, "present")}
                    sx={{
                      borderRadius: "20px",
                      px: 2,
                      width: { xs: "100%", sm: "100px" },
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "12px",
                      fontFamily: "Tajawal",
                      backgroundColor:
                        student.status === "present"
                          ? "#4CAF50"
                          : "transparent",
                      borderColor: "#4CAF50",
                      color: student.status === "present" ? "#fff" : "#4CAF50",
                      boxShadow: "none",
                      height: "32px",
                      "&:hover": {
                        backgroundColor:
                          student.status === "present"
                            ? "#43A047"
                            : "rgba(76, 175, 80, 0.1)",
                        borderColor: "#4CAF50",
                        boxShadow: "none",
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}>
                    حاضر <CheckIcon sx={{ fontSize: 16 }} />
                  </Button>
                  <Button
                    size="small"
                    variant={
                      student.status === "absent" ? "contained" : "outlined"
                    }
                    onClick={() => handleStatusChange(student.id, "absent")}
                    sx={{
                      borderRadius: "20px",
                      px: 2,
                      width: { xs: "100%", sm: "100px" },
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "12px",
                      fontFamily: "Tajawal",
                      backgroundColor:
                        student.status === "absent" ? "#ef5350" : "transparent",
                      borderColor: "#ef5350",
                      color: student.status === "absent" ? "#fff" : "#ef5350",
                      boxShadow: "none",
                      height: "32px",
                      "&:hover": {
                        backgroundColor:
                          student.status === "absent"
                            ? "#e53935"
                            : "rgba(239, 83, 80, 0.1)",
                        borderColor: "#ef5350",
                        boxShadow: "none",
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}>
                    غائب <CloseIcon sx={{ fontSize: 16 }} />
                  </Button>
                </Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mr: 2, flex: 1, minWidth: 0 }}>
                  <Avatar
                    src={student.image || undefined}
                    alt={student.name}
                    sx={{
                      bgcolor: "#091c39",
                      width: 32,
                      height: 32,
                      fontSize: "14px",
                      flexShrink: 0,
                    }}>
                    {student.name.charAt(0)}
                  </Avatar>
                  <Typography
                    fontWeight={700}
                    color="#091c39"
                    sx={{
                      fontFamily: "Tajawal",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {student.name}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 1, mr: 2 }}>
            <Typography
              sx={{ color: "#091c39", fontWeight: 700, fontSize: "14px" }}>
              عرض {students.length} طالب
            </Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default memo(Attendance);
