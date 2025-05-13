import { supabase } from '../supabase';

// Create a new order
export const createOrder = async (orderData) => {
  try {
    // Set initial status to 'pending'
    const order = {
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get orders by user ID
export const getUserOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId) // Ensure column name matches your DB
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  // Update the allowed statuses to match your database schema and include 'ready'
  // const allowedStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'rejected', 'completed'];

  // if (!allowedStatuses.includes(status)) {
  //   throw new Error(`Invalid status: ${status}`);
  // }

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};


// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Listen for order status changes
export const subscribeToOrderUpdates = (orderId, callback) => {
  return supabase
    .channel(`order-${orderId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `id=eq.${orderId}`
    }, payload => {
      callback(payload.new);
    })
    .subscribe();
};

// Listen for new orders (admin side)
export const subscribeToNewOrders = (callback) => {
  return supabase
    .channel('new-orders')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'orders'
    }, payload => {
      callback(payload.new);
    })
    .subscribe();
};

// Get orders by status for admin
export const getOrdersByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching ${status} orders:`, error);
    throw error;
  }
};