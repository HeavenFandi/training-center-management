import React, { memo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  Button,
  Card,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

import { TeacherApiResponse } from "../../../api/teacherApi";

interface Props {
  teachersData: TeacherApiResponse[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onView: (teacher: TeacherApiResponse) => void;
  onEdit: (teacher: TeacherApiResponse) => void;
  onDelete: (teacher: TeacherApiResponse) => void;
  loading?: "idle" | "pending" | "succeeded" | "failed";
}

const TeachersTable: React.FC<Props> = memo(({
  teachersData,
  searchTerm,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
  loading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const btnStyle = {
    borderRadius: "12px",
    px: 2,
    py: 0.75,
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: "none",
    minHeight: "32px",
    height: "32px",
    width: "100%",
    transition: "all 0.2s ease-in-out",
    "&:hover": { 
      opacity: 0.9,
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    "& .MuiButton-startIcon": {
      marginRight: "8px", // RTL, so marginRight is space between icon and text
      marginLeft: 0,
    },
  };

  const ActionButtons = ({ teacher }: { teacher: TeacherApiResponse }) => (
    <Stack 
      direction="row" 
      spacing={2} 
      justifyContent="center" 
      sx={{ width: "100%", flexWrap: "nowrap" }}
    >
      <Button
        onClick={() => onView(teacher)}
        sx={{ 
          ...btnStyle, 
          bgcolor: "transparent", 
          color: "#2196f3", 
          flex: 1,
          maxWidth: "130px",
          "&:hover": {
            bgcolor: "#e3f2fd",
          }
        }}
        startIcon={<VisibilityIcon sx={{ fontSize: "1.1rem" }} />}
      >
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
          التفاصيل
        </Box>
      </Button>

      <Button
        onClick={() => onEdit(teacher)}
        sx={{ 
          ...btnStyle, 
          bgcolor: "transparent", 
          color: "#4caf50", 
          flex: 1,
          maxWidth: "130px",
          "&:hover": {
            bgcolor: "#e8f5e9",
          }
        }}
        startIcon={<EditIcon sx={{ fontSize: "1.1rem" }} />}
      >
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
          تعديل
        </Box>
      </Button>

      <Button
        onClick={() => onDelete(teacher)}
        sx={{ 
          ...btnStyle, 
          bgcolor: "transparent", 
          color: "#ef5350", 
          flex: 1,
          maxWidth: "130px",
          "&:hover": {
            bgcolor: "#ffebee",
          }
        }}
        startIcon={<DeleteIcon sx={{ fontSize: "1.1rem" }} />}
      >
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
          حذف
        </Box>
      </Button>
    </Stack>
  );

  // If there's a search term, always show the search UI and results
  if (searchTerm.trim()) {
    return (
      <Box sx={{ width: "100%" }}>
        {isMobile ? (
          <Box dir="rtl" sx={{ p: 2 }}>
            {/* Mobile Search */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                dir="rtl"
                placeholder="ابحث عن معلم..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#334155", fontSize: "1.2rem" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "14px",
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused": {
                      bgcolor: "#ffffff",
                      border: "1px solid #2196f3",
                      boxShadow: "0 0 0 3px rgba(33,150,243,0.1)",
                    },
                    px: 1.5,
                    py: 1,
                  },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    paddingY: 0.5,
                    fontSize: "0.95rem",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#94a3b8",
                    opacity: 1,
                  },
                }}
              />
            </Box>
            
            {teachersData.length === 0 ? (
              <Box 
                sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  py: 10,
                  textAlign: "center",
                  direction: "rtl",
                }}
              >
                <Typography variant="body1" color="#64748b">
                  لا توجد نتائج مطابقة
                </Typography>
              </Box>
            ) : (
              teachersData.map((teacher) => (
                <Card
                  key={teacher.id}
                  sx={{
                    mb: 2,
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 4px 20px rgba(19, 62, 101, 0.06)",
                    p: 2.5,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: "0 6px 30px rgba(19, 62, 101, 0.1)",
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2.5} mb={2.5}>
                    <Avatar 
                      src={teacher.image} 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        border: "2px solid #ffffff", 
                        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                      }}
                    >
                      {teacher.firstName ? teacher.firstName.charAt(0) : ""}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} color="#1a2c4e" sx={{ mb: 0.3 }}>
                        {teacher.firstName} {teacher.lastName}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ bgcolor: "#f1f5f9", p: 1.75, borderRadius: "12px", mb: 2.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569" }}>
                      <span style={{ color: "#64748b", fontWeight: 600 }}>التخصص: </span> {teacher.specialization}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569" }}>
                      <span style={{ color: "#64748b", fontWeight: 600 }}>سنوات الخبرة: </span> {teacher.experienceYears || "---"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569" }}>
                      <span style={{ color: "#64748b", fontWeight: 600 }}>عدد الطلاب: </span> {teacher.numberOfStudents || 0}
                    </Typography>
                  </Box>

                  <ActionButtons teacher={teacher} />
                </Card>
              ))
            )}
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "18px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 30px rgba(19, 62, 101, 0.05)",
              direction: "rtl",
              overflow: "hidden",
            }}
          >
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                    المعلم
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                    التخصص
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                    سنوات الخبرة
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                    عدد الطلاب
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5, px: 2 }}>
                    <TextField
                      size="small"
                      dir="rtl"
                      placeholder="ابحث عن معلم..."
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#64748b", fontSize: "1.2rem" }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: "14px",
                          bgcolor: "#f8fafc",
                          "& fieldset": { border: "none" },
                          "&:hover fieldset": { border: "none" },
                          "&.Mui-focused": {
                            bgcolor: "#ffffff",
                            boxShadow: "0 2px 12px rgba(19, 62, 101, 0.1)",
                          },
                          px: 1.5,
                          py: 1,
                        },
                      }}
                      sx={{
                        width: "280px",
                        "& .MuiInputBase-root": {
                          paddingY: 0.75,
                          fontSize: "0.95rem",
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#94a3b8",
                          opacity: 1,
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachersData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                      <Typography variant="body1" color="#64748b">
                        لا توجد نتائج مطابقة
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  teachersData.map((teacher) => (
                    <TableRow
                      key={teacher.id}
                      sx={{ 
                        "&:hover": { bgcolor: "#fafbfc" },
                        transition: "background-color 0.2s ease",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2.5}>
                          <Avatar 
                            src={teacher.image} 
                            sx={{ 
                              width: 52, 
                              height: 52, 
                              border: "2px solid #ffffff", 
                              boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                              fontSize: "1.2rem",
                              fontWeight: 700,
                            }}
                          >
                            {teacher.firstName ? teacher.firstName.charAt(0) : ""}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.2, fontSize: "1rem", color: "#1e293b" }}>
                              {teacher.firstName} {teacher.lastName}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                        <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "#475569", fontWeight: 500 }}>
                          {teacher.specialization}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                        <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "#475569", fontWeight: 500 }}>
                          {teacher.experienceYears || "---"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                        <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "#475569", fontWeight: 500 }}>
                          {teacher.numberOfStudents || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.25, px: 2 }}>
                        <ActionButtons teacher={teacher} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }

  // If no search term: show loading or data
  if (loading !== "succeeded") {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          py: 10,
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography variant="body1" color="#64748b">
          جار التحميل
        </Typography>
      </Box>
    );
  }

  if (teachersData.length === 0) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          py: 10,
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography variant="body1" color="#64748b">
          لا توجد معلمين بعد
        </Typography>
      </Box>
    );
  }

  // If we have data and loading is succeeded, show the table
  return (
    <Box sx={{ width: "100%" }}>
      {isMobile ? (
        <Box dir="rtl" sx={{ p: 2 }}>
          {/* Mobile Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              dir="rtl"
              placeholder="ابحث عن معلم..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#334155", fontSize: "1.2rem" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "14px",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused": {
                    bgcolor: "#ffffff",
                    border: "1px solid #2196f3",
                    boxShadow: "0 0 0 3px rgba(33,150,243,0.1)",
                  },
                  px: 1.5,
                  py: 1,
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  paddingY: 0.5,
                  fontSize: "0.95rem",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#94a3b8",
                  opacity: 1,
                },
              }}
            />
          </Box>
          
          {teachersData.map((teacher) => (
            <Card
              key={teacher.id}
              sx={{
                mb: 2,
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 4px 20px rgba(19, 62, 101, 0.06)",
                p: 2.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow: "0 6px 30px rgba(19, 62, 101, 0.1)",
                  transform: "translateY(-2px)",
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2.5} mb={2.5}>
                <Avatar 
                  src={teacher.image} 
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    border: "2px solid #ffffff", 
                    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  }}
                >
                  {teacher.firstName ? teacher.firstName.charAt(0) : ""}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="#1a2c4e" sx={{ mb: 0.3 }}>
                    {teacher.firstName} {teacher.lastName}
                  </Typography>
                </Box>
              </Stack>
              
              <Box sx={{ bgcolor: "#f1f5f9", p: 1.75, borderRadius: "12px", mb: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569" }}>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>التخصص: </span> {teacher.specialization}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569" }}>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>سنوات الخبرة: </span> {teacher.experienceYears || "---"}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#475569" }}>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>عدد الطلاب: </span> {teacher.numberOfStudents || 0}
                </Typography>
              </Box>

              <ActionButtons teacher={teacher} />
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 30px rgba(19, 62, 101, 0.05)",
            direction: "rtl",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                  المعلم
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                  التخصص
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                  سنوات الخبرة
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: "#1e293b", fontSize: "0.95rem" }}>
                  عدد الطلاب
                </TableCell>
                <TableCell align="center" sx={{ py: 2.5, px: 2 }}>
                  <TextField
                    size="small"
                    dir="rtl"
                    placeholder="ابحث عن معلم..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#64748b", fontSize: "1.2rem" }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "14px",
                        bgcolor: "#f8fafc",
                        "& fieldset": { border: "none" },
                        "&:hover fieldset": { border: "none" },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                          boxShadow: "0 2px 12px rgba(19, 62, 101, 0.1)",
                        },
                        px: 1.5,
                        py: 1,
                      },
                    }}
                    sx={{
                      width: "280px",
                      "& .MuiInputBase-root": {
                        paddingY: 0.75,
                        fontSize: "0.95rem",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#94a3b8",
                        opacity: 1,
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachersData.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  sx={{ 
                    "&:hover": { bgcolor: "#fafbfc" },
                    transition: "background-color 0.2s ease",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                      <Avatar 
                        src={teacher.image} 
                        sx={{ 
                          width: 52, 
                          height: 52, 
                          border: "2px solid #ffffff", 
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {teacher.firstName ? teacher.firstName.charAt(0) : ""}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ mb: 0.2, fontSize: "1rem", color: "#1e293b" }}>
                          {teacher.firstName} {teacher.lastName}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "#475569", fontWeight: 500 }}>
                      {teacher.specialization}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "#475569", fontWeight: 500 }}>
                      {teacher.experienceYears || "---"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2.25, px: 3 }}>
                    <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "#475569", fontWeight: 500 }}>
                      {teacher.numberOfStudents || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.25, px: 2 }}>
                    <ActionButtons teacher={teacher} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
});

export default TeachersTable;
