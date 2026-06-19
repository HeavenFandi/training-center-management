import { Dialog, Box, Stack } from "@mui/material";
import { useState } from "react";
import AddSessionModal from "./AddSessionModal";
import EditCourseModal from "./EditCourseModel";
import SessionDetailsModal from "./SessionDetailsModal";
import RegisteredStudentsModal from "./RegisteredStudentsModal";
import CourseMainInfo from "./CourseDetailsComponents/CourseMainInfo";
import CourseDescriptionSection from "./CourseDetailsComponents/CourseDescriptionSection";
import CourseSessionsList from "./CourseDetailsComponents/CourseSessionsList";
import CourseActionButtons from "./CourseDetailsComponents/CourseActionButtons";
import { TCourse, TSession } from "../../../types/cardType";

type Props = {
  open: boolean;
  onClose: () => void;
  course: TCourse | null;
  onSave: (updated: TCourse) => void;
  onAddSession: (course: TCourse) => void;
};

const CourseDetailsModal = ({ open, onClose, course, onSave, onAddSession }: Props) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openStudentsModal, setOpenStudentsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TSession | null>(null);
  const [openSessionDetails, setOpenSessionDetails] = useState(false);

  if (!course) return null;

  const handleSessionClick = (session: TSession) => {
    setSelectedSession(session);
    setOpenSessionDetails(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
          borderRadius: "20px",
          width: "850px",
          height: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          width: "780px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "18px",
          overflow: "hidden",
          backgroundColor: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
          direction: "rtl",
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "right",
          }}
        >
          <Box>
            <CourseMainInfo course={course} />
            <CourseDescriptionSection course={course} />
            <CourseSessionsList sessions={course.sessions} onSessionClick={handleSessionClick} />
          </Box>

          <CourseActionButtons 
            onOpenStudents={() => setOpenStudentsModal(true)}
            onOpenAddSession={() => onAddSession(course)}
            onClose={onClose}
          />

          
          <SessionDetailsModal
            open={openSessionDetails}
            onClose={() => setOpenSessionDetails(false)}
            session={selectedSession}
            course={course}
            onUpdateSession={(updatedSession) => {
              const updatedSessions = course.sessions?.map(s => s.id === updatedSession.id ? updatedSession : s);
              onSave({ ...course, sessions: updatedSessions });
              setSelectedSession(updatedSession);
            }}
          />

          <EditCourseModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            course={course}
            onSave={(updated) => {
              onSave(updated);
              setOpenEditModal(false);
            }}
          />

          <RegisteredStudentsModal
            open={openStudentsModal}
            onClose={() => setOpenStudentsModal(false)}
            course={course}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default CourseDetailsModal;


