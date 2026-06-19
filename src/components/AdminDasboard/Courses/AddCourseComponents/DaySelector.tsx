import React from "react";
import { Grid, Typography, Button } from "@mui/material";

interface DaySelectorProps {
  dayss: string[];
  selectedDays: string[];
  onToggleDay: (day: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  dayss,
  selectedDays,
  onToggleDay,
}) => {
  return (
    <>
      <Typography
        mt={1}
        mb={0.2}
        sx={{ fontSize: "0.85rem" }}
        fontWeight="bold"
        color="#555"
      >
        أيام الأسبوع
      </Typography>

      <Grid container spacing={0.5} direction="row" fontFamily={"Tajawal"}>
        {dayss.map((day) => (
          <Grid size={{ xs: 4, sm: "auto" }} key={day} sx={{ flex: { sm: 1 } }}>
            <Button
              fullWidth
              onClick={() => onToggleDay(day)}
              variant={selectedDays.includes(day) ? "contained" : "outlined"}
              sx={{
                borderRadius: "8px",
                bgcolor: selectedDays.includes(day)
                  ? "#278AD5CC"
                  : "transparent",
                borderColor: "#D1D5DB",
                color: selectedDays.includes(day) ? "white" : "#278AD5CC",
                minWidth: { xs: "auto", sm: "60px" },
                height: "36px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: selectedDays.includes(day) ? "#278AD5CC" : "#f0f0f0",
                },
              }}
            >
              {day}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default React.memo(DaySelector);


