import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SessionBasicInfo from "./SessionDetailsSubComponents/SessionBasicInfo";
import LecturesList from "./SessionDetailsSubComponents/LecturesList";
import LectureDialog from "./SessionDetailsSubComponents/LectureDialog";
import { TCourse, TSession, TLecture } from "../../../types/cardType";

interface SessionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  session: TSession | null;
  course: TCourse;
  onUpdateSession: (updatedSession: TSession) => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  open,
  onClose,
  session,
  course,
  onUpdateSession,
}) => {
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<TLecture | null>(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureStartTime, setLectureStartTime] = useState("");
  const [lectureEndTime, setLectureEndTime] = useState("");
  const [lectureDate, setLectureDate] = useState("");

  if (!session || !course) return null;

  const handleOpenAddLecture = () => {
    setEditingLecture(null);
    setLectureTitle("");
    setLectureStartTime("");
    setLectureEndTime("");
    setLectureDate("");
    setIsLectureDialogOpen(true);
  };

  const handleOpenEditLecture = (lecture: TLecture) => {
    setEditingLecture(lecture);
    setLectureTitle(lecture.title);
    setLectureStartTime(lecture.startTime || "");
    setLectureEndTime(lecture.endTime || "");
    setLectureDate(lecture.date || "");
    setIsLectureDialogOpen(true);
  };

  const handleSaveLecture = () => {
    if (!lectureTitle.trim()) return;

    let updatedLectures: TLecture[];
    const lectureData = {
      title: lectureTitle,
      startTime: lectureStartTime,
      endTime: lectureEndTime,
      date: lectureDate,
    };

    if (editingLecture) {
      updatedLectures = session.lectures.map((l) =>
        l.id === editingLecture.id ? { ...l, ...lectureData } : l
      );
    } else {
      updatedLectures = [
        ...session.lectures,
        { id: Date.now(), ...lectureData },
      ];
    }

    onUpdateSession({ ...session, lectures: updatedLectures });
    setIsLectureDialogOpen(false);
  };

  const handleDeleteLecture = (lectureId: number) => {
    const updatedLectures = session.lectures.filter((l) => l.id !== lectureId);
    onUpdateSession({ ...session, lectures: updatedLectures });
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
          borderRadius: "24px",
          backgroundColor: "#fff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: "Tajawal", 
        fontWeight: 700, 
        bgcolor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        px: 3,
        py: 2.5
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="700" sx={{ fontFamily: "Tajawal", color: "#0f172a" }}>
            تفاصيل الجلسة: {session.title}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ 
        mt: 0, 
        p: 3,
        maxHeight: "80vh",
        overflowY: "auto"
      }}>
        <SessionBasicInfo session={session} course={course} />
        <Divider sx={{ my: 3 }} />
        <LecturesList 
          lectures={session.lectures} 
          onAddLecture={handleOpenAddLecture} 
          onEditLecture={handleOpenEditLecture} 
          onDeleteLecture={handleDeleteLecture}
        />
      </DialogContent>

      <LectureDialog
        open={isLectureDialogOpen}
        onClose={() => setIsLectureDialogOpen(false)}
        onSave={handleSaveLecture}
        editingLecture={editingLecture}
        lectureTitle={lectureTitle}
        setLectureTitle={setLectureTitle}
        lectureDate={lectureDate}
        setLectureDate={setLectureDate}
        lectureStartTime={lectureStartTime}
        setLectureStartTime={setLectureStartTime}
        lectureEndTime={lectureEndTime}
        setLectureEndTime={setLectureEndTime}
      />
    </Dialog>
  );
};

export default SessionDetailsModal;


