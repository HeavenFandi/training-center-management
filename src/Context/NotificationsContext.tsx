import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: "success" | "error" | "warning";
  isRead: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "isRead">) => void;
  markAsRead: (id: number) => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "تم قبول طلبك",
      time: "PM 10:00   , 9/3/2026",
      type: "success",
      isRead: false,
    },
    {
      id: 2,
      message: "تم رفض طلبك",
      time: "PM 10:00   , 9/3/2026",
      type: "error",
      isRead: false,
    },
    {
      id: 3,
      message: "تم إلغاء الدورة لعدم اكتمال العدد",
      time: "PM 10:00   , 9/3/2026",
      type: "warning",
      isRead: false,
    },
  ]);

  const addNotification = (notif: Omit<Notification, "id" | "isRead">) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, markAsRead, unreadCount }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};


