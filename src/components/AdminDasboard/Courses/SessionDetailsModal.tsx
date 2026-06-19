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
      maxWidth="sm" 
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        }
      }}
    >
      <DialogTitle sx={{ fontFamily: "Tajawal", fontWeight: "bold", bgcolor: "rgba(248, 249, 250, 0.4)" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "Tajawal" }}>
            تفاصيل الدورة: {session.title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <SessionBasicInfo session={session} course={course} />
        <Divider sx={{ mb: 2 }} />
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


