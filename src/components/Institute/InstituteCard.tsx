import { Card, CardContent, Avatar, Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PaletteIcon from "@mui/icons-material/Palette";
import SecurityIcon from "@mui/icons-material/Security";
import CodeIcon from "@mui/icons-material/Code";

const getIcon = (category: string) => {
  const iconStyle = { fontSize: 26 };
  if (category === "تصميم") return <PaletteIcon sx={{ ...iconStyle, color: "#4caf50" }} />;
  if (category === "أمن") return <SecurityIcon sx={{ ...iconStyle, color: "#f44336" }} />;
  return <CodeIcon sx={{ ...iconStyle, color: "#1976d2" }} />;
};

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
}

export const InstituteCard = ({ course }: { course: Course }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "primary.main",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        transform: "translateX(-8px)",
        boxShadow: "0px 10px 25px rgba(0,0,0,0.05)",
      },
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center", p: "18px !important", gap: 2.5 }}>
      <Avatar sx={{ bgcolor: "rgba(25, 118, 210, 0.06)", width: 54, height: 54, borderRadius: "14px" }}>
        {getIcon(course.category)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="800">{course.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {course.description}
        </Typography>
      </Box>
      <IconButton size="small" sx={{ color: "divider" }}>
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
    </CardContent>
  </Card>
);

