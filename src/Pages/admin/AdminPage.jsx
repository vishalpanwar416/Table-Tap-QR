import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Check, X, Truck, CheckCircle } from 'lucide-react';
import { categories } from '../../components/foodData';
import { supabase, supabaseStorage } from '../../supabase';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('food');
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Snacks',
    tags: [],
    image: '',
    imageFile: null
  });
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch food items from Firebase
  useEffect(() => {
    const fetchFoodItems = async () => {
      const { data, error } = await supabase
        .from('foodItems')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setFoodItems(data);
    };
    fetchFoodItems();
  }, []);

  // Fetch orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
    };
    fetchOrders();
  }, []);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        image: URL.createObjectURL(file)
      });
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabaseStorage
      .from('food-images')
      .upload(filePath, file);

    if (error) throw error;

    return supabaseStorage
      .from('food-images')
      .getPublicUrl(filePath).data.publicUrl;
  };

  // Food Item Management
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      let imageUrl = formData.image;

      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const newItem = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        image: imageUrl,
        created_at: new Date().toISOString()
      };

      if (editItem) {
        const { error } = await supabase
          .from('foodItems')
          .update(newItem)
          .eq('id', editItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('foodItems')
          .insert([newItem]);

        if (error) throw error;
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'Snacks',
        tags: [],
        image: '',
        imageFile: null
      });
      setEditItem(null);

      // Refresh data
      const { data } = await supabase
        .from('foodItems')
        .select('*')
        .order('created_at', { ascending: false });
      
      setFoodItems(data);

    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      ...item,
      tags: item.tags.join(', '),
      imageFile: null
    });
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('foodItems')
        .delete()
        .eq('id', id);

      if (!error) {
        setFoodItems(foodItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };


  // Order Management
  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (!error) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        ));
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // const getStatusIcon = (status) => {
  //   const icons = {
  //     pending: <Clock className="w-4 h-4" />,
  //     accepted: <Check className="w-4 h-4" />,
  //     preparing: <Truck className="w-4 h-4" />,
  //     completed: <CheckCircle className="w-4 h-4" />,
  //     rejected: <X className="w-4 h-4" />
  //   };
  //   return icons[status] || null;
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'food' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Food Items
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'offers' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            Offers
          </button>
        </div>

        {/* Food Items Management */}
        {activeTab === 'food' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    placeholder="Item Name"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Description"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {loading ? 'Processing...' : editItem ? 'Update Item' : 'Add Item'}
                </button>
                
                {editItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditItem(null);
                      setFormData({
                        name: '',
                        price: '',
                        description: '',
                        category: 'Snacks',
                        tags: [],
                        image: '',
                        imageFile: null
                      });
                    }}
                    className="w-full bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Food Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Food Items</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foodItems.map(item => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          ₹{item.price}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{item.name}</h3>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1 text-blue-600 text-sm"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 text-red-600 text-sm"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Orders</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customerName || 'Guest'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status || 'pending')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'accepted')}
                                className="text-green-600 hover:text-green-900"
                                title="Accept Order"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                                title="Reject Order"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                          {order.status === 'accepted' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as Preparing"
                            >
                              <Truck size={18} />
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Completed"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Offers Management */}
        {activeTab === 'offers' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Offers</h2>
            <p className="text-gray-500">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;