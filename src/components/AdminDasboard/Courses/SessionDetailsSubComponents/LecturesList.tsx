import React from "react";
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Divider, 
  Tooltip, 
  CircularProgress,
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { TLecture } from "../../../../types/cardType";
import { LectureResponse } from "../../../../api/trainingSessionApi";

interface LecturesListProps {
  lectures: TLecture[] | LectureResponse[];
  loading?: boolean;
  error?: string | null;
  onAddLecture: () => void;
  onEditLecture: (lecture: any) => void;
  onDeleteLecture: (lectureId: number) => void;
}

const formatTime = (time: any) => {
  if (!time) return "00:00";
  
  // If it's already a string (like "HH:mm"), just return it
  if (typeof time === "string") {
    return time;
  }
  
  // If it's an object with hour/minute
  const hour = typeof time.hour === "number" ? time.hour.toString().padStart(2, "0") : "00";
  const minute = typeof time.minute === "number" ? time.minute.toString().padStart(2, "0") : "00";
  return `${hour}:${minute}`;
};

const LecturesList: React.FC<LecturesListProps> = ({ 
  lectures, 
  loading, 
  error, 
  onAddLecture, 
  onEditLecture, 
  onDeleteLecture 
}) => {
  
  // Check if it's a LectureResponse array
  const isLectureResponse = (item: any): item is LectureResponse => {
    return item && typeof item === "object" && "lectureDate" in item && "startTime" in item;
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "Tajawal", fontSize: "1.1rem" }}>
          المحاضرات ({lectures.length})
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          size="small"
          onClick={onAddLecture}
          sx={{
            fontFamily: "Tajawal",
            fontWeight: "bold",
            bgcolor: "#133E65",
            "&:hover": { bgcolor: "#0d2d4a" },
            borderRadius: "8px",
          }}
        >
          إضافة محاضرة
        </Button>
      </Stack>

      <Box sx={{ border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ fontFamily: "Tajawal" }}>
              {error}
            </Alert>
          </Box>
        ) : lectures.length > 0 ? (
          <List sx={{ p: 0 }}>
            {lectures.map((lecture, index) => (
              <React.Fragment key={(lecture as any).id}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="تعديل">
                        <IconButton size="small" onClick={() => onEditLecture(lecture)}>
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="إلغاء المحاضرة">
                        <IconButton size="small" onClick={() => onDeleteLecture((lecture as any).id)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                  sx={{ py: 1.5 }}
                >
                  <Stack direction="column" spacing={0.5} sx={{ flex: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ fontFamily: "Tajawal", fontSize: "0.95rem", fontWeight: "bold" }}
                    >
                      {`${index + 1}. ${isLectureResponse(lecture) ? lecture.sessionName : (lecture as TLecture).title}`}
                    </Typography>
                    {isLectureResponse(lecture) ? (
                      <>
                        <Typography variant="body2" sx={{ fontFamily: "Tajawal", fontSize: "0.85rem" }}>
                          {lecture.lectureDate} | {formatTime(lecture.startTime)} - {formatTime(lecture.endTime)}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: "Tajawal" }}>
                          قاعة: {lecture.classroomNumber} | مدرس: {lecture.teacherName}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" sx={{ fontFamily: "Tajawal", fontSize: "0.85rem" }}>
                        {(lecture as TLecture).date || ""} | {(lecture as TLecture).startTime || ""} - {(lecture as TLecture).endTime || ""}
                      </Typography>
                    )}
                  </Stack>
                </ListItem>
                {index < lectures.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography sx={{ fontFamily: "Tajawal" }}>لا توجد محاضرات متاحة لهذه الدورة التدريبية.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(LecturesList);


