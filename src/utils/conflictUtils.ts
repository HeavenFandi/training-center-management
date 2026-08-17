
import { LectureResponse } from '../api/trainingSessionApi';

export interface TimeObject {
  hour: number;
  minute: number;
  second?: number;
  nano?: number;
}

// Helper to convert time string "HH:mm" or "HH:mm:ss" or TimeObject to total minutes since midnight
export const timeToMinutes = (time: string | TimeObject): number => {
  if (!time) return 0;
  if (typeof time === 'string') {
    const parts = time.split(':').map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  }
  return (time.hour || 0) * 60 + (time.minute || 0);
};

// Check if two time intervals overlap
export const intervalsOverlap = (
  start1: string | TimeObject,
  end1: string | TimeObject,
  start2: string | TimeObject,
  end2: string | TimeObject
): boolean => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  
  return !(e1 <= s2 || e2 <= s1);
};

// Check for lecture conflicts in frontend
export const checkLectureConflict = (
  lectureId: number | null, // null for new lecture
  lectureDate: string,
  startTime: string | TimeObject,
  endTime: string | TimeObject,
  classroomId: number,
  allLectures: LectureResponse[]
): { hasConflict: boolean; conflictingLecture?: LectureResponse; message: string } => {
  const conflicting = allLectures.find(lecture => {
    // Skip the current lecture being edited
    if (lectureId && lecture.id === lectureId) return false;
    
    // Check same date and classroom
    if (lecture.lectureDate !== lectureDate) return false;
    if (lecture.classroomId !== classroomId) return false;
    
    // Check time overlap
    if (intervalsOverlap(startTime, endTime, lecture.startTime, lecture.endTime)) {
      return true;
    }
    return false;
  });

  if (conflicting) {
    return {
      hasConflict: true,
      conflictingLecture: conflicting,
      message: `تضارب في الموعد مع محاضرة: "${conflicting.sessionName}" في نفس القاعة والوقت.`
    };
  }

  return { hasConflict: false, message: 'لا توجد تعارضات' };
};
