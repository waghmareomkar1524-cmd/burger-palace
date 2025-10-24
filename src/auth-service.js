// Authentication Service for Classic Cafe
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { ref, set, get, push } from 'firebase/database';
import { auth, database } from './firebase-config';

export class AuthService {
  
  // Initialize reCAPTCHA verifier
  static initializeRecaptcha() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      }, auth);
    }
    return window.recaptchaVerifier;
  }
  
  // Send OTP to phone number
  static async sendOTP(phoneNumber) {
    try {
      const appVerifier = this.initializeRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Verify OTP and sign in
  static async verifyOTP(otp) {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      
      // Create user profile in database
      await this.createUserProfile(user.uid, {
        phoneNumber: user.phoneNumber,
        createdAt: Date.now(),
        lastLogin: Date.now()
      });
      
      return { success: true, user: user };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Create user profile in database
  static async createUserProfile(userId, userData) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Create new user profile
        await set(userRef, {
          ...userData,
          profile: {
            name: '',
            email: '',
            address: '',
            preferences: {
              notifications: true,
              promotions: true
            }
          },
          orderHistory: {},
          createdAt: Date.now()
        });
        console.log('User profile created');
      } else {
        // Update last login
        await set(ref(database, `users/${userId}/lastLogin`), Date.now());
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Update user profile
  static async updateUserProfile(userId, profileData) {
    try {
      const userRef = ref(database, `users/${userId}/profile`);
      await set(userRef, profileData);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get user profile
  static async getUserProfile(userId) {
    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
  
  // Add order to user history
  static async addOrderToHistory(userId, orderData) {
    try {
      const orderId = orderData.orderId || Date.now().toString();
      const historyRef = ref(database, `users/${userId}/orderHistory/${orderId}`);
      
      await set(historyRef, {
        ...orderData,
        status: 'pending',
        createdAt: Date.now()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding order to history:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Update order status in user history
  static async updateOrderStatusInHistory(userId, orderId, status) {
    try {
      const orderRef = ref(database, `users/${userId}/orderHistory/${orderId}/status`);
      await set(orderRef, status);
      
      if (status === 'completed') {
        const completedAtRef = ref(database, `users/${userId}/orderHistory/${orderId}/completedAt`);
        await set(completedAtRef, Date.now());
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get user order history
  static async getUserOrderHistory(userId) {
    try {
      const historyRef = ref(database, `users/${userId}/orderHistory`);
      const snapshot = await get(historyRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error('Error getting order history:', error);
      return {};
    }
  }
  
  // Sign out user
  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Listen to authentication state changes
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
  
  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }
}

export default AuthService;

