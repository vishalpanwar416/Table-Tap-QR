import React from 'react';
import { Clock, CheckCircle, XCircle, ChefHat, Calendar, ArrowRight } from 'lucide-react';

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  rejected: <XCircle className="w-5 h-5 text-red-500" />,
  accepted: <ChefHat className="w-5 h-5 text-blue-500" />,
  preparing: <ChefHat className="w-5 h-5 text-purple-500" />,
  ready: <CheckCircle className="w-5 h-5 text-green-500" />
};

const statusLabels = {
  pending: 'Pending Acceptance',
  completed: 'Completed',
  rejected: 'Rejected',
  accepted: 'Accepted',
  preparing: 'In Preparation',
  ready: 'Ready for Pickup'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800'
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

// Placeholder images for menu items
const itemPlaceholderImages = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
  pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
  pasta: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=200&fit=crop',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'
};

// Helper to get image based on item name
const getItemImage = (item) => {
  if (!item || !item.name) return itemPlaceholderImages.default;
  
  const name = item.name.toLowerCase();
  if (name.includes('burger')) return itemPlaceholderImages.burger;
  if (name.includes('pizza')) return itemPlaceholderImages.pizza;
  if (name.includes('pasta')) return itemPlaceholderImages.pasta;
  if (name.includes('salad')) return itemPlaceholderImages.salad;
  
  return itemPlaceholderImages.default;
};

const OrderCard = ({ order, onClick }) => {
  if (!order) return null;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100"
    >
      <div className="p-4">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Order #{order.id && order.id.slice(0, 8)}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(order.created_at || new Date())}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
            {statusIcons[order.status]}
          </div>
        </div>
        
        {/* Item Images */}
        <div className="mb-4">
          <div className="flex mb-3 space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {(order.items || []).slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                <img 
                  src={getItemImage(item)} 
                  alt={item.name || `Item ${idx+1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {(order.items || []).length > 4 && (
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
                +{(order.items || []).length - 4}
              </div>
            )}
          </div>
        </div>
        
        {/* Order Items */}
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Items:</h4>
          <div className="flex flex-wrap gap-2">
            {order.items && order.items.map((item, index) => (
              <div key={index} className="flex items-center bg-gray-50 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 rounded-full">x{item.quantity}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Footer - Price, Table Number, View Details */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500">Total:</span>
            <span className="ml-1 font-semibold text-gray-900">₹{order.total?.toFixed(2) || '0.00'}</span>
          </div>
          
          {order.tableNumber && (
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
              Table {order.tableNumber}
            </div>
          )}
          
          <button className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium">
            View Details <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;