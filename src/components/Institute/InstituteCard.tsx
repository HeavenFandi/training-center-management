import { Card, CardContent, Avatar, Box, Typography, IconButton } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import SecurityIcon from "@mui/icons-material/Security";
import CodeIcon from "@mui/icons-material/Code";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { TCourse } from "../../types/cardType";

const getIcon = (category: string) => {
  const iconStyle = { fontSize: 26 };
  if (category.includes("تصميم")) return <PaletteIcon sx={{ ...iconStyle, color: "#4caf50" }} />;
  if (category.includes("أمن")) return <SecurityIcon sx={{ ...iconStyle, color: "#f44336" }} />;
  return <CodeIcon sx={{ ...iconStyle, color: "#1976d2" }} />;
};

export const InstituteCard = ({ 
  course, 
  isExpanded, 
  onToggle 
}: { 
  course: TCourse; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => (
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
    <CardContent sx={{ p: "18px !important" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: isExpanded ? 2 : 0 }}>
        <Avatar sx={{ bgcolor: "rgba(25, 118, 210, 0.06)", width: 54, height: 54, borderRadius: "14px" }}>
          {getIcon(course.categoryName || course.category || "")}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="800">{course.title || course.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {course.description}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onToggle}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);
