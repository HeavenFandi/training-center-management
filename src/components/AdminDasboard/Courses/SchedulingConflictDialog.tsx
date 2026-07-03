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
  Stack,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  onSelectSuggestion: (suggestion: any, onSuccess?: () => void) => Promise<void>;
  submitting: boolean;
  onSuccess?: () => void;
}

const SchedulingConflictDialog: React.FC<Props> = ({
  open,
  onClose,
  conflictData,
  onSelectSuggestion,
  submitting,
  onSuccess,
}) => {
  if (!conflictData) return null;

  // Get conflict count from data
  const conflictCount = conflictData.conflictingDates?.length || 
                       conflictData.conflicts?.length || 
                       conflictData.count || 
                       (conflictData.message?.match(/\d+/) ? parseInt(conflictData.message.match(/\d+/)![0]) : 0);

  // Helper to render a conflict item showing all properties
  const renderConflictItem = (conflict: any, index: number) => {
    const entries = Object.entries(conflict);
    return (
      <ListItem key={index} sx={{ py: 1 }}>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {entries.map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ fontFamily: "Tajawal" }}
                />
              ))}
            </Box>
          }
        />
      </ListItem>
    );
  };

  // Helper to render a suggestion card
  const renderSuggestion = (suggestion: any, index: number) => {
    // Filter out unwanted keys: note, type, roomId, id, roomid, etc.
    const unwantedKeys = ["note", "type", "roomid", "id", "room_id"];
    const entries = Object.entries(suggestion).filter(([key]) => {
      const lowerKey = key.toLowerCase();
      return !unwantedKeys.some(unwanted => lowerKey.includes(unwanted));
    });
    
    // Try to find a label or title, exclude note
    let label = suggestion.label || suggestion.title || suggestion.name || suggestion.number || `اقتراح ${index + 1}`;
    
    // Clean label from note prefixes
    label = label.replace(/^note:/i, "").replace(/:note:$/i, "").trim();
    
    return (
      <Card
        key={index}
        sx={{
          p: 2,
          borderRadius: "12px",
          border: "1px solid rgba(19, 62, 101, 0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#133E65",
            boxShadow: "0 4px 12px rgba(19, 62, 101, 0.1)",
          },
          ...(submitting && { opacity: 0.6, cursor: "not-allowed" }),
        }}
        onClick={() => {
          console.log("=== Suggestion card clicked ===");
          console.log("suggestion:", suggestion);
          if (!submitting) onSelectSuggestion(suggestion, onSuccess);
        }}
      >
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CheckCircleIcon sx={{ color: "#133E65", fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight="bold" color="#133E65">
              {label}
            </Typography>
          </Box>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {entries.map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontFamily: "Tajawal" }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  };

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
          <DialogTitle
            sx={{
              p: 0,
              m: 0,
              fontWeight: "900",
              color: "#133E65",
              fontFamily: "Tajawal",
              fontSize: "1.25rem",
            }}
          >
            تضارب في المواعيد
          </DialogTitle>
        </Box>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff" }} disabled={submitting}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ fontFamily: "Tajawal", p: 3, pt: 0, bgcolor: "#F8FAFC" }}>
        {/* Backend Message */}
        {conflictData.message && !conflictData.message.toLowerCase().includes("conflict detected on") && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
              fontFamily: "Tajawal",
              bgcolor: "#fee2e2",
              color: "#991b1b",
            }}
            icon={<ErrorIcon sx={{ color: "#ef4444" }} />}
          >
            {conflictData.message}
          </Alert>
        )}



       
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
                      <Box sx={{ fontWeight: "bold" }}>
                        {hall.name ||
                          hall.number ||
                       
                         
                          `قاعة ${index + 1}`}
                      </Box>
                      {hall.capacity && (
                        <Box sx={{ fontSize: "0.75rem" }}>سعة: {hall.capacity}</Box>
                      )}
                      {hall.building && (
                        <Box sx={{ fontSize: "0.75rem" }}>مبنى: {hall.building}</Box>
                      )}
                      {hall.floor && (
                        <Box sx={{ fontSize: "0.75rem" }}>طابق: {hall.floor}</Box>
                      )}
                    </Box>
                  }
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    console.log("=== Available hall chip clicked ===");
                    console.log("hall:", hall);
                    if (!submitting) onSelectSuggestion(hall, onSuccess);
                  }}
                  sx={{
                    py: 2.5,
                    px: 1.5,
                    minWidth: 120,
                    fontFamily: "Tajawal",
                    borderRadius: "12px",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(19,62,101,0.05)",
                      borderColor: "#133E65",
                    },
                    ...(submitting && { opacity: 0.6, cursor: "not-allowed" }),
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
              <InfoIcon sx={{ fontSize: 20, verticalAlign: "middle", ml: 0.5 }} />
              الاقتراحات
            </Typography>
            <Stack direction="column" gap={2}>
              {conflictData.suggestions.map((suggestion, index) =>
                renderSuggestion(suggestion, index)
              )}
            </Stack>
          </Box>
        )}

        {/* Close Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            pt: 2,
            borderTop: "1px solid rgba(19, 62, 101, 0.1)",
          }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: "#133E65",
              "&:hover": { bgcolor: "#1e5a91" },
              "&:disabled": { bgcolor: "#94a3b8" },
              borderRadius: "10px",
              px: 4,
              height: "44px",
              fontSize: "0.95rem",
              fontFamily: "Tajawal",
              fontWeight: "bold",
            }}
          >
            {submitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: "#fff" }} />
                جاري الحفظ...
              </Box>
            ) : (
              "إغلاق"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingConflictDialog;
