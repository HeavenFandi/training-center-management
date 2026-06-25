import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { TCourse, TSession } from "../../../types/cardType";

interface SessionsListModalProps {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
  onEditSession: (session: TSession, course: TCourse) => void;
  onDeleteSession: (session: TSession, course: TCourse) => void;
  onSessionClick: (session: TSession, course: TCourse) => void;
}

const SessionsListModal: React.FC<SessionsListModalProps> = ({
  open,
  onClose,
  course,
  onEditSession,
  onDeleteSession,
  onSessionClick,
}) => {
  if (!course) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" fontWeight="900" color="#133E65" sx={{ fontFamily: "Tajawal" }}>
          الدورات المتاحة - {course.title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        {course.sessions && course.sessions.length > 0 ? (
          <List sx={{ p: 0 }}>
            {course.sessions.map((session) => (
              <ListItem
                  key={session.id}
                  sx={{
                    p: "12px 16px",
                    mb: 2,
                    borderRadius: "16px",
                    backgroundColor: "rgba(19, 62, 101, 0.03)",
                    border: "1px solid rgba(19, 62, 101, 0.05)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2, 
                    "&:hover": {
                      backgroundColor: "rgba(19, 62, 101, 0.05)",
                    }
                  }}
                  onClick={() => onSessionClick(session, course)}
                >
                  <ListItemIcon sx={{ minWidth: "auto", m: 0 }}>
                    <EventNoteIcon color="primary" />
                  </ListItemIcon>

                  <Box sx={{ flex: 1, minWidth: 0, textAlign: "right" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: "bold",
                        fontFamily: "Tajawal",
                        color: "#133E65",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {session.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.85rem",
                        fontFamily: "Tajawal",
                        color: "#666",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {session.semester} | {session.status}
                    </Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2, 
                      flexShrink: 0,
                      mr: 3, 
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSession(session, course);
                      }}
                      sx={{ 
                        color: "#2e7d32", 
                        bgcolor: "rgba(46, 125, 50, 0.08)",
                        width: 38, 
                        height: 38,
                        "&:hover": { bgcolor: "rgba(46, 125, 50, 0.15)" }
                      }}
                    >
                      <EditIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session, course);
                      }}
                      sx={{ 
                        color: "#d32f2f", 
                        bgcolor: "rgba(211, 47, 47, 0.08)",
                        width: 38,
                        height: 38,
                        "&:hover": { bgcolor: "rgba(211, 47, 47, 0.15)" }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSessionClick(session, course);
                      }}
                      sx={{ 
                        color: "#133E65", 
                        bgcolor: "rgba(19, 62, 101, 0.08)",
                        width: 38,
                        height: 38,
                        "&:hover": { bgcolor: "rgba(19, 62, 101, 0.15)" }
                      }}
                    >
                      <PlayCircleOutlineIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </Box>
                </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "Tajawal" }}>
              لا توجد دورات مضافة لهذا الكورس بعد
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SessionsListModal;


