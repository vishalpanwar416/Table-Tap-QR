import React, { useState } from 'react';
import { Check, X, Truck, CheckCircle, ChevronDown, ChevronRight, User, Clock, Calendar, MapPin, Phone, Filter, Search } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAdminNotifications } from '../../context/AdminNotificationContext';

const OrderManagement = ({ orders, updateOrderStatus }) => {
  const { createNotification } = useAdminNotifications();
  const [viewType, setViewType] = useState('tiles'); // 'tiles' or 'table'
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAcceptOrder = async (orderId, userId) => {
    try {
      await updateOrderStatus(orderId, 'preparing');
      
      // Create notification
      await createNotification({
        orderId,
        type: 'order_accepted',
        userId,
        message: `Order #${orderId.slice(0,8)} is being prepared`
      });
      
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };
  
  const handleRejectOrder = async (orderId, userId) => {
    try {
      await updateOrderStatus(orderId, 'rejected');
      
      await createNotification({
        orderId,
        type: 'order_rejected',
        userId,
        message: `Order #${orderId.slice(0,8)} was rejected`
      });
      
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };
  
  const handleCompleteOrder = async (orderId, userId) => {
    try {
      await updateOrderStatus(orderId, 'ready');
      
      await createNotification({
        orderId,
        type: 'order_completed',
        userId,
        message: `Order #${orderId.slice(0,8)} is completed and ready for Serving`
      });
      
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };
  
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      preparing: 'bg-purple-100 text-purple-800 border border-purple-200',
      ready: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[status] || 'bg-gray-100'
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const toggleOrderExpansion = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (order.id && order.id.toLowerCase().includes(searchLower)) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
        (order.customerPhone && order.customerPhone.toLowerCase().includes(searchLower)) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              
              {/* View toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewType('tiles')}
                  className={`px-3 py-2 ${viewType === 'tiles' ? 'bg-orange-50 text-orange-600' : 'bg-white text-gray-600'}`}
                >
                  Tiles
                </button>
                <button
                  onClick={() => setViewType('table')}
                  className={`px-3 py-2 ${viewType === 'table' ? 'bg-orange-50 text-orange-600' : 'bg-white text-gray-600'}`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-6">
        {viewType === 'tiles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-500">
                No orders found matching your filters.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order header */}
                  <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
                    <div className="flex items-center">
                      <div className="mr-2">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at || new Date())}</p>
                      </div>
                    </div>
                    <div>{getStatusBadge(order.status || 'pending')}</div>
                  </div>
                  
                  {/* Order content */}
                  <div className="p-3">
                    {/* Customer info */}
                    <div className="mb-3">
                      <div className="flex items-center mb-1">
                        <User size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm font-medium">{order.customerName || 'Guest'}</span>
                      </div>
                      
                      {order.customerPhone && (
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Phone size={12} className="mr-1" />
                          <span>{order.customerPhone}</span>
                        </div>
                      )}
                      
                      {order.address && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{order.address}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Order items preview */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500 font-medium">{(order.items || []).length} ITEMS</p>
                        <button 
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="text-xs text-orange-500 hover:text-orange-600 flex items-center"
                        >
                          {expandedOrderId === order.id ? (
                            <>Hide details <ChevronDown size={14} className="ml-1" /></>
                          ) : (
                            <>View details <ChevronRight size={14} className="ml-1" /></>
                          )}
                        </button>
                      </div>
                      
                      {/* Order items images */}
                      <div className="flex mb-3 space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                        {(order.items || []).slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                            <img 
                              src={item.image || `/api/placeholder/64/64`} 
                              alt={item.name || `Item ${idx+1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {(order.items || []).length > 4 && (
                          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 text-sm font-medium">
                            +{(order.items || []).length - 4}
                          </div>
                        )}
                      </div>
                      
                      {/* Expanded order items details */}
                      {expandedOrderId === order.id && (
                        <div className="mt-2 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Order items</h4>
                          <div className="space-y-3">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3 border border-gray-200 bg-white">
                                  <img 
                                    src={item.image || `/api/placeholder/40/40`} 
                                    alt={item.name || `Item ${idx+1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{item.name || `Item ${idx+1}`}</p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{item.quantity || 1} × ₹{item.price?.toFixed(2) || '0.00'}</span>
                                    <span>₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Price summary */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Subtotal</span>
                              <span>₹{(order.subtotal || order.total || 0).toFixed(2)}</span>
                            </div>
                            {order.deliveryFee > 0 && (
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Delivery</span>
                                <span>₹{order.deliveryFee?.toFixed(2) || '0.00'}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium text-sm mt-1">
                              <span>Total</span>
                              <span>₹{order.total?.toFixed(2) || '0.00'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Total Amount</div>
                        <div className="font-semibold">₹{order.total?.toFixed(2) || '0.00'}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptOrder(order.id, order.userId)}
                              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                              title="Accept Order"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id, order.userId)}
                              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                              title="Reject Order"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                       {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="px-4 py-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 flex items-center"
                          >
                            <CheckCircle size={16} className="mr-1" /> Ready
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Table view
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customerName || 'Guest'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex space-x-1">
                              {(order.items || []).slice(0, 3).map((item, idx) => (
                                <div key={idx} className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                  <img 
                                    src={item.image || `/api/placeholder/32/32`}
                                    alt={item.name || `Item ${idx+1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {(order.items || []).length > 3 && (
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                  +{(order.items || []).length - 3}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => toggleOrderExpansion(order.id)}
                              className="ml-2 text-xs text-orange-500 hover:text-orange-600"
                            >
                              {expandedOrderId === order.id ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{order.total?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status || 'pending')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at || new Date())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleAcceptOrder(order.id, order.userId)}
                                  className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                  title="Accept Order"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleRejectOrder(order.id, order.userId)}
                                  className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                  title="Reject Order"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => handleCompleteOrder(order.id, order.userId)}
                                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                                title="Mark as Completed"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded row */}
                      {expandedOrderId === order.id && (
                        <tr>
                          <td colSpan="7" className="px-6 py-3 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Order details */}
                              <div>
                                <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Order Details</h4>
                                {order.address && (
                                  <div className="flex items-start mb-2">
                                    <MapPin size={14} className="text-gray-400 mr-2 mt-0.5" />
                                    <span className="text-sm text-gray-600">{order.address}</span>
                                  </div>
                                )}
                                {order.notes && (
                                  <div className="mb-2 text-sm text-gray-600">
                                    <span className="font-medium">Notes: </span>{order.notes}
                                  </div>
                                )}
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Payment: </span>
                                  {order.paymentStatus === 'paid' ? (
                                    <span className="text-green-600">Paid</span>
                                  ) : (
                                    <span className="text-yellow-600">Cash on Delivery</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Order items */}
                              <div>
                                <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {(order.items || []).map((item, idx) => (
                                    <div key={idx} className="flex items-center text-sm">
                                      <div className="w-8 h-8 rounded overflow-hidden mr-2 border border-gray-200">
                                        <img 
                                          src={item.image || `/api/placeholder/32/32`} 
                                          alt={item.name || `Item ${idx+1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.name || `Item ${idx+1}`}</p>
                                      </div>
                                      <div className="text-gray-500 ml-2">
                                        {item.quantity || 1} × ₹{item.price?.toFixed(2) || '0.00'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;