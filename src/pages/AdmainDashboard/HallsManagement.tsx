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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import AddHallModal from "../../components/Modal/AddHallModal";
import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
const hallsData = [
  { id: 1, hall: "A01", capacity: 20, equipment: "برجكتور , لابتوب" },
  { id: 2, hall: "A02", capacity: 30, equipment: "برجكتور" },
  { id: 4, hall: "B01", capacity: 25, equipment: "برجكتور , لابتوب" },
  { id: 5, hall: "B02", capacity: 15, equipment: "برجكتور" },
  { id: 6, hall: "B03", capacity: 20, equipment: "برجكتور" },
];

const HallsManagement = () => {
  type Hall = {
    id: number;
    hall: string;
    capacity: number;
    equipment: string;
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [halls, setHalls] = useState<Hall[]>(hallsData);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);

  const handleOpenDelete = (hall: Hall) => {
    setSelectedHall(hall);
    setOpenDelete(true);
  };

  const handleOpenAddModal = () => {
    setEditingHall(null);
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (hall: Hall) => {
    setEditingHall(hall);
    setOpenAddModal(true);
  };

  const handleSaveHall = (hallData: {
    hall: string;
    capacity: number;
    equipment: string;
  }) => {
    if (editingHall) {
      setHalls((prev) =>
        prev.map((h) => (h.id === editingHall.id ? { ...h, ...hallData } : h)),
      );
    } else {
      const newId =
        halls.length > 0 ? Math.max(...halls.map((h) => h.id)) + 1 : 1;
      setHalls((prev) => [...prev, { id: newId, ...hallData }]);
    }
  };

  const handleDelete = () => {
    if (!selectedHall) return;

    setHalls((prev) => prev.filter((h) => h.id !== selectedHall.id));

    setOpenDelete(false);
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
        }}>
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
            <Typography variant="h5" fontWeight="bold" color="#091c39">
              إدارة القاعات
            </Typography>
          </Box>
          <Typography color="#888" sx={{ fontSize: 14 }}>
            إضافة وتعديل بيانات القاعات التدريبية
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenAddModal}
          sx={{
            backgroundColor: "#091c39",
            color: "white",
            borderRadius: "50px",
            px: { xs: 2, sm: 4 },
            py: 1.2,
            fontWeight: "bold",
            fontSize: "15px",
            "&:hover": { backgroundColor: "#0d2d4a" },
          }}>
          إضافة قاعة جديدة
        </Button>
      </Stack>

      <AddHallModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleSaveHall}
        initialData={editingHall}
      />

      <GenericDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        itemName={selectedHall?.hall}
      />

      <TableContainer>
        {isMobile ? (
          <Box>
            {halls.map((row) => (
              <Box
                key={row.id}
                sx={{
                  borderRadius: "20px",
                  p: 2,
                  mb: 2,
                  background: "#f9fbfd",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  border: "1px solid #eef2f6",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  },
                }}>
             
                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                  #{row.id}
                </Typography>

               
                <Typography sx={{ mb: 0.5 }}>
                  <strong>رقم القاعة:</strong> {row.hall}
                </Typography>

             
                <Typography sx={{ mb: 0.5 }}>
                  <strong>السعة:</strong> {row.capacity}
                </Typography>

             
                <Typography sx={{ mb: 1 }}>
                  <strong>التجهيزات:</strong> {row.equipment}
                </Typography>

              
                <Stack direction="row" justifyContent="center" gap={2} mt={2}>
                  <IconButton
                    onClick={() => handleOpenDelete(row)}
                    sx={{
                      background: "#fdecea",
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      transition: "0.2s",

                      "&:hover": {
                        background: "#f8cfcf",
                        transform: "scale(1.1)",
                      },
                    }}>
                    <DeleteIcon sx={{ color: "#e74c3c" }} />
                  </IconButton>

                  <IconButton
                    onClick={() => handleOpenEditModal(row)}
                    sx={{
                      background: "#e9f7ef",
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      transition: "0.2s",

                      "&:hover": {
                        background: "#c8f2dc",
                        transform: "scale(1.1)",
                      },
                    }}>
                    <EditIcon sx={{ color: "#2ecc71" }} />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#dbe9f6",
                }}>
                {["#", "رقم القاعة", "السعة", "التجهيزات", "الإجراءات"].map(
                  (head) => (
                    <TableCell
                      key={head}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        border: "1px solid #0A1931",
                      }}>
                      {head}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {halls.map((row) => (
                <TableRow key={row.id}>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid #0A1931" }}>
                    {row.id}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ border: "1px solid #0A1931" }}>
                    {row.hall}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ border: "1px solid #0A1931", fontWeight: "bold" }}>
                    {row.capacity}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ border: "1px solid #0A1931" }}>
                    {row.equipment}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ border: "1px solid #0A1931" }}>
                    <Stack direction="row" justifyContent="center" gap={2}>
                      <IconButton
                        onClick={() => handleOpenDelete(row)}
                        sx={{
                          background: "#fdecea",
                          width: 40,
                          height: 40,
                        }}>
                        <DeleteIcon sx={{ color: "#e74c3c" }} />
                      </IconButton>

                      <IconButton
                        onClick={() => handleOpenEditModal(row)}
                        sx={{
                          background: "#e9f7ef",
                          width: 40,
                          height: 40,
                        }}>
                        <EditIcon sx={{ color: "#2ecc71" }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>


      <Stack
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
        mt={3}>
        <Stack direction="row" spacing={3} gap={2}>
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

        <Typography sx={{ fontWeight: "bold" }}>
          عرض {halls.length} من 28 قاعة
        </Typography>
      </Stack>
    </Box>
  );
};

export default HallsManagement;


