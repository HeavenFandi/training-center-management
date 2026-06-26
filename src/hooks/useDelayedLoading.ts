import { useState, useEffect, useRef } from "react";

export function useDelayedLoading(
  isLoading: boolean | "idle" | "pending" | "succeeded" | "failed",
  delay: number = 500
): boolean {
  const [showLoading, setShowLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isLoadingState = typeof isLoading === "boolean" 
    ? isLoading 
    : isLoading === "pending";

  useEffect(() => {
    if (isLoadingState) {
      timerRef.current = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setShowLoading(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoadingState, delay]);

  return showLoading;
}
