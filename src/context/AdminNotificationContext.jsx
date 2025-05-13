// src/contexts/AdminNotificationContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../config/AuthContext'; // Assuming you have an AuthContext
import { 
  getAdminNotifications, 
  markNotificationAsRead, 
  subscribeToAdminNotifications
} from '../api/notificationService';
import { subscribeToNewOrders } from '../api/orderService';

const AdminNotificationContext = createContext();

export const AdminNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuth(); // Get current user and admin status

  // Fetch admin notifications when component mounts
  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminNotifications();
      
      // Subscribe to new admin notifications
      const notificationSubscription = subscribeToAdminNotifications((newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prevCount => prevCount + 1);
        
        // Show browser notification if supported
        showBrowserNotification(newNotification);
      });
      
      // Subscribe to new orders
      const orderSubscription = subscribeToNewOrders((newOrder) => {
        if (newOrder.status === 'pending') {
          setNewOrdersCount(prev => prev + 1);
          
          showBrowserNotification({
            title: 'New Order Received',
            message: `Table ${newOrder.table_number} - ₹${newOrder.total}`,
            order: newOrder // Pass full order object
          });
          
          // Add to notifications list
          setNotifications(prev => [{
            id: newOrder.id,
            title: 'New Order',
            message: `Order #${newOrder.id.slice(0, 8)}`,
            order: newOrder,
            isOrderNotification: true,
            read: false,
            created_at: new Date().toISOString()
          }, ...prev]);
        }
      });


      return () => {
        if (notificationSubscription) {
          notificationSubscription.unsubscribe();
        }
        if (orderSubscription) {
          orderSubscription.unsubscribe();
        }
      };
    }
  }, [user, isAdmin]);

  // Fetch admin notifications from Supabase
  const fetchAdminNotifications = async () => {
    if (!user || !isAdmin) return;
    
    try {
      setLoading(true);
      const adminNotifications = await getAdminNotifications();
      setNotifications(adminNotifications);
      setUnreadCount(adminNotifications.filter(notif => !notif.read).length);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin notifications:', err);
      setError('Failed to load admin notifications');
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

  // Reset new orders count
  const resetNewOrdersCount = () => {
    setNewOrdersCount(0);
  };

  // Show browser notification if supported
 const showBrowserNotification = (notification) => {
  if (!("Notification" in window)) return;

  const showNotification = () => {
    const notif = new Notification(notification.title, {
      body: `Table ${notification.order.table_number} - ₹${notification.order.total}`,
      icon: '/logo.png',
      data: { orderId: notification.order.id }
    });

    notif.onclick = () => {
      window.focus();
      navigate(`/orders/${notification.order.id}`);
    };
  };

  if (Notification.permission === "granted") {
    showNotification();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") showNotification();
    });
  }
};
  const value = {
    notifications,
    unreadCount,
    newOrdersCount,
    loading,
    error,
    fetchAdminNotifications,
    markAsRead,
    markAllAsRead,
    resetNewOrdersCount
  };

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationProvider');
  }
  return context;
};