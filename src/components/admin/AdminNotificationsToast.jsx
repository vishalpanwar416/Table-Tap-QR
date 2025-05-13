import React from 'react';
import { useAdminNotifications } from '../../context/AdminNotificationContext';
import { Check, X, Info } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const AdminNotificationsToast = () => {
  const { notifications, markAsRead } = useAdminNotifications();
  const { updateOrderStatus } = useOrders();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications
        .filter(n => !n.read && n.is_admin_notification)
        .map(notification => (
          <div key={notification.id} 
            className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-orange-500 w-80 animate-fade-in-up">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-bold">{notification.title}</h3>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              </div>
              <button 
                onClick={() => markAsRead(notification.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {notification.metadata && (
              <div className="mb-3 text-sm">
                <p className="font-medium">Order Details:</p>
                <p>Table {notification.metadata.table_number}</p>
                <p>Total: ₹{notification.metadata.total_amount}</p>
                <p>{notification.metadata.items?.length} items</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateOrderStatus(notification.order_id, 'preparing');
                  markAsRead(notification.id);
                }}
                className="flex-1 bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  updateOrderStatus(notification.order_id, 'rejected');
                  markAsRead(notification.id);
                }}
                className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminNotificationsToast;