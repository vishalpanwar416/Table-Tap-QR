// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  subscribeToUserNotifications
} from '../api/notificationService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get current user from auth context

  // Fetch user notifications when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to new notifications
      const subscription = subscribeToUserNotifications(user.id, (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prevCount => prevCount + 1);
        
        // Show browser notification if supported
        showBrowserNotification(newNotification);
      });
      
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [user]);

  // Fetch user notifications from Supabase
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userNotifications = await getUserNotifications(user.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(notif => !notif.read).length);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      
      // Mark each unread notification as read
      await Promise.all(
        unreadNotifications.map(notification => 
          markNotificationAsRead(notification.id)
        )
      );
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Show browser notification if supported
  const showBrowserNotification = (notification) => {
    if (!("Notification" in window)) {
      return;
    }
    
    // Check if permission is granted
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/path/to/icon.png' // Add your app icon path
      });
    }
    // If permission is not denied, ask for it
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/path/to/icon.png' // Add your app icon path
          });
        }
      });
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};