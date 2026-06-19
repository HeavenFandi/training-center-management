import React from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { TSession } from "../../../../types/cardType";

interface CourseSessionsListProps {
  sessions?: TSession[];
  onSessionClick: (session: TSession) => void;
}

const CourseSessionsList: React.FC<CourseSessionsListProps> = ({ sessions, onSessionClick }) => {
  return (
    <Box>
      <Typography fontWeight="bold" fontSize={13} mb={0.8} color="#333" fontFamily="Tajawal">
        الدورات المتاحة:
      </Typography>

      <Box sx={{ maxHeight: "150px", overflowY: "auto", pr: 1 }}>
        {sessions && sessions.length > 0 ? (
          <List sx={{ p: 0 }}>
            {sessions.map((session) => (
              <ListItem
                key={session.id}
                onClick={() => onSessionClick(session)}
                sx={{
                  p: 1,
                  mb: 1,
                  borderRadius: "8px",
                  backgroundColor: "rgba(224, 224, 224, 0.4)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                }}
              >
                <ListItemIcon sx={{ minWidth: "35px" }}>
                  <EventNoteIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={session.title}
                  secondary={`${session.startDate || session.date || ""} | ${session.startTime || session.time || ""}`}
                  primaryTypographyProps={{ fontSize: "13px", fontWeight: "bold", fontFamily: "Tajawal" }}
                  secondaryTypographyProps={{ fontSize: "11px", fontFamily: "Tajawal" }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography fontSize={11} color="#888" sx={{ fontFamily: "Tajawal", py: 2, textAlign: "center" }}>
            لا توجد دورات مضافة بعد
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(CourseSessionsList);


