import React, { useRef } from "react";
import { Box, Avatar, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface TeacherImageUploadProps {
  image: string | undefined;
  onImageChange: (imageUrl: string) => void;
}

const TeacherImageUpload: React.FC<TeacherImageUploadProps> = ({
  image,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Avatar
        src={image}
        sx={{
          width: 110,
          height: 110,
          boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
          border: "4px solid #fff",
        }}
      />
      <IconButton
        onClick={() => fileInputRef.current?.click()}
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          bgcolor: "#133E65",
          color: "white",
          "&:hover": { bgcolor: "#0d2b4a" },
          width: 32,
          height: 32,
        }}>
        <CloudUploadIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default TeacherImageUpload;


