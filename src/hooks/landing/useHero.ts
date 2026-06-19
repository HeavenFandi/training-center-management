import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
export const useHeroLogic = () => {
  const navigate = useNavigate();

  const handleBrowseTrainingSessions = useCallback(() => {
    navigate("/main/courses");
  }, [navigate]);

  const handleCreateAccount = useCallback(() => {
    navigate("/create-account");
  }, [navigate]);

  return {
    handleBrowseTrainingSessions,
    handleCreateAccount,
  };
};
