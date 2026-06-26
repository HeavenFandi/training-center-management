import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { actGetLecturesBySessionId, actUpdateLecture, actDeleteLecture } from "../../../store/Courses/trainingSessionsSlice";
import DeleteModal from "../../Modal/DeleteModal";
import { useSnackbar } from "../../../Context/SnackbarContext";

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
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  
  const sessionLectures = useAppSelector((state) => state.trainingSessions.sessionLectures);
  const sessionLecturesLoading = useAppSelector((state) => state.trainingSessions.sessionLecturesLoading);
  const sessionLecturesError = useAppSelector((state) => state.trainingSessions.sessionLecturesError);
  const lectureUpdateLoading = useAppSelector((state) => state.trainingSessions.lectureUpdateLoading);
  const lectureUpdateError = useAppSelector((state) => state.trainingSessions.lectureUpdateError);
  const lectureDeleteLoading = useAppSelector((state) => state.trainingSessions.lectureDeleteLoading);
  const lectureDeleteError = useAppSelector((state) => state.trainingSessions.lectureDeleteError);
  
  const lectures = session?.id ? (sessionLectures[session.id] || []) : [];
  const lecturesLoading = session?.id ? (sessionLecturesLoading[session.id] || false) : false;
  const lecturesError = session?.id ? (sessionLecturesError[session.id] || null) : null;
  
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<TLecture | null>(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureStartTime, setLectureStartTime] = useState("");
  const [lectureEndTime, setLectureEndTime] = useState("");
  const [lectureDate, setLectureDate] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<number | null>(null);
  const [deleteInitiated, setDeleteInitiated] = useState(false);

  // Helper function to parse "HH:mm" into TimeObject { hour, minute }
  const parseTimeString = (timeStr: string) => {
    if (!timeStr) return { hour: 0, minute: 0 };
    const [hourStr, minuteStr] = timeStr.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    return { 
      hour: isNaN(hour) ? 0 : hour, 
      minute: isNaN(minute) ? 0 : minute,
      second: 0,
      nano: 0
    };
  };

  useEffect(() => {
    if (open && session) {
      if (!(session.id in sessionLectures) || !sessionLectures[session.id]) {
        dispatch(actGetLecturesBySessionId(session.id));
      }
    }
  }, [open, session?.id, dispatch, sessionLectures]);

  // Watch for update success
  useEffect(() => {
    if (!lectureUpdateLoading && !lectureUpdateError && isLectureDialogOpen) {
      setIsLectureDialogOpen(false);
      if (session) {
        dispatch(actGetLecturesBySessionId(session.id)); // Refresh list
        showSnackbar("تم تحديث المحاضرة بنجاح", "success");
      }
    } else if (lectureUpdateError) {
      showSnackbar(lectureUpdateError, "error");
    }
  }, [lectureUpdateLoading, lectureUpdateError, isLectureDialogOpen, dispatch, session, showSnackbar]);

  // Watch for delete success
  useEffect(() => {
    if (deleteInitiated && !lectureDeleteLoading && !lectureDeleteError) {
      setIsDeleteModalOpen(false);
      setLectureToDelete(null);
      setDeleteInitiated(false);
      if (session) {
        dispatch(actGetLecturesBySessionId(session.id)); // Refresh list
        showSnackbar("تم حذف المحاضرة بنجاح", "success");
      }
    } else if (deleteInitiated && lectureDeleteError) {
      setDeleteInitiated(false);
      showSnackbar(lectureDeleteError, "error");
    }
  }, [lectureDeleteLoading, lectureDeleteError, deleteInitiated, dispatch, session, showSnackbar]);

  // Reset deleteInitiated when delete modal closes
  useEffect(() => {
    if (!isDeleteModalOpen) {
      setDeleteInitiated(false);
    }
  }, [isDeleteModalOpen]);

  if (!session || !course) return null;

  const handleOpenAddLecture = () => {
    setEditingLecture(null);
    setLectureTitle("");
    setLectureStartTime("");
    setLectureEndTime("");
    setLectureDate("");
    setIsLectureDialogOpen(true);
  };

  const handleOpenEditLecture = (lecture: any) => {
    // Handle both TLecture and LectureResponse
    const title = lecture.title || lecture.sessionName || "";
    const startTime = lecture.startTime || "";
    const endTime = lecture.endTime || "";
    const date = lecture.date || lecture.lectureDate || "";

    setEditingLecture(lecture as TLecture);
    setLectureTitle(title);
    setLectureStartTime(typeof startTime === "string" ? startTime : formatTime(startTime));
    setLectureEndTime(typeof endTime === "string" ? endTime : formatTime(endTime));
    setLectureDate(date);
    setIsLectureDialogOpen(true);
  };

  const handleSaveLecture = async () => {
    if (!lectureTitle.trim()) return;

    if (editingLecture && (editingLecture as any).id) {
      // Update existing lecture using the API
      const lectureId = (editingLecture as any).id;
      // For this example, let's assume classroomId and teacherId are from the session
      // In real code, you might want to get these from the session or a form
      const classroomId = 1; // Placeholder
      const teacherId = 1; // Placeholder

      dispatch(actUpdateLecture({
        id: lectureId,
        data: {
          lectureDate: lectureDate,
          startTime: parseTimeString(lectureStartTime),
          endTime: parseTimeString(lectureEndTime),
          classroomId: classroomId,
          teacherId: teacherId,
          sessionId: session.id
        }
      }));
    } else {
      // Add new lecture (not implemented yet, but keeping existing logic)
      let updatedLectures: TLecture[];
      const lectureData = {
        title: lectureTitle,
        startTime: lectureStartTime,
        endTime: lectureEndTime,
        date: lectureDate,
      };

      updatedLectures = [
        ...session.lectures,
        { id: Date.now(), ...lectureData },
      ];

      onUpdateSession({ ...session, lectures: updatedLectures });
      setIsLectureDialogOpen(false);
    }
  };

  const handleDeleteLecture = (lectureId: number) => {
    setLectureToDelete(lectureId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLecture = async () => {
    if (lectureToDelete) {
      setDeleteInitiated(true);
      dispatch(actDeleteLecture(lectureToDelete));
    }
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
            تفاصيل المحاضرة: {session.title}
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
          lectures={lectures}
          loading={lecturesLoading}
          error={lecturesError}
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
        isLoading={lectureUpdateLoading}
      />

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLectureToDelete(null);
        }}
        onConfirm={confirmDeleteLecture}
        title="حذف المحاضرة"
        description="هل أنت متأكد من رغبتك في حذف هذه المحاضرة"
        itemName={undefined}
        confirmButtonText="حذف المحاضرة"
        errorMessage={lectureDeleteError}
      />
    </Dialog>
  );
};

export default SessionDetailsModal;


