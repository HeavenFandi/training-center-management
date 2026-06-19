import React, { memo } from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
interface Tprops {
  icon: string;
  title: string;
  description: string;
}
const AdvantagesCard = memo(({ icon, title, description }: Tprops) => {
  return (
    <Card
      sx={{
        borderRadius: "24px",
        backgroundColor: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 15px 35px rgba(19, 62, 101, 0.08)",
        height: "100%",
        width: "400px",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.65)",
          transform: "translateY(-10px)",
          boxShadow: "0 25px 50px rgba(19, 62, 101, 0.15)",
        }
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
            direction: "ltr",
          }}
        >
          <img src={icon} alt="" style={{ width: "45px", height: "45px" }} />
        </Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#001a41", mb: 1, textAlign: "right" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#777", textAlign: "right", fontSize: "0.95rem" }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
});

export default AdvantagesCard;


