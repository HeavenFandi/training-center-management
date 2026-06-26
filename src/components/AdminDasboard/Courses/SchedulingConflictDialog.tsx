import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

interface ConflictData {
  message?: string;
  conflictingDates?: any[];
  availableHalls?: any[];
  suggestions?: any[];
  [key: string]: any;
}

interface Props {
  open: boolean;
  onClose: () => void;
  conflictData: ConflictData | null;
}

const SchedulingConflictDialog: React.FC<Props> = ({ open, onClose, conflictData }) => {
  if (!conflictData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          p: 0.5,
          backgroundColor: "#F8FAFC",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#F8FAFC",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ErrorIcon sx={{ color: "#ef4444", fontSize: 32 }} />
          <DialogTitle sx={{ p: 0, m: 0 }}>
            <Typography variant="h6" fontWeight="900" color="#133E65" sx={{ fontFamily: "Tajawal" }}>
              تعارض في الجدول
            </Typography>
          </DialogTitle>
        </Box>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ fontFamily: "Tajawal", p: 3, pt: 0, bgcolor: "#F8FAFC" }}>
        {/* Backend Message */}
        {conflictData.message && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px", fontFamily: "Tajawal" }}>
            {conflictData.message}
          </Alert>
        )}

        {/* Conflicting Dates */}
        {conflictData.conflictingDates && conflictData.conflictingDates.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#133E65">
              التواريخ المتعارضة
            </Typography>
            <List sx={{ bgcolor: "#fff", borderRadius: "12px", p: 1, maxHeight: 250, overflow: "auto" }}>
              {conflictData.conflictingDates.map((conflict, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {conflict.date && (
                            <Chip
                              label={`التاريخ: ${conflict.date}`}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ fontFamily: "Tajawal" }}
                            />
                          )}
                          {conflict.day && (
                            <Chip
                              label={`اليوم: ${conflict.day}`}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ fontFamily: "Tajawal" }}
                            />
                          )}
                          {conflict.startTime && (
                            <Chip
                              label={`بداية: ${conflict.startTime}`}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ fontFamily: "Tajawal" }}
                            />
                          )}
                          {conflict.endTime && (
                            <Chip
                              label={`نهاية: ${conflict.endTime}`}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ fontFamily: "Tajawal" }}
                            />
                          )}
                          {conflict.currentHall && (
                            <Chip
                              label={`القاعة: ${conflict.currentHall}`}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ fontFamily: "Tajawal" }}
                            />
                          )}
                          {conflict.teacher && (
                            <Chip
                              label={`المدرس: ${conflict.teacher}`}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ fontFamily: "Tajawal" }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < conflictData.conflictingDates.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Available Halls */}
        {conflictData.availableHalls && conflictData.availableHalls.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#133E65">
              <MeetingRoomIcon sx={{ fontSize: 20, verticalAlign: "middle", ml: 0.5 }} />
              القاعات المتاحة
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {conflictData.availableHalls.map((hall, index) => (
                <Chip
                  key={index}
                  label={
                    <Box sx={{ textAlign: "center" }}>
                      <Box sx={{ fontWeight: "bold" }}>{hall.name || hall.number || `قاعة ${index + 1}`}</Box>
                      {hall.capacity && <Box sx={{ fontSize: "0.75rem" }}>سعة: {hall.capacity}</Box>}
                      {hall.building && <Box sx={{ fontSize: "0.75rem" }}>مبنى: {hall.building}</Box>}
                      {hall.floor && <Box sx={{ fontSize: "0.75rem" }}>طابق: {hall.floor}</Box>}
                    </Box>
                  }
                  color="primary"
                  variant="outlined"
                  sx={{
                    py: 2.5,
                    px: 1.5,
                    minWidth: 120,
                    fontFamily: "Tajawal",
                    borderRadius: "12px",
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Suggestions */}
        {conflictData.suggestions && conflictData.suggestions.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#133E65">
              الاقتراحات
            </Typography>
            <Stack direction="column" gap={1}>
              {conflictData.suggestions.map((suggestion, index) => (
                <Alert key={index} severity="info" sx={{ borderRadius: "12px", fontFamily: "Tajawal" }}>
                  {typeof suggestion === "string" ? suggestion : JSON.stringify(suggestion)}
                </Alert>
              ))}
            </Stack>
          </Box>
        )}

        {/* Close Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, pt: 2, borderTop: "1px solid rgba(19, 62, 101, 0.1)" }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              bgcolor: "#133E65",
              "&:hover": { bgcolor: "#1e5a91" },
              borderRadius: "10px",
              px: 4,
              height: "44px",
              fontSize: "0.95rem",
              fontFamily: "Tajawal",
              fontWeight: "bold",
            }}
          >
            موافق
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingConflictDialog;
