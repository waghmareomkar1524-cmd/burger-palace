// New Authentication Service for Classic Cafe
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from './firebase-config';

export class AuthServiceNew {
  
  // Initialize reCAPTCHA verifier
  static initializeRecaptcha() {
    // Clear any existing verifier
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        // Re-initialize on expiry
        this.initializeRecaptcha();
      }
    }, auth);
    
    return window.recaptchaVerifier;
  }
  
  // Send OTP for registration
  static async sendRegistrationOTP(mobile) {
    try {
      // Development mode - use test OTP
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Using test OTP');
        window.testOTP = '123456';
        return { success: true, message: 'Test OTP: 123456' };
      }

      // Ensure reCAPTCHA container exists
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        return { success: false, error: 'reCAPTCHA container not found. Please refresh the page.' };
      }

      const appVerifier = this.initializeRecaptcha();
      const phoneNumber = `+91${mobile}`;
      
      // Add a small delay to ensure reCAPTCHA is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Clear verifier on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      
      let errorMessage = error.message;
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('appVerificationDisabledForTesting')) {
        errorMessage = 'Phone authentication not configured. Please check Firebase setup.';
      }
      
      return { success: false, error: errorMessage };
    }
  }
  
  // Verify OTP and complete registration
  static async verifyOTPAndRegister(otp, userData) {
    try {
      // Development mode - use test OTP
      if (process.env.NODE_ENV === 'development') {
        if (otp === '123456') {
          // Create a mock user for development
          const mockUser = {
            uid: `dev_${Date.now()}`,
            phoneNumber: `+91${userData.mobile}`
          };
          
          try {
            // Store user data in Realtime Database
            const userRef = ref(database, `users/${mockUser.uid}`);
            await set(userRef, {
              name: userData.name,
              surname: userData.surname,
              mobile: userData.mobile,
              phoneNumber: mockUser.phoneNumber,
              createdAt: Date.now(),
              lastLogin: Date.now(),
              verified: true
            });
            console.log('User data stored successfully in development mode');
            console.log('User data:', {
              name: userData.name,
              surname: userData.surname,
              mobile: userData.mobile,
              phoneNumber: mockUser.phoneNumber,
              createdAt: Date.now(),
              lastLogin: Date.now(),
              verified: true
            });
          } catch (dbError) {
            console.error('Database storage failed in development mode:', dbError);
            return { success: false, error: 'Failed to save user data to database' };
          }
          
          return { success: true, user: mockUser };
        } else {
          return { success: false, error: 'Invalid OTP. Use 123456 for development.' };
        }
      }

      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      
      // Store user data in Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, {
        name: userData.name,
        surname: userData.surname,
        mobile: userData.mobile,
        phoneNumber: user.phoneNumber,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        verified: true
      });
      
      return { success: true, user: user };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Check if user exists in database
  static async checkUserExists(mobile) {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (const userId in users) {
          if (users[userId].mobile === mobile) {
            return { exists: true, userData: { [userId]: users[userId] } };
          }
        }
      }
      return { exists: false };
    } catch (error) {
      console.error('Error checking user:', error);
      // In development mode, if database access fails, assume user exists
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Assuming user exists for testing');
        return { exists: true, userData: { 'dev_user': { mobile: mobile } } };
      }
      return { exists: false, error: error.message };
    }
  }
  
  // Login user with OTP
  static async sendLoginOTP(mobile) {
    try {
      // First check if user exists in database
      const userCheck = await this.checkUserExists(mobile);
      if (!userCheck.exists) {
        return { success: false, error: 'User not found. Please register first.' };
      }
      
      // Development mode - use test OTP
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Using test OTP for login');
        window.testOTP = '123456';
        window.lastLoginMobile = mobile; // Store mobile for verification
        return { success: true, message: 'Test OTP: 123456' };
      }
      
      // Ensure reCAPTCHA container exists
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        return { success: false, error: 'reCAPTCHA container not found. Please refresh the page.' };
      }

      const appVerifier = this.initializeRecaptcha();
      const phoneNumber = `+91${mobile}`;
      
      // Add a small delay to ensure reCAPTCHA is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending login OTP:', error);
      
      // Clear verifier on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      
      let errorMessage = error.message;
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('appVerificationDisabledForTesting')) {
        errorMessage = 'Phone authentication not configured. Please check Firebase setup.';
      }
      
      return { success: false, error: errorMessage };
    }
  }
  
  // Verify OTP for login
  static async verifyLoginOTP(otp) {
    try {
      // Development mode - use test OTP
      if (process.env.NODE_ENV === 'development') {
        if (otp === '123456') {
          // Find the user in database
          const userCheck = await this.checkUserExists(window.lastLoginMobile);
          if (userCheck.exists) {
            // Create a mock user for development
            const mockUser = {
              uid: Object.keys(userCheck.userData)[0] || `dev_${Date.now()}`,
              phoneNumber: `+91${window.lastLoginMobile}`
            };
            
            // Update last login
            const userRef = ref(database, `users/${mockUser.uid}/lastLogin`);
            await set(userRef, Date.now());
            
            return { success: true, user: mockUser };
          } else {
            return { success: false, error: 'User not found in development mode.' };
          }
        } else {
          return { success: false, error: 'Invalid OTP. Use 123456 for development.' };
        }
      }

      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      
      // Update last login
      const userRef = ref(database, `users/${user.uid}/lastLogin`);
      await set(userRef, Date.now());
      
      return { success: true, user: user };
    } catch (error) {
      console.error('Login OTP verification error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get user profile
  static async getUserProfile(userId) {
    try {
      console.log('Getting user profile for userId:', userId);
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log('User profile data:', userData);
        return userData;
      }
      console.log('No user profile found for userId:', userId);
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
  
  // Update user profile
  static async updateUserProfile(userId, profileData) {
    try {
      const userRef = ref(database, `users/${userId}`);
      await set(userRef, profileData);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Add order to user
  static async addOrderToUser(userId, orderData) {
    try {
      const orderId = Date.now().toString();
      const orderRef = ref(database, `users/${userId}/orders/${orderId}`);
      await set(orderRef, {
        ...orderData,
        orderId,
        createdAt: Date.now(),
        status: 'pending'
      });
      return { success: true, orderId };
    } catch (error) {
      console.error('Error adding order:', error);
      return { success: false, error: error.message };
    }
  }

  // Place order (alias for addOrderToUser)
  static async placeOrder(userId, orderData) {
    return this.addOrderToUser(userId, orderData);
  }
  
  // Get user orders
  static async getUserOrders(userId) {
    try {
      const ordersRef = ref(database, `users/${userId}/orders`);
      const snapshot = await get(ordersRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error('Error getting orders:', error);
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

export default AuthServiceNew;