import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TCourse } from "../../../../types/cardType";

interface CourseManagementTableProps {
  courses: TCourse[];
  onView: (course: TCourse) => void;
  onEdit: (course: TCourse) => void;
  onDelete: (course: TCourse) => void;
}

const CourseManagementTable: React.FC<CourseManagementTableProps> = ({
  courses,
  onView,
  onEdit,
  onDelete,
}) => {
  const tableHeader = useMemo(
    () => (
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "rgba(179, 207, 229, 1)",
            border: "2px solid #091c39",
          }}>
          {[
            "الكورس",
            "التصنيف",
            "المتطلبات",
            "عدد الساعات",
            "الوصف",
            "الإجراءات",
          ].map((head) => (
            <TableCell
              key={head}
              align="center"
              sx={{
                fontWeight: "bold",
                fontSize: 18,
                borderLeft: "2px solid #091c39",
                borderRight: "2px solid #091c39",
                color: "#1b2b4b",
                fontFamily: "Tajawal",
              }}>
              {head}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    ),
    [],
  );

  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table>
        {tableHeader}
        <TableBody>
          {courses.map((course) => (
            <TableRow
              key={course.id}
              sx={{
                "&:hover": {
                  backgroundColor: "#f9fcff",
                },
              }}>
              <TableCell
                align="center"
                sx={{
                  fontSize: 16,
                  borderLeft: "2px solid #091c39",
                  borderRight: "2px solid #091c39",
                  borderBottom: "2px solid #091c39",
                  fontFamily: "Tajawal",
                }}>
                {course.title}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  borderLeft: "2px solid #091c39",
                  fontSize: 16,
                  borderBottom: "2px solid #091c39",
                  fontFamily: "Tajawal",
                }}>
                {course.category}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: 16,
                  borderLeft: "2px solid #091c39",
                  borderBottom: "2px solid #091c39",
                  fontFamily: "Tajawal",
                }}>
                {course.requirements}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: 16,
                  borderLeft: "2px solid #091c39",
                  borderBottom: "2px solid #091c39",
                  fontWeight: 700,
                  fontFamily: "Tajawal",
                }}>
                {course.hours}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: 16,
                  borderLeft: "2px solid #091c39",
                  borderBottom: "2px solid #091c39",
                  fontFamily: "Tajawal",
                }}>
                {course.description}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: 16,
                  borderLeft: "2px solid #091c39",
                  borderBottom: "2px solid #091c39",
                }}>
                <Stack direction="row" justifyContent="center" gap={2}>
                  <IconButton
                    onClick={() => onView(course)}
                    sx={{ background: "#e8f5ff" }}>
                    <VisibilityIcon sx={{ color: "#2196f3" }} />
                  </IconButton>
                  <IconButton
                    sx={{ background: "#fdecea" }}
                    onClick={() => onDelete(course)}>
                    <DeleteIcon sx={{ color: "#e74c3c" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => onEdit(course)}
                    sx={{ background: "#e9f7ef" }}>
                    <EditIcon sx={{ color: "#2ecc71" }} />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(CourseManagementTable);


