import React from "react";
import { Box, Typography, Stack, Button, List, ListItem, ListItemText, IconButton, Divider, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { TLecture } from "../../../../types/cardType";

interface LecturesListProps {
  lectures: TLecture[];
  onAddLecture: () => void;
  onEditLecture: (lecture: TLecture) => void;
  onDeleteLecture: (lectureId: number) => void;
}

const LecturesList: React.FC<LecturesListProps> = ({ lectures, onAddLecture, onEditLecture, onDeleteLecture }) => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "Tajawal", fontSize: "1.1rem" }}>
          الجلسات ({lectures.length})
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
          إضافة جلسة
        </Button>
      </Stack>

      <Box sx={{ border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" }}>
        {lectures.length > 0 ? (
          <List sx={{ p: 0 }}>
            {lectures.map((lecture, index) => (
              <React.Fragment key={lecture.id}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="تعديل">
                        <IconButton size="small" onClick={() => onEditLecture(lecture)}>
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="إلغاء الجلسة">
                        <IconButton size="small" onClick={() => onDeleteLecture(lecture.id)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                  sx={{ py: 1.5 }}
                >
                  <ListItemText
                    primary={`${index + 1}. ${lecture.title}`}
                    secondary={`${lecture.date || ""} | ${lecture.startTime || ""} - ${lecture.endTime || ""}`}
                    primaryTypographyProps={{ fontFamily: "Tajawal", fontSize: "0.95rem", fontWeight: "bold" }}
                    secondaryTypographyProps={{ fontFamily: "Tajawal", fontSize: "0.85rem" }}
                  />
                </ListItem>
                {index < lectures.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography sx={{ fontFamily: "Tajawal" }}>لا توجد جلسات في هذه الدورة بعد.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(LecturesList);


