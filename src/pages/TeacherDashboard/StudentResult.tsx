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
import { useState } from "react";
import EditResultModal from "../../components/AdminDasboard/Teachers/StudentResultManagement/EditResultModal";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import AddResultModal from "../../components/AdminDasboard/Teachers/StudentResultManagement/AddResultModal";

type Result = {
  id: number;
  student: string;
  course: string;
  grade: number;
  status: "ناجح" | "راسب";
};

type ResultForm = Omit<Result, 'id'>;

const resultsData: Result[] = [
  { id: 1, student: "أحمد علي", course: "رياضيات", grade: 85, status: "ناجح" },
  { id: 2, student: "محمد أحمد", course: "برمجة", grade: 55, status: "ناجح" },
  { id: 3, student: "سارة خالد", course: "فيزياء", grade: 72, status: "ناجح" },
  { id: 4, student: "ليلى حسن", course: "كيمياء", grade: 48, status: "راسب" },
];

const StudentsResults = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [results, setResults] = useState<Result[]>(resultsData);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const handleDelete = () => {
    if (!selectedResult) return;
    setResults((prev) => prev.filter((item) => item.id !== selectedResult.id));
    setOpenDelete(false);
  };
  const handleSave = (updatedResult: ResultForm) => {
    if (!selectedResult) return;
    setResults((prev) =>
      prev.map((item) =>
        item.id === selectedResult.id ? { ...item, ...updatedResult } : item,
      ),
    );
    setOpenEdit(false);
  };

  const handleAdd = (newResult: ResultForm) => {
    const newItem: Result = {
      ...newResult,
      id: Date.now(),
    };

    setResults((prev) => [...prev, newItem]);
    setOpenAdd(false);
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
                backgroundColor: "#091c39",
                color: "white",
                "&:hover": { backgroundColor: "#0d2d4a" },
                width: 28,
                height: 28,
              }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
            <Typography
              sx={{
                color: "#091c39",
                fontWeight: "bold",
                fontSize: { xs: 24, sm: 30 },
                fontFamily: "Tajawal",
              }}>
              نتائج الطلاب
            </Typography>
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
        itemName={selectedResult?.student}
      />
      <AddResultModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={handleAdd}
      />
      <TableContainer>
        {isMobile ? (
          <Box>
            {results.map((row) => (
              <Box
                key={row.id}
                sx={{
                  background: "#fff",
                  borderRadius: "16px",
                  p: 3,
                  mb: 2,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                }}>
                
                <Typography textAlign="right" fontWeight="bold" mb={1}>
                  #{row.id}
                </Typography>

                
                <Typography textAlign="right">
                  <strong>اسم الطالب:</strong> {row.student}
                </Typography>

                <Typography textAlign="right">
                  <strong>الدورة:</strong> {row.course}
                </Typography>

                <Typography textAlign="right" mb={1}>
                  <strong>العلامة:</strong> {row.grade}
                </Typography>

                
                <Box display="flex" justifyContent="flex-start" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: row.grade >= 60 ? "#4CAF50" : "#EF5350",
                      color: "#fff",
                      px: 3,
                      py: 0.5,
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}>
                    {row.grade >= 60 ? "ناجح" : "راسب"}
                  </Box>
                </Box>

                
                <Stack direction="row" justifyContent="center" gap={2} mt={2}>
                  <IconButton
                    onClick={() => {
                      setSelectedResult(row);
                      setOpenEdit(true);
                    }}
                    sx={{ background: "#e8f5e9" }}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setSelectedResult(row);
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
              {results.map((row) => {
                const isPassed = row.grade >= 60;

                return (
                  <TableRow key={row.id}>
                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      {row.id}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      {row.student}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931" }}>
                      {row.course}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ border: "1px solid #0A1931", fontWeight: "bold" }}>
                      {row.grade}
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
                            setSelectedResult(row);
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
                            setSelectedResult(row);
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

        <Typography fontWeight="bold">
          عرض {resultsData.length} من 20 نتيجة
        </Typography>
      </Stack>
    </Box>
  );
};

export default StudentsResults;


