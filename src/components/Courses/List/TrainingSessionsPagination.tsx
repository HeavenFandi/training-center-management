import React from "react";
import { Pagination, PaginationItem, Stack } from "@mui/material";

interface TrainingSessionsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (_: React.ChangeEvent<unknown>, value: number) => void;
}

function TrainingSessionsPagination({
  page,
  totalPages,
  onPageChange,
}: TrainingSessionsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Stack alignItems="center" sx={{ mt: 4, mb: 2 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        shape="rounded"
        dir="ltr"
        siblingCount={1}
        boundaryCount={1}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              fontFamily: "Tajawal",
              borderRadius: "10px",
              minWidth: "48px",
              height: "48px",
              border: "1px solid #0b2c5a",
              color: "#0b2c5a",
              fontWeight: 700,
              backgroundColor: "#fff",
              "&.Mui-selected": {
                backgroundColor: "#0b2c5a",
                color: "#fff",
                border: "1px solid #0b2c5a",
              },
              "&:hover": {
                backgroundColor: "#f5f7fa",
              },
            }}
          />
        )}
      />
    </Stack>
  );
}

export default TrainingSessionsPagination;


