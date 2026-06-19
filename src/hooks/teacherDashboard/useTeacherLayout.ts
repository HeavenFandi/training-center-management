import { useState, useCallback } from "react";

export const useTeacherLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleOpenSidebar = useCallback(() => {
    setOpenSidebar(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setOpenSidebar(false);
  }, []);

  return {
    openSidebar,
    handleOpenSidebar,
    handleCloseSidebar,
  };
};

