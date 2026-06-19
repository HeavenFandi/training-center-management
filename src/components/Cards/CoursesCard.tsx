import React, { memo } from "react";
import { Typography, Grid, Card, CardMedia, CardContent, Divider, Box } from "@mui/material";
import { TCourseData } from "../../types/cardType";

interface TCourse {
  course: TCourseData;
}

const CoursesCard = memo(({ course }: TCourse) => {
  return (
    <Card 
      sx={{
        display: 'flex', 
        flexDirection: 'column',
        direction: "rtl",
        borderRadius: "24px", 
        backgroundColor: "rgba(255, 255, 255, 0.45)", 
        backdropFilter: "blur(25px)", 
        WebkitBackdropFilter: "blur(25px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 15px 45px rgba(19, 62, 101, 0.1)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", 
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-15px)",
          boxShadow: "0 25px 60px rgba(19, 62, 101, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.65)",
        }
      }}
    >
      <CardMedia 
        sx={{ height: 200 }} 
        image={course.img} 
        title={course.name} 
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="div" 
          fontWeight="bold"
          color="text.primary"
        >
          {course.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}
        >
          {course.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 2 }} />
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 'bold' }}>
              👤 {course.Statistics.students}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              📚 {course.Statistics.lessons}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              🕒 {course.Statistics.hours}
            </Typography>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
});

export default CoursesCard;

