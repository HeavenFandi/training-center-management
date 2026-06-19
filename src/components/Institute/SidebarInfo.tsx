import { Stack, Paper, Typography, Box, Avatar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ForumIcon from "@mui/icons-material/Forum";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationImage from "../../assets/vectors/location.png";
interface ContactLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
}

const ContactLink = ({ icon, label, value, href, color }: ContactLinkProps) => (
  <Box
    component="a"
    href={href}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      textDecoration: "none",
      color: "#475569",
      "&:hover": { color: "primary.main", transform: "translateX(-4px)" },
      transition: "0.2s",
    }}
  >
    <Avatar
      sx={{
        bgcolor: "white",
        color,
        width: 40,
        height: 40,
        border: "1px solid #E2E8F0",
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography
        variant="caption"
        sx={{ display: "block", color: "text.disabled", fontWeight: 700 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="800" sx={{ direction: "ltr" }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

interface InstituteInfo {
  location: string;
  workingHours: Array<{ days: string; time: string }>;
  contact: {
    phone: string;
    email: string;
  };
}

export const SidebarInfo = ({ info }: { info: InstituteInfo }) => (
  <Stack spacing={4}>
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "28px",
        bgcolor: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.5)",
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight="900"
        sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
          <LocationOnIcon sx={{ fontSize: 18 }} />
        </Avatar>
        الموقع والوصول
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: 150,
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={LocationImage}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", color: "#475569" }}
      >
        {info.location}
      </Typography>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "28px",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight="800"
        sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
      >
        <AccessTimeIcon color="primary" fontSize="small" /> ساعات العمل
      </Typography>
      <Stack spacing={1}>
        {info.workingHours.map((hour: { days: string; time: string }, i: number) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1.5,
              borderRadius: "12px",
              bgcolor: i % 2 === 0 ? "#F8FAFC" : "transparent",
            }}
          >
            <Typography variant="caption" fontWeight="700">
              {hour.days}
            </Typography>
            <Typography
              variant="caption"
              fontWeight="600"
              color="primary.main"
              sx={{ direction: "ltr" }}
            >
              {hour.time}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>

    <Box sx={{ px: 1 }}>
      <Typography
        variant="subtitle2"
        fontWeight="900"
        sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
      >
        <ForumIcon color="primary" fontSize="small" /> تواصل معنا
      </Typography>
      <Stack spacing={2}>
        <ContactLink
          icon={<PhoneIcon fontSize="small" />}
          label="رقم الهاتف"
          value={info.contact.phone}
          href={`tel:${info.contact.phone}`}
          color="#4caf50"
        />
        <ContactLink
          icon={<EmailIcon fontSize="small" />}
          label="البريد الإلكتروني"
          value={info.contact.email}
          href={`mailto:${info.contact.email}`}
          color="#1976d2"
        />
      </Stack>
    </Box>
  </Stack>
);


