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
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import TableSkeleton from "../../components/Common/TableSkeleton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ComputerIcon from "@mui/icons-material/Computer";
import GenericDeleteModal from "../../components/Modal/DeleteModal";
import AddHallModal from "../../components/Modal/AddHallModal";
import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actGetInstituteByUserId } from "../../store/Institutes/institutesSlice";
import { actGetClassroomsByInstituteId, actUpdateClassroom, actCreateClassroom, actDeleteClassroom } from "../../store/Classrooms/classroomsSlice";
import { Classroom } from "../../api/classroomApi";
import { useSnackbar } from "../../Context/SnackbarContext";

const HallsManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { user } = useAppSelector((state) => state.auth);
  const { currentInstitute } = useAppSelector((state) => state.institutes);
  const { list: classrooms, loading, error, updateLoading, updateError, createLoading, createError, deleteLoading, deleteError } = useAppSelector((state) => state.classrooms);

  // Fetch institute by userId on mount
  useEffect(() => {
    const userId = user?.id;
    if (userId && !currentInstitute) {
      dispatch(actGetInstituteByUserId(userId));
    }
  }, [dispatch, user, currentInstitute]);

  // Fetch classrooms once we have institute id
  useEffect(() => {
    const instituteId = currentInstitute?.id;
    if (instituteId) {
      dispatch(actGetClassroomsByInstituteId(instituteId));
    }
  }, [dispatch, currentInstitute?.id]);

  const [openDelete, setOpenDelete] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState<Classroom | null>(null);
  const [editingHall, setEditingHall] = useState<Classroom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Summary stats
  const totalRooms = classrooms.length;
  const totalCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0);

  // Filtered classrooms
  const filteredClassrooms = classrooms.filter(room => 
    room.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
    room.availableDevices.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDelete = (hall: Classroom) => {
    setSelectedHall(hall);
    setOpenDelete(true);
  };

  const handleOpenAddModal = () => {
    setEditingHall(null);
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (hall: Classroom) => {
    setEditingHall(hall);
    setOpenAddModal(true);
  };

  const handleSaveHall = async (hallData: {
    hall: string;
    capacity: number;
    equipment: string;
  }) => {
    if (currentInstitute) {
      try {
        if (editingHall) {
          const resultAction = await dispatch(
            actUpdateClassroom({
              id: editingHall.id,
              data: {
                number: hallData.hall,
                capacity: hallData.capacity,
                availableDevices: hallData.equipment,
                images: editingHall.images,
                instituteId: currentInstitute.id,
              },
            })
          );
          
          if (actUpdateClassroom.fulfilled.match(resultAction)) {
            showSnackbar("تم تعديل القاعة بنجاح", "success");
            setOpenAddModal(false);
            setEditingHall(null);
          } else if (actUpdateClassroom.rejected.match(resultAction)) {
            showSnackbar(typeof resultAction.payload === "string" ? resultAction.payload : "حدث خطأ أثناء تعديل القاعة", "error");
          }
        } else {
          const resultAction = await dispatch(
            actCreateClassroom({
              number: hallData.hall,
              capacity: hallData.capacity,
              availableDevices: hallData.equipment,
              images: null,
              instituteId: currentInstitute.id,
            })
          );
          
          if (actCreateClassroom.fulfilled.match(resultAction)) {
            showSnackbar("تم إضافة القاعة بنجاح", "success");
            setOpenAddModal(false);
          } else if (actCreateClassroom.rejected.match(resultAction)) {
            showSnackbar(typeof resultAction.payload === "string" ? resultAction.payload : "حدث خطأ أثناء إضافة القاعة", "error");
          }
        }
      } catch (error) {
        console.error("Error saving classroom:", error);
        showSnackbar("حدث خطأ أثناء حفظ القاعة", "error");
      }
    }
  };

  const handleDelete = async () => {
    if (selectedHall) {
      try {
        const resultAction = await dispatch(actDeleteClassroom(selectedHall.id));
        
        if (actDeleteClassroom.fulfilled.match(resultAction)) {
          showSnackbar("تم حذف القاعة بنجاح", "success");
          setOpenDelete(false);
          setSelectedHall(null);
        } else if (actDeleteClassroom.rejected.match(resultAction)) {
          showSnackbar(typeof resultAction.payload === "string" ? resultAction.payload : "حدث خطأ أثناء حذف القاعة", "error");
        }
      } catch (error) {
        console.error("Error deleting classroom:", error);
        showSnackbar("حدث خطأ أثناء حذف القاعة", "error");
      }
    }
  };
  
  return (
    <Box dir="rtl" sx={{ p: { xs: 2, sm: 4 } }}>
      {/* Header */}
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
                width: 32,
                height: 32,
                borderRadius: "50%",
                transition: "all 0.2s ease",
              }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" color="#091c39">
              إدارة القاعات
            </Typography>
          </Box>
          <Typography color="#666" sx={{ fontSize: 15 }}>
            إضافة وتعديل بيانات القاعات التدريبية
          </Typography>
        </Box>

       <Button
  variant="contained"
  onClick={handleOpenAddModal}
  startIcon={<MeetingRoomIcon />}
  sx={{
    backgroundColor: "#091c39",
    color: "white",
    borderRadius: "12px",
    px: { xs: 2, sm: 4 },
    py: 1.5,
    fontWeight: 700,
    fontSize: "15px",
     gap: "10px",
    boxShadow: "0 4px 12px rgba(9, 28, 57, 0.2)",
    transition: "all 0.2s ease",

  

    "&:hover": {
      backgroundColor: "#0d2d4a",
      boxShadow: "0 6px 16px rgba(9, 28, 57, 0.3)",
      transform: "translateY(-2px)",
    },
  }}
>
  إضافة قاعة جديدة
</Button>
      </Stack>

      {/* Search Field */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="ابحث عن قاعة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#666" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery("")} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
sx={{
  width: "400px",
  backgroundColor: "transparent",
  borderRadius: "12px",

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none", // 🔥 إزالة البوردر
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },

  "& .MuiInputBase-root": {
    backgroundColor: "transparent",
    fontFamily: "Tajawal",
    fontSize: "16px",
  },

  "& .MuiInputBase-input": {
    py: 1.5,
    px: 2,
    "&::placeholder": {
      color: "#555",
      opacity: 1,
      fontWeight: 500,
    },
  },
}}
        />
      </Box>



      {/* Modals */}
      <AddHallModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleSaveHall}
        initialData={editingHall ? { hall: editingHall.number, capacity: editingHall.capacity, equipment: editingHall.availableDevices } : undefined}
        loading={editingHall ? updateLoading : createLoading}
      />

      <GenericDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        itemName={selectedHall?.number}
      />

      {/* Table Container */}
      {loading ? (
        <TableSkeleton columnsCount={5} rowsCount={5} showMobileView />
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 12 }}>
          <Typography color="error" sx={{ fontSize: 16 }}>{error}</Typography>
        </Box>
      ) : (
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
            {filteredClassrooms.map((row) => (
              <Box
                key={row.id}
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
                <Typography fontWeight="bold" color="#091c39" sx={{ mb: 2, fontSize: 18 }}>
                  {row.number}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <PeopleIcon sx={{ color: "#666", fontSize: 18 }} />
                  <Typography color="#666">السعة:</Typography>
                  <Chip
                    label={row.capacity}
                    size="small"
                    sx={{
                      backgroundColor: "#e3f2fd",
                      color: "#091c39",
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  {row.availableDevices.split(/[,،]/).map((item, idx) => (
                    item.trim() && (
                      <Chip
                        key={idx}
                        label={item.trim()}
                        size="small"
                        sx={{
                          backgroundColor: "#f5f5f5",
                          color: "#444",
                          fontWeight: 500,
                        }}
                      />
                    )
                  ))}
                </Stack>

                <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
                  <Tooltip title="تعديل القاعة">
                    <IconButton
                      onClick={() => handleOpenEditModal(row)}
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

                  <Tooltip title="حذف القاعة">
                    <IconButton
                      onClick={() => handleOpenDelete(row)}
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
                {["#", "رقم القاعة", "السعة", "التجهيزات", "الإجراءات"].map(
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
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClassrooms.map((row, index) => (
                <TableRow
                  key={row.id}
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
                    {row.id}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid #eef2f6",
                      py: 2,
                      fontWeight: 600,
                      color: "#091c39",
                    }}
                  >
                    {row.number}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid #eef2f6",
                      py: 2,
                    }}
                  >
                    <Chip
                      icon={<PeopleIcon />}
                      label={row.capacity}
                      size="medium"
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#091c39",
                        fontWeight: 700,
                        "& .MuiChip-icon": {
                          color: "#091c39",
                        },
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
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      justifyContent="center"
                    >
                      {row.availableDevices.split(/[,،]/).map((item, idx) => (
                        item.trim() && (
                          <Chip
                            key={idx}
                            label={item.trim()}
                            size="small"
                            sx={{
                              backgroundColor: "#f5f5f5",
                              color: "#444",
                              fontWeight: 500,
                            }}
                          />
                        )
                      ))}
                    </Stack>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid #eef2f6",
                      py: 2,
                    }}
                  >
                    <Stack direction="row" justifyContent="center" gap={1}>
                      <Tooltip title="تعديل القاعة">
                        <IconButton
                          onClick={() => handleOpenEditModal(row)}
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

                      <Tooltip title="حذف القاعة">
                        <IconButton
                          onClick={() => handleOpenDelete(row)}
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
      )}
    </Box>
  );
};

export default HallsManagement;
