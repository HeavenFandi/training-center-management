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
import {
  actGetLecturesBySessionId,
  actUpdateLecture,
  actDeleteLecture,
  actCreateLecture,
  clearDeleteLectureState,
} from "../../../store/Courses/trainingSessionsSlice";
import DeleteModal from "../../Modal/DeleteModal";
import { useSnackbar } from "../../../Context/SnackbarContext";
import { checkLectureConflict } from "../../../utils/conflictUtils";
import { LectureResponse, convertTimeStringToTimeObject } from "../../../api/trainingSessionApi";

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
  onDeleteSuccess?: () => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  open,
  onClose,
  session,
  course,
  onUpdateSession,
  onDeleteSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  const lectures = useAppSelector((state) =>
    session?.id ? (state.trainingSessions.sessionLectures[session.id] || []) : []
  );
  
  const lecturesLoading = useAppSelector((state) =>
    session?.id ? (state.trainingSessions.sessionLecturesLoading[session.id] || false) : false
  );
  const lecturesError = useAppSelector((state) =>
    session?.id ? (state.trainingSessions.sessionLecturesError[session.id] || null) : null
  );
  const lectureUpdateLoading = useAppSelector((state) => state.trainingSessions.lectureUpdateLoading);
  const lectureUpdateError = useAppSelector((state) => state.trainingSessions.lectureUpdateError);
  const deletingLectureId = useAppSelector((state) => state.trainingSessions.deletingLectureId);
  const lectureDeleteError = useAppSelector((state) => state.trainingSessions.lectureDeleteError);
  const lectureCreateLoading = useAppSelector((state) => state.trainingSessions.lectureCreateLoading);
  const lectureCreateError = useAppSelector((state) => state.trainingSessions.lectureCreateError);
  const trainingSessions = useAppSelector((state) => state.trainingSessions.trainingSessions);
  const sessionLectures = useAppSelector((state) => state.trainingSessions.sessionLectures);
  



  
  const [isLectureDialogOpen, setIsLectureDialogOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<TLecture | null>(null);
  const [lectureStartTime, setLectureStartTime] = useState("");
  const [lectureEndTime, setLectureEndTime] = useState("");
  const [lectureDate, setLectureDate] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<number | null>(null);
  const [originalLectureValues, setOriginalLectureValues] = useState<any>(null);
  const [localConflictError, setLocalConflictError] = useState<string | null>(null);

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
      // Always refresh lectures when modal opens to get latest state
      dispatch(actGetLecturesBySessionId(session.id));
    }
  }, [open, session?.id, dispatch]);

  // Clear local conflict when dialog closes
  useEffect(() => {
    if (!isLectureDialogOpen) {
      setLocalConflictError(null);
    }
  }, [isLectureDialogOpen]);

  if (!session || !course) return null;

  // Check trainingSessions array to see if we have the session there with classroomId
  const matchingSessionInTrainingSessions = trainingSessions.find(ts => ts.id === session.id);

  // Each training session has exactly one teacher and classroom
  // First try session's own fields, then fall back to trainingSessions array
  const sessionTeacherId = session.teacherId ?? matchingSessionInTrainingSessions?.teacherId;
  const sessionClassroomId = session.classroomId ?? matchingSessionInTrainingSessions?.classroomId;

  const handleOpenAddLecture = () => {
    setEditingLecture(null);
    setLectureStartTime("");
    setLectureEndTime("");
    setLectureDate("");
    setLocalConflictError(null);
    setOriginalLectureValues(null);

    setIsLectureDialogOpen(true);
  };

  const handleOpenEditLecture = (lecture: any) => {
    // Handle both TLecture and LectureResponse
    const startTime = lecture.startTime || "";
    const endTime = lecture.endTime || "";
    const date = lecture.date || lecture.lectureDate || "";

    setEditingLecture(lecture);
    setLectureStartTime(typeof startTime === "string" ? startTime : formatTime(startTime));
    setLectureEndTime(typeof endTime === "string" ? endTime : formatTime(endTime));
    setLectureDate(date);
    setLocalConflictError(null);
    
    // Store original values for dirty checking
    setOriginalLectureValues({
      id: lecture.id,
      lectureDate: date,
      startTime: typeof startTime === "string" ? startTime : formatTime(startTime),
      endTime: typeof endTime === "string" ? endTime : formatTime(endTime),
      classroomId: sessionClassroomId,
      teacherId: sessionTeacherId,
      sessionId: lecture.sessionId
    });
    
    setIsLectureDialogOpen(true);
  };

  const handleSaveLecture = async () => {

    if (editingLecture && (editingLecture as any).id) {
      // Update existing lecture
      const lectureId = (editingLecture as any).id;

      // Check if scheduling fields changed
      const schedulingFieldsChanged = 
        lectureDate !== originalLectureValues.lectureDate ||
        lectureStartTime !== originalLectureValues.startTime ||
        lectureEndTime !== originalLectureValues.endTime;

      // Frontend conflict validation if scheduling fields changed
      if (schedulingFieldsChanged) {
        const allLectures = Object.values(sessionLectures).flat() as LectureResponse[];
        
        const conflict = checkLectureConflict(
          lectureId,
          lectureDate,
          lectureStartTime,
          lectureEndTime,
          sessionClassroomId,
          allLectures
        );
        
        if (conflict.hasConflict) {
          setLocalConflictError(conflict.message);
          showSnackbar(conflict.message, "error");
          return;
        }
      }

      // Build FULL payload with ALL required fields (excluding sessionName for updates)
      const payloadData: any = {
        sessionId: originalLectureValues.sessionId ?? session.id,
        lectureDate: lectureDate,
        startTime: lectureStartTime + ":00", // Add seconds to make HH:mm:ss
        endTime: lectureEndTime + ":00",
        classroomId: sessionClassroomId,
        teacherId: sessionTeacherId
      };

      setLocalConflictError(null);
      const result = await dispatch(actUpdateLecture({
        id: lectureId,
        data: payloadData
      }));

      if (actUpdateLecture.fulfilled.match(result)) {
        setIsLectureDialogOpen(false);
        showSnackbar("تم تحديث المحاضرة بنجاح", "success");
      } else if (actUpdateLecture.rejected.match(result)) {
        const errorMessage = result.payload as string;
        const isConflict = 
          errorMessage.toLowerCase().includes("conflict") || 
          errorMessage.toLowerCase().includes("تضارب") ||
          errorMessage.toLowerCase().includes("409") ||
          errorMessage.toLowerCase().includes("400");
        
        if (isConflict) {
          if (session?.id) {
            dispatch(actGetLecturesBySessionId(session.id));
          }
        }
        showSnackbar(errorMessage, "error");
      }
    } else {
      // Add new lecture
      
      // Validate required fields
      if (lectureDate.trim() && lectureStartTime.trim() && lectureEndTime.trim()) {
        // Frontend conflict validation for new lecture
        const allLectures = Object.values(sessionLectures).flat() as LectureResponse[];
        const conflict = checkLectureConflict(
          null,
          lectureDate,
          lectureStartTime,
          lectureEndTime,
          sessionClassroomId,
          allLectures
        );
        
        if (conflict.hasConflict) {
          setLocalConflictError(conflict.message);
          showSnackbar(conflict.message, "error");
          return;
        }

        const payloadData = {
          lectureDate: lectureDate,
          startTime: lectureStartTime + ":00", // Add seconds to make HH:mm:ss
          endTime: lectureEndTime + ":00",
          classroomId: sessionClassroomId,
          teacherId: sessionTeacherId,
          sessionId: session!.id,
        };
        
        setLocalConflictError(null);
        const result = await dispatch(actCreateLecture({ sessionId: session.id, data: payloadData }));

        if (actCreateLecture.fulfilled.match(result)) {
          setIsLectureDialogOpen(false);
          showSnackbar("تم إضافة المحاضرة بنجاح", "success");
        } else if (actCreateLecture.rejected.match(result)) {
          const errorMessage = result.payload as string;
          showSnackbar(errorMessage, "error");
        }
      }
    }
  };

  const handleDeleteLecture = (lectureId: number) => {
    setLectureToDelete(lectureId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteLecture = () => {
    setIsDeleteModalOpen(false);
    setLectureToDelete(null);
    dispatch(clearDeleteLectureState());
  };

  const confirmDeleteLecture = async () => {
    if (lectureToDelete) {
      const result = await dispatch(actDeleteLecture(lectureToDelete));

      if (actDeleteLecture.fulfilled.match(result)) {
        setIsDeleteModalOpen(false);
        setLectureToDelete(null);
        if (session) {
          showSnackbar("تم حذف المحاضرة بنجاح", "success");
        }
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else if (actDeleteLecture.rejected.match(result)) {
        const errorMessage = result.payload as string;
        showSnackbar(errorMessage, "error");
      }
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
        <SessionBasicInfo session={session} course={course} lecturesCount={lectures.length} />
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
        lectureDate={lectureDate}
        setLectureDate={setLectureDate}
        lectureStartTime={lectureStartTime}
        setLectureStartTime={setLectureStartTime}
        lectureEndTime={lectureEndTime}
        setLectureEndTime={setLectureEndTime}
        isLoading={lectureUpdateLoading || lectureCreateLoading}
        errorMessage={localConflictError}
      />

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteLecture}
        onConfirm={confirmDeleteLecture}
        title="حذف المحاضرة"
        description="هل أنت متأكد من رغبتك في حذف هذه المحاضرة"
        itemName={undefined}
        confirmButtonText="حذف المحاضرة"
        errorMessage={lectureDeleteError}
        isLoading={deletingLectureId !== null}
      />
    </Dialog>
  );
};

export default SessionDetailsModal;
