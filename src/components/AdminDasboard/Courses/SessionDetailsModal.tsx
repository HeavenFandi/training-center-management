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
import { LectureResponse } from "../../../api/trainingSessionApi";

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
   const deletingLectureId = useAppSelector((state) => state.trainingSessions.deletingLectureId);
  const lectureDeleteError = useAppSelector((state) => state.trainingSessions.lectureDeleteError);
  const lectureCreateLoading = useAppSelector((state) => state.trainingSessions.lectureCreateLoading);
  const lectureCreateError = useAppSelector((state) => state.trainingSessions.lectureCreateError);
  
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
  const [updateInitiated, setUpdateInitiated] = useState(false);
  const [createInitiated, setCreateInitiated] = useState(false);
  const [originalLectureValues, setOriginalLectureValues] = useState<any>(null);
  const [localConflictError, setLocalConflictError] = useState<string | null>(null);
  const [classroomId, setClassroomId] = useState<number>(1); // Temporary default
  const [teacherId, setTeacherId] = useState<number>(1); // Temporary default

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

  // Watch for update success/error
  useEffect(() => {
    if (updateInitiated && !lectureUpdateLoading) {
      if (!lectureUpdateError) {
        setIsLectureDialogOpen(false);
        showSnackbar("تم تحديث المحاضرة بنجاح", "success");
      } else {
        // If error, check if it's a conflict
        const isConflict = 
          lectureUpdateError.toLowerCase().includes("conflict") || 
          lectureUpdateError.toLowerCase().includes("تضارب") ||
          lectureUpdateError.toLowerCase().includes("409") ||
          lectureUpdateError.toLowerCase().includes("400");
        
        if (isConflict) {
          // Auto-refresh lectures
          if (session?.id) {
            dispatch(actGetLecturesBySessionId(session.id));
          }
          showSnackbar(lectureUpdateError, "error");
          // Keep modal open for user to adjust
        } else {
          showSnackbar(lectureUpdateError, "error");
        }
      }
      setUpdateInitiated(false);
    }
  }, [lectureUpdateLoading, lectureUpdateError, updateInitiated, showSnackbar, dispatch, session?.id]);

  // Watch for create success/error
  useEffect(() => {
    if (createInitiated && !lectureCreateLoading) {
      if (!lectureCreateError) {
        setIsLectureDialogOpen(false);
        showSnackbar("تم إضافة المحاضرة بنجاح", "success");
      } else {
        showSnackbar(lectureCreateError, "error");
      }
      setCreateInitiated(false);
    }
  }, [lectureCreateLoading, lectureCreateError, createInitiated, showSnackbar]);

  // Watch for delete success
  useEffect(() => {
     if (deleteInitiated && !deletingLectureId && !lectureDeleteError) {
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
  }, [deletingLectureId, lectureDeleteError, deleteInitiated, dispatch, session, showSnackbar]);

  // Reset deleteInitiated when delete modal closes
  useEffect(() => {
    if (!isDeleteModalOpen) {
      setDeleteInitiated(false);
    }
  }, [isDeleteModalOpen]);

  // Clear local conflict when dialog closes
  useEffect(() => {
    if (!isLectureDialogOpen) {
      setLocalConflictError(null);
    }
  }, [isLectureDialogOpen]);

  if (!session || !course) return null;

  const handleOpenAddLecture = () => {
    setEditingLecture(null);
    setLectureTitle("");
    setLectureStartTime("");
    setLectureEndTime("");
    setLectureDate("");
    setLocalConflictError(null);
    setOriginalLectureValues(null);

    // Set default classroomId and teacherId from existing lectures if available
    if (session?.id && sessionLectures[session.id] && sessionLectures[session.id].length > 0) {
      const firstLecture = sessionLectures[session.id][0];
      if (firstLecture.classroomId) {
        setClassroomId(firstLecture.classroomId);
      }
      if (firstLecture.teacherId) {
        setTeacherId(firstLecture.teacherId);
      }
    }

    setIsLectureDialogOpen(true);
  };

  const handleOpenEditLecture = (lecture: any) => {
    // First refresh to get latest state
    if (session?.id) {
      dispatch(actGetLecturesBySessionId(session.id));
    }

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
    setLocalConflictError(null);
    
    // Store original values for dirty checking
    setOriginalLectureValues({
      sessionName: title,
      lectureDate: date,
      startTime: typeof startTime === "string" ? startTime : formatTime(startTime),
      endTime: typeof endTime === "string" ? endTime : formatTime(endTime),
      classroomId: lecture.classroomId,
      teacherId: lecture.teacherId
    });
    
    setIsLectureDialogOpen(true);
  };

  const handleSaveLecture = async () => {
    console.log("=== [handleSaveLecture] Starting ===");
    console.log("[handleSaveLecture] editingLecture:", editingLecture);
    console.log("[handleSaveLecture] lectureTitle:", lectureTitle);
    console.log("[handleSaveLecture] lectureDate:", lectureDate);
    console.log("[handleSaveLecture] lectureStartTime:", lectureStartTime);
    console.log("[handleSaveLecture] lectureEndTime:", lectureEndTime);
    console.log("[handleSaveLecture] Original Values:", originalLectureValues);
    
    if (!lectureTitle.trim()) return;

    if (editingLecture && (editingLecture as any).id) {
      // Update existing lecture
      const lectureId = (editingLecture as any).id;
      const currentClassroomId = (editingLecture as any).classroomId;
      
      // Function to format time as "HH:mm:ss"
      const formatTimeForApi = (timeStr: string) => {
        if (!timeStr) return "00:00:00";
        const [hour, minute] = timeStr.split(":");
        return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`;
      };
      
      // Check if scheduling fields changed
      const schedulingFieldsChanged = 
        lectureDate !== originalLectureValues.lectureDate ||
        lectureStartTime !== originalLectureValues.startTime ||
        lectureEndTime !== originalLectureValues.endTime ||
        currentClassroomId !== originalLectureValues.classroomId;

      // Frontend conflict validation if scheduling fields changed
      if (schedulingFieldsChanged) {
        const allLectures = Object.values(sessionLectures).flat() as LectureResponse[];
        
        const conflict = checkLectureConflict(
          lectureId,
          lectureDate,
          lectureStartTime,
          lectureEndTime,
          currentClassroomId,
          allLectures
        );
        
        if (conflict.hasConflict) {
          console.error("=== [handleSaveLecture] Local conflict detected ===", conflict);
          setLocalConflictError(conflict.message);
          showSnackbar(conflict.message, "error");
          return;
        }
      }

      // Build payload with only dirty fields
      const payloadData: any = {
        sessionId: session.id
      };
      
      // Check each field individually
      if (lectureTitle !== originalLectureValues.sessionName) {
        payloadData.sessionName = lectureTitle;
      }
      
      if (lectureDate !== originalLectureValues.lectureDate) {
        payloadData.lectureDate = lectureDate;
      }
      
      const newStartTimeFormatted = formatTimeForApi(lectureStartTime);
      const originalStartTimeFormatted = formatTimeForApi(originalLectureValues.startTime);
      if (newStartTimeFormatted !== originalStartTimeFormatted) {
        payloadData.startTime = newStartTimeFormatted;
      }
      
      const newEndTimeFormatted = formatTimeForApi(lectureEndTime);
      const originalEndTimeFormatted = formatTimeForApi(originalLectureValues.endTime);
      if (newEndTimeFormatted !== originalEndTimeFormatted) {
        payloadData.endTime = newEndTimeFormatted;
      }
      
      if (currentClassroomId !== originalLectureValues.classroomId) {
        payloadData.classroomId = currentClassroomId;
      }
      
      const currentTeacherId = (editingLecture as any).teacherId;
      if (currentTeacherId !== originalLectureValues.teacherId) {
        payloadData.teacherId = currentTeacherId;
      }
      
      console.log("=== [handleSaveLecture] Sending Payload ===", payloadData);

      setUpdateInitiated(true);
      setLocalConflictError(null);
      dispatch(actUpdateLecture({
        id: lectureId,
        data: payloadData
      }));
    } else {
      // Add new lecture
      
      // Validate required fields
      if (lectureDate.trim() && lectureStartTime.trim() && lectureEndTime.trim()) {
        // Function to format time as "HH:mm:ss"
        const formatTimeForApi = (timeStr: string) => {
          if (!timeStr) return "00:00:00";
          const [hour, minute] = timeStr.split(":");
          return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`;
        };
        
        // Frontend conflict validation for new lecture
        const allLectures = Object.values(sessionLectures).flat() as LectureResponse[];
        const conflict = checkLectureConflict(
          null,
          lectureDate,
          lectureStartTime,
          lectureEndTime,
          classroomId,
          allLectures
        );
        
        if (conflict.hasConflict) {
          console.error("=== [handleSaveLecture] Local conflict detected for new lecture ===", conflict);
          setLocalConflictError(conflict.message);
          showSnackbar(conflict.message, "error");
          return;
        }

        const payloadData = {
          sessionName: lectureTitle,
          lectureDate: lectureDate,
          startTime: formatTimeForApi(lectureStartTime),
          endTime: formatTimeForApi(lectureEndTime),
          classroomId: classroomId,
          teacherId: teacherId,
        };
        
        console.log("=== [handleSaveLecture] Sending create payload ===", payloadData);
        
        setCreateInitiated(true);
        setLocalConflictError(null);
        dispatch(actCreateLecture({ sessionId: session.id, data: payloadData }));
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
        lectureTitle={lectureTitle}
        setLectureTitle={setLectureTitle}
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


