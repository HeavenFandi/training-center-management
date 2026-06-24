import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface TableSkeletonProps {
  columnsCount: number;
  rowsCount?: number;
  showMobileView?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columnsCount,
  rowsCount = 5,
  showMobileView = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile && showMobileView) {
    return (
      <Box sx={{ p: 2 }}>
        {Array.from({ length: rowsCount }).map((_, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: "12px",
              p: 3,
              mb: 2,
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              border: "1px solid #eef2f6",
            }}
          >
            <Skeleton
              variant="text"
              width="60%"
              height={32}
              sx={{ mb: 2 }}
            />
            <Skeleton
              variant="text"
              width="40%"
              height={24}
              sx={{ mb: 1.5 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={24}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Skeleton
                variant="circular"
                width={36}
                height={36}
              />
              <Skeleton
                variant="circular"
                width={36}
                height={36}
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid #eef2f6",
        overflow: "hidden",
      }}
    >
      <Table sx={{ backgroundColor: "white" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#091c39" }}>
            {Array.from({ length: columnsCount }).map((_, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  borderBottom: "none",
                  py: 2,
                  fontSize: 15,
                }}
              >
                <Skeleton
                  variant="text"
                  width={80}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rowsCount }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                backgroundColor: rowIndex % 2 === 0 ? "#fafbfc" : "white",
              }}
            >
              {Array.from({ length: columnsCount }).map((_, colIndex) => (
                <TableCell
                  key={colIndex}
                  align="center"
                  sx={{
                    borderBottom: "1px solid #eef2f6",
                    py: 2,
                  }}
                >
                  <Skeleton
                    variant="text"
                    width={colIndex === 0 ? 40 : colIndex === columnsCount - 1 ? 120 : 100}
                    height={24}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
