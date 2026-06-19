import React from "react";
import { Grid, Card, Typography, Stack, IconButton, Button, Box, Divider, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { TCourse, TSession } from "../../../../types/cardType";

interface CourseManagementGridProps {
  courses: TCourse[];
  onView: (course: TCourse) => void;
  onEdit: (course: TCourse) => void;
  onAddSession: (course: TCourse) => void;
  onShowSessions: (course: TCourse) => void;
}

const CourseManagementGrid: React.FC<CourseManagementGridProps> = ({
  courses,
  onView,
  onEdit,
  onAddSession,
  onShowSessions,
}) => {
  return (
    <Grid container spacing={3} dir="rtl" sx={{ width: "100%", m: 0 }} alignItems="flex-start">
      {courses.map((course) => (
        <Grid size={{ xs: 12, xl: 6, md: 6 }} key={course.id}>
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              borderRadius: "20px",
              backgroundColor: "rgba(248, 250, 252, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="h6" fontWeight="900" color="#133E65" sx={{ fontFamily: "Tajawal", fontSize: "1.1rem" }}>
                    {course.title}
                  </Typography>
                  <Chip 
                    label={course.category} 
                    size="small" 
                    sx={{ height: "20px", fontSize: "0.7rem", fontFamily: "Tajawal", bgcolor: "rgba(19, 62, 101, 0.08)", color: "#133E65" }} 
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={1} sx={{ 
                  fontFamily: "Tajawal",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "0.8rem",
                  lineHeight: 1.4
                }}>
                  {course.description}
                </Typography>

                <Stack direction="column" spacing={0.5} mb={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption" fontWeight="bold" color="#133E65" sx={{ fontFamily: "Tajawal" }}>
                      (متطلبات الكورس / المدرب):
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Tajawal" }}>
                      {course.requirements || "لا يوجد"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption" fontWeight="bold" color="#133E65" sx={{ fontFamily: "Tajawal" }}>
                      عدد الساعات:
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Tajawal" }}>
                      {course.duration} ساعة
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onEdit(course)}
                  startIcon={<EditIcon sx={{ ml: 1, fontSize: "0.9rem !important" }} />}
                  sx={{ 
                    bgcolor: "rgba(46, 125, 50, 0.1)", 
                    color: "#2e7d32", 
                    borderRadius: "10px",
                    width: "100%",
                    mb: 1.5,
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    fontFamily: "Tajawal",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "rgba(46, 125, 50, 0.2)", boxShadow: "none" } 
                  }}
                >
                  تعديل معلومات الكورس
                </Button>
              </Box>

              <Grid container spacing={1} mt="auto">
                <Grid size={{ xs: 12, xl: 6, lg: 6, md: 12, sm: 12 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => onShowSessions(course)}
                    startIcon={<EventNoteIcon sx={{ ml: 1, fontSize: "1rem !important" }} />}
                    sx={{
                      borderRadius: "10px",
                      fontSize: { xs: "0.8rem", sm: "0.75rem" },
                      fontWeight: "bold",
                      fontFamily: "Tajawal",
                      color: "#133E65",
                      borderColor: "rgba(19, 62, 101, 0.2)",
                      whiteSpace: "nowrap",
                      height: "40px",
                      "&:hover": { bgcolor: "rgba(19, 62, 101, 0.05)", borderColor: "#133E65" }
                    }}
                  >
                    الدورات المتاحة ({course.sessions?.length || 0})
                  </Button>
                </Grid>

                <Grid size={{ xs: 12, xl: 6, lg: 6, md: 12, sm: 12 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<AddIcon sx={{ ml: 1, fontSize: "0.9rem !important" }} />}
                    onClick={() => onAddSession(course)}
                    sx={{
                      bgcolor: "#133E65",
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      fontFamily: "Tajawal",
                      whiteSpace: "nowrap",
                      height: "40px",
                      "&:hover": { bgcolor: "#1e5a91" },
                    }}
                  >
                    إضافة دورة
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(CourseManagementGrid);


