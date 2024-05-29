// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context for managing notifications
const ChatNotificationContext = createContext();

export const ChatNotificationProvider = ({ children }) => {
  const [chatNotificationCount, setChatNotificationCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Function to increment notification count
  const incrementChatNotificationCount = () => {
    setChatNotificationCount((prevCount) => prevCount + 1);
  };
  const toggleShowNotification = () => {
    setShowNotification((prevValue) => !prevValue);
  };

  return (
    <ChatNotificationContext.Provider
      value={{ chatNotificationCount, incrementChatNotificationCount,  showNotification,
        toggleShowNotification,  }}
    >
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotification = () => useContext(ChatNotificationContext);
