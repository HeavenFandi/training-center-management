import React from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImageUploaderProps {
  courseImage: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const uploadBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "#7B90A24D",
  color: "white",
  borderRadius: "8px",
  p: 0.5,
  cursor: "pointer",
  mt: 0.1,
  height: 45,
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ courseImage, fileInputRef, onFileChange }) => {
  return (
    <>
      <Typography mt={1} mb={0.2} sx={{ fontSize: "0.85rem" }} fontWeight="bold" color="#555">
        الصورة
      </Typography>
      <Box
        sx={{ ...uploadBoxStyle }}
        gap={1}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUploadIcon sx={{ color: "#278AD5CC", fontSize: "1.1rem" }} />

        <Typography
          fontSize={{ xs: 12, sm: 14 }}
          sx={{ color: "#091c39", fontWeight: "bold" }}
        >
          {courseImage ? courseImage.name : "اضغط هنا لرفع الصورة"}
        </Typography>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onFileChange}
          accept="image/*"
        />
      </Box>
    </>
  );
};

export default React.memo(ImageUploader);


