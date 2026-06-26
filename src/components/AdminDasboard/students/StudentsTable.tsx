import React, { memo } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";

import { CreateStudentResponse } from "../../../api/studentApi";
import TableSkeleton from "../../Common/TableSkeleton";

interface Props {
  studentsData: CreateStudentResponse[];
  onView: (student: CreateStudentResponse) => void;
  onEdit: (student: CreateStudentResponse) => void;
  onDelete: (student: CreateStudentResponse) => void;
  loading?: "idle" | "pending" | "succeeded" | "failed";
  showLoading?: boolean;
  hasData?: boolean;
  searchTerm?: string;
}

const StudentsTable: React.FC<Props> = memo(({
  studentsData,
  onView,
  onEdit,
  onDelete,
  loading,
  showLoading,
  hasData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Don't show skeleton if we already have data
  const isLoading = (loading === "pending" || showLoading) && !hasData;

  if (isLoading) {
    return <TableSkeleton columnsCount={4} rowsCount={5} showMobileView />;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid #eef2f6",
        overflow: "hidden",
      }}
    >
      {isMobile ? (
        <Box sx={{ p: 2 }}>
          {studentsData.map((student) => (
            <Box
              key={student.id}
              sx={{
                borderRadius: "12px",
                p: 3,
                mb: 2,
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                border: "1px solid #eef2f6",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" sx={{ gap: "12px", mb: 2 }} alignItems="center" spacing={4}>
                <Avatar
                  src={student.image}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#3b82f6",
                  }}
                >
                  {student.firstName?.[0] || ""}
                </Avatar>
                <Typography fontWeight="bold" color="#091c39" sx={{ fontSize: 18 }}>
                  {student.firstName} {student.lastName}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <SchoolIcon sx={{ color: "#666", fontSize: 18 }} />
                <Typography color="#666">تاريخ التسجيل:</Typography>
                <Chip
                  label={student.enrollmentDate || "---"}
                  size="small"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    color: "#091c39",
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
                <Tooltip title="عرض التفاصيل">
                  <IconButton
                    onClick={() => onView(student)}
                    sx={{
                      background: "#dbeafe",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "#bfdbfe",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <VisibilityIcon sx={{ color: "#1d4ed8", fontSize: 20 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="تعديل الطالب">
                  <IconButton
                    onClick={() => onEdit(student)}
                    sx={{
                      background: "#e9f7ef",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "#c8f2dc",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <EditIcon sx={{ color: "#2ecc71", fontSize: 20 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="حذف الطالب">
                  <IconButton
                    onClick={() => onDelete(student)}
                    sx={{
                      background: "#fdecea",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "#f8cfcf",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <DeleteIcon sx={{ color: "#e74c3c", fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))}
        </Box>
      ) : (
        <Table sx={{ backgroundColor: "white" }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#091c39",
              }}
            >
              {["#", "الطالب", "تاريخ التسجيل", "الإجراءات"].map(
                (head) => (
                  <TableCell
                    key={head}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      borderBottom: "none",
                      py: 2,
                      fontSize: 15,
                    }}
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsData.map((student, index) => (
              <TableRow
                key={student.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#fafbfc" : "white",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f0f4f8",
                  },
                }}
              >
                <TableCell
                  align="center"
                  sx={{
                    borderBottom: "1px solid #eef2f6",
                    py: 2,
                    color: "#444",
                  }}
                >
                  {student.id}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderBottom: "1px solid #eef2f6",
                    py: 2,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={4}   sx={{ gap: "12px" }}>
                    <Avatar
                      src={student.image}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#3b82f6",
                      }}
                    >
                      {student.firstName?.[0] || ""}
                    </Avatar>
                    <Typography fontWeight={600} color="#091c39">
                      {student.firstName} {student.lastName}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderBottom: "1px solid #eef2f6",
                    py: 2,
                  }}
                >
                  <Chip
                    label={student.enrollmentDate || "---"}
                    size="medium"
                    sx={{
                      backgroundColor: "#e3f2fd",
                      color: "#091c39",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderBottom: "1px solid #eef2f6",
                    py: 2,
                  }}
                >
                  <Stack direction="row" justifyContent="center" gap={1}>
                    <Tooltip title="عرض التفاصيل">
                      <IconButton
                        onClick={() => onView(student)}
                        sx={{
                          background: "#dbeafe",
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "#bfdbfe",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <VisibilityIcon sx={{ color: "#1d4ed8", fontSize: 20 }} />
                      
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="تعديل الطالب">
                      <IconButton
                        onClick={() => onEdit(student)}
                        sx={{
                          background: "#e9f7ef",
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "#c8f2dc",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <EditIcon sx={{ color: "#2ecc71", fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="حذف الطالب">
                      <IconButton
                        onClick={() => onDelete(student)}
                        sx={{
                          background: "#fdecea",
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "#f8cfcf",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ color: "#e74c3c", fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
});

export default StudentsTable;
