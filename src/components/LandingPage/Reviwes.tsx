import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Stack,
  Container,
} from "@mui/material";
import { reviewsData, Review } from "../../data/reviewData";

const Reviews: React.FC = () => {
  return (
    <Box component="section" sx={{ width: "100%", py: 8, direction: "rtl" }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight="bold" 
          mb={6}
          sx={{ fontSize: { xs: "1.8rem", md: "2.125rem" } }}
        >
          ماذا يقول متدربونا
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: "24px",
            width: "100%",
          }}
        >
          {reviewsData.map((item: Review) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                backdropFilter: "blur(25px)",
                WebkitBackdropFilter: "blur(25px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 15px 35px rgba(19, 62, 101, 0.08)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "&:hover": { 
                  transform: "translateY(-12px)",
                  boxShadow: "0 25px 50px rgba(19, 62, 101, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                }
              }}
            >
              <CardContent
                sx={{ 
                  flexGrow: 1, 
                  display: "flex", 
                  flexDirection: "column",
                  p: 3 
                }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Rating value={item.rating} readOnly size="small" />
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: "text.secondary", 
                      lineHeight: 1.8,
                      fontSize: "0.95rem" 
                    }}
                  >
                    "{item.text}"
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: "1px solid",
                    borderColor: "divider" 
                  }}
                >
                  <Avatar 
                    src={item.avatar} 
                    alt={item.name} 
                    sx={{ width: 45, height: 45 }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.role}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Reviews;

