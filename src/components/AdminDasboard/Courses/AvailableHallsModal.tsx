import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import GroupIcon from "@mui/icons-material/Group";
import DevicesIcon from "@mui/icons-material/Devices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Hall, TRoomSuggestion } from "../../../types/cardType";

export const hallsData: Hall[] = [
  {
    id: "A01",
    name: "قاعة A01",
    capacity: 25,
    equipment: ["بروجيكتر", "تكييف", "شاشة ذكية"],
    status: "available",
  },
  {
    id: "B01",
    name: "قاعة B01",
    capacity: 40,
    equipment: ["مختبر حاسوب", "بروجيكتر", "تكييف"],
    status: "busy",
  },
  {
    id: "C01",
    name: "قاعة C01",
    capacity: 15,
    equipment: ["سبورة بيضاء", "تكييف"],
    status: "available",
  },
  {
    id: "D01",
    name: "قاعة D01",
    capacity: 30,
    equipment: ["بروجيكتر", "نظام صوتي", "تكييف"],
    status: "available",
  },
];

const mockSuggestions: TRoomSuggestion[] = [
  {
    suggestionType: "ROOM_SWAP",
    roomId: 101,
    roomNumber: "B02",
    date: "2024-05-01",
    startTime: "10:00",
    endTime: "12:00",
    note: "يمكن تبديل القاعة مع دورة البرمجة",
  },
  {
    suggestionType: "SERIES_SHIFT",
    roomId: 102,
    roomNumber: "A01",
    date: "2024-05-02",
    startTime: "14:00",
    endTime: "16:00",
    note: "تغيير موعد السلسلة بالكامل لتجنب التعارض",
  },
];

interface AvailableHallsModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (hall: Hall) => void;
  selectedHallId?: string;
}

const AvailableHallsModal: React.FC<AvailableHallsModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
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
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#133E65", color: "white" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <MeetingRoomIcon />
            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "Tajawal" }}>
              القاعات التدريبية المتاحة
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 1 }}>
        <Typography variant="body2" color="text.secondary" mb={3} sx={{ fontFamily: "Tajawal", fontWeight: "500" }}>
          قائمة بجميع القاعات التدريبية المتوفرة حالياً في المعهد مع مقترحات لحل التعارضات.
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#133E65" sx={{ fontFamily: "Tajawal", display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon color="success" /> القاعات المتاحة
        </Typography>

        <Grid container spacing={2} mb={4}>
          {hallsData
            .filter((hall) => hall.status === "available")
            .map((hall) => (
            <Grid size={{ xs: 12, sm: 6 }} key={hall.id}>
              <Card
                onClick={() => {
                  if (onSelect) {
                    onSelect(hall);
                    onClose();
                  }
                }}
                sx={{
                  borderRadius: "15px",
                  backgroundColor: "#ffffff",
                  border: "1px solid",
                  borderColor: "rgba(0, 0, 0, 0.08)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "#133E65",
                    boxShadow: "0 8px 30px rgba(19, 62, 101, 0.1)",
                  },
                  position: "relative",
                  overflow: "visible",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: 20,
                    bgcolor: "#10b981",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    zIndex: 1,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 14 }} />
                  متاحة الآن
                </Box>

                <CardContent sx={{ pt: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="#1a2c4e" sx={{ fontFamily: "Tajawal" }}>
                        {hall.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Tajawal" }}>
                        كود القاعة: #{hall.id}
                      </Typography>
                    </Box>
                    <MeetingRoomIcon sx={{ color: "#133E65", fontSize: 30, opacity: 0.2 }} />
                  </Stack>

                  <Divider sx={{ my: 1.5, opacity: 0.5 }} />

                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <DevicesIcon sx={{ fontSize: 18, color: "#64748b", mt: 0.3 }} />
                      <Box>
                        <Typography fontSize={14} mb={0.5} sx={{ fontFamily: "Tajawal", color: "#475569" }}>
                          التجهيزات المتوفرة:
                        </Typography>
                        <Stack direction="row" gap={0.5} flexWrap="wrap">
                          {hall.equipment.map((item) => (
                            <Chip
                              key={item}
                              label={item}
                              size="small"
                              sx={{
                                fontSize: "0.65rem",
                                height: "20px",
                                bgcolor: "#f1f5f9",
                                color: "#64748b",
                                fontFamily: "Tajawal",
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#133E65" sx={{ fontFamily: "Tajawal", display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#f59e0b" }} /> حلول مقترحة للتعارضات
        </Typography>

        <Grid container spacing={2}>
          {mockSuggestions.map((suggestion, index) => (
            <Grid size={{ xs: 12 }} key={index}>
              <Card
                sx={{
                  borderRadius: "15px",
                  bgcolor: "#fffaf0",
                  border: "1px dashed #f59e0b",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#fff4e5",
                    transform: "translateX(-5px)",
                    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.1)",
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ bgcolor: "#f59e0b", color: "white", p: 1, borderRadius: "10px", display: "flex" }}>
                        {suggestion.suggestionType === "ROOM_SWAP" ? <SwapHorizIcon /> : <ScheduleIcon />}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontFamily: "Tajawal" }}>
                          {suggestion.suggestionType === "ROOM_SWAP" ? "تبديل قاعة" : 
                           suggestion.suggestionType === "SERIES_SHIFT" ? "إزاحة السلسلة" : "حل جزئي"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "Tajawal" }}>
                          {suggestion.roomNumber} | {suggestion.date} | {suggestion.startTime} - {suggestion.endTime}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Box sx={{ flex: 1, minWidth: "200px" }}>
                      <Typography variant="body2" sx={{ fontFamily: "Tajawal", color: "#666", bgcolor: "white", p: 1, borderRadius: "8px", border: "1px solid #eee" }}>
                        <InfoIcon sx={{ fontSize: 14, ml: 0.5, verticalAlign: "middle" }} />
                        {suggestion.note}
                      </Typography>
                    </Box>

                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{ 
                        bgcolor: "#f59e0b", 
                        "&:hover": { bgcolor: "#d97706" },
                        fontFamily: "Tajawal",
                        fontWeight: "bold",
                        borderRadius: "8px"
                      }}
                    >
                      تطبيق الحل
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AvailableHallsModal;


