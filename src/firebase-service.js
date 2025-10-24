// Firebase Service for Order Management
import { database } from './firebase-config';
import { 
  ref, 
  push, 
  set, 
  get, 
  remove, 
  onValue, 
  off,
  orderByChild,
  query,
  limitToFirst
} from 'firebase/database';

// Order Management Service
export class OrderService {
  
  // Save order to Firebase
  static async saveOrder(orderData, userId = null) {
    try {
      const orderId = Date.now().toString();
      
      // Prepare order data
      const order = {
        orderId,
        orderNumber: orderData.orderNumber,
        tableNumber: orderData.tableNumber,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        timestamp: new Date().toISOString(),
        createdAt: Date.now()
      };
      
      // Save to global orders collection
      await set(ref(database, `orders/${orderId}`), order);
      
      // If userId is provided, also save to user's orders
      if (userId) {
        await set(ref(database, `users/${userId}/orders/${orderId}`), order);
      }
      
      // Add to queue for ESP32
      const queueItem = {
        orderNumber: orderData.orderNumber,
        tableNumber: orderData.tableNumber,
        timestamp: Date.now()
      };
      
      await set(ref(database, `queue/${orderId}`), queueItem);
      
      console.log('Order saved successfully:', order);
      return { success: true, orderId, orderNumber: orderData.orderNumber };
      
    } catch (error) {
      console.error('Error saving order:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get all orders
  static async getAllOrders() {
    try {
      const ordersRef = ref(database, 'orders');
      const snapshot = await get(ordersRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {};
    }
  }
  
  // Get order by ID
  static async getOrderById(orderId) {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      const snapshot = await get(orderRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }
  
  // Update order status
  static async updateOrderStatus(orderId, status) {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      await set(ref(database, `orders/${orderId}/status`), status);
      
      // If order is completed, remove from queue
      if (status === 'completed') {
        await this.removeFromQueue(orderId);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Remove order from queue (for ESP32 integration)
  static async removeFromQueue(orderId) {
    try {
      const queueRef = ref(database, `queue/${orderId}`);
      await remove(queueRef);
      console.log('Order removed from queue:', orderId);
      return { success: true };
    } catch (error) {
      console.error('Error removing from queue:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get next order in queue (for ESP32)
  static async getNextOrderInQueue() {
    try {
      const queueRef = ref(database, 'queue');
      const snapshot = await get(query(queueRef, orderByChild('timestamp'), limitToFirst(1)));
      
      if (snapshot.exists()) {
        const queueData = snapshot.val();
        const orderId = Object.keys(queueData)[0];
        return { orderId, ...queueData[orderId] };
      }
      return null;
    } catch (error) {
      console.error('Error fetching next order:', error);
      return null;
    }
  }
  
  // Listen to queue changes (for ESP32 integration)
  static listenToQueue(callback) {
    const queueRef = ref(database, 'queue');
    
    const unsubscribe = onValue(queueRef, (snapshot) => {
      if (snapshot.exists()) {
        const queueData = snapshot.val();
        callback(queueData);
      } else {
        callback({});
      }
    });
    
    return unsubscribe;
  }
  
  // Listen to order status changes
  static listenToOrderStatus(orderId, callback) {
    const orderRef = ref(database, `orders/${orderId}/status`);
    
    const unsubscribe = onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
    
    return unsubscribe;
  }
  
  // Get orders by status
  static async getOrdersByStatus(status) {
    try {
      const ordersRef = ref(database, 'orders');
      const snapshot = await get(query(ordersRef, orderByChild('status'), status));
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return {};
    }
  }
}

// ESP32 Integration Helper Functions
export const ESP32Integration = {
  
  // Get the first order in queue (oldest timestamp)
  async getFirstOrder() {
    try {
      const queueRef = ref(database, 'queue');
      const snapshot = await get(query(queueRef, orderByChild('timestamp'), limitToFirst(1)));
      
      if (snapshot.exists()) {
        const queueData = snapshot.val();
        const orderId = Object.keys(queueData)[0];
        return { orderId, ...queueData[orderId] };
      }
      return null;
    } catch (error) {
      console.error('Error getting first order:', error);
      return null;
    }
  },
  
  // Mark order as completed and remove from queue
  async completeOrder(orderId) {
    try {
      // Update order status
      await OrderService.updateOrderStatus(orderId, 'completed');
      
      // Remove from queue
      await OrderService.removeFromQueue(orderId);
      
      console.log('Order completed and removed from queue:', orderId);
      return { success: true };
    } catch (error) {
      console.error('Error completing order:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Listen to queue for new orders
  listenToQueue(callback) {
    return OrderService.listenToQueue(callback);
  }
};

export default OrderService;
