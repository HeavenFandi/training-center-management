

export const styles = {
  heroWrapper: {
    py: { xs: 4, md: 10 },
    overflow: "hidden",
    mt: { xs: 0, md: 0 },
    background: "linear-gradient(135deg, rgba(240, 244, 248, 0.5) 0%, rgba(226, 234, 244, 0.5) 100%)",
  },
  imageContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mt: { xs: 8, md: 10 },
  },
  mainCircle: {
    position: "absolute",
    width: { xs: 200, md: 370 },
    height: { xs: 200, md: 370 },
    bgcolor: "#0a254d",
    borderRadius: "50%",
    zIndex: 0,
    top: { xs: "-10px", md: "-30px" },
  },
  dashedCircle: {
    position: "absolute",
    width: { xs: 210, md: 380 },
    height: { xs: 210, md: 380 },
    border: "2px dashed #1A73E8",
    borderRadius: "50%",
    zIndex: 0,
    animation: "spin 20s linear infinite",
    "@keyframes spin": {
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" },
    },
    top: { xs: "-20px", md: "-40px" },
  },
  heroImg: {
 
    maxWidth: { xs: 300, md: 500 },
    position: "relative",
    
    zIndex: 1,
    filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.2))",
  },
  glassCard: {
    position: "absolute",
    px: { xs: 1.5, md: 2.2 },
    py: { xs: 0.8, md: 1.2 },
    borderRadius: "14px",
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(255,255,255,0.35)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    zIndex: 2,
    whiteSpace: "nowrap",
    animation: "floating 4s ease-in-out infinite",
    "@keyframes floating": {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-10px)" },
    },
  },
  textStack: {
    textAlign: { xs: "center", md: "right" },
    alignItems: { xs: "center", md: "flex-end" },
  },
  title: {
    fontWeight: 900,
    color: "#051630",
    fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.2rem" },
    lineHeight: 1.2,
    fontFamily: "Tajawal",
  },
  subtitle: {
    color: "#5f6368",
    fontSize: { xs: "0.95rem", md: "1.1rem" },
    maxWidth: "500px",
    lineHeight: 1.8,
    fontFamily: "Tajawal",
  },
  primaryBtn: {
    borderRadius: "50px",
    px: { xs: 4, md: 4 },
    py: 1.5,
    bgcolor: "#1A73E8",
    fontWeight: "bold",
    fontFamily: "Tajawal",
  },
  secondaryBtn: {
    borderRadius: "50px",
    px: { xs: 4, md: 4 },
    py: 1.5,
    borderColor: "#051630",
    color: "#051630",
    fontWeight: "bold",
    fontFamily: "Tajawal",
    borderWidth: "2px",
    "&:hover": {
        borderWidth: "2px",
    }
  },
};
