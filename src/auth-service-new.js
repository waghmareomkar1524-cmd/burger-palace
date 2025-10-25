// New Authentication Service for Classic Cafe
import { 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get, remove } from 'firebase/database';
import { auth, database } from './firebase-config';
import { TwilioOTPService } from './twilio-otp-service';

export class AuthServiceNew {
  
  
  // Send OTP for registration
  static async sendRegistrationOTP(mobile) {
    try {
      // First check if user already exists in database
      const userCheck = await this.checkUserExists(mobile);
      
      if (userCheck.exists) {
        return { 
          success: false, 
          error: 'User already exists. Please login instead.',
          shouldLogin: true 
        };
      }

      // Use the Twilio OTP service
      const result = await TwilioOTPService.sendOTP(mobile);
      
      // Always store the phone number for verification, even if SMS fails
      // This allows fallback OTP verification
      window.pendingPhoneNumber = mobile;
      
      return result;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { 
        success: false, 
        error: 'Failed to send OTP. Please try again.' 
      };
    }
  }
  
  // Verify OTP and complete registration
  static async verifyOTPAndRegister(otp, userData) {
    try {
      if (!window.pendingPhoneNumber) {
        return { success: false, error: 'No OTP session found. Please request OTP again.' };
      }

      // Verify OTP using the Twilio service
      // Use the mobile number from userData to ensure consistency
      const phoneNumberToVerify = userData.mobile || window.pendingPhoneNumber;
      const otpResult = await TwilioOTPService.verifyOTP(phoneNumberToVerify, otp);
      
      if (!otpResult.success) {
        return otpResult;
      }
      
      // Create a mock user object
      const mockUser = {
        uid: `user_${Date.now()}`,
        phoneNumber: `+91${window.pendingPhoneNumber}`,
        displayName: `${userData.name} ${userData.surname}`
      };
      
      // Store user data in Realtime Database
      try {
        const userRef = ref(database, `users/${mockUser.uid}`);
        const userDataToStore = {
          name: userData.name,
          surname: userData.surname,
          mobile: userData.mobile,
          phoneNumber: mockUser.phoneNumber,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          verified: true
        };
        
        await set(userRef, userDataToStore);
        
      } catch (dbError) {
        console.warn('Database storage failed, but user registration continues:', dbError.message);
        // Continue with registration even if database write fails
      }
      
      // Clear pending phone number
      window.pendingPhoneNumber = null;
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { 
        success: false, 
        error: 'Failed to verify OTP. Please try again.' 
      };
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
          const user = users[userId];
          
          if (user.mobile === mobile) {
            return { exists: true, userData: { [userId]: users[userId] } };
          }
        }
      }
      
      return { exists: false };
    } catch (error) {
      console.error('Error checking user:', error);
      // Return false if database access fails - don't assume user exists
      return { exists: false, error: error.message };
    }
  }
  
  // Login user with OTP
  static async sendLoginOTP(mobile) {
    try {
      // First check if user exists in database
      const userCheck = await this.checkUserExists(mobile);
      if (!userCheck.exists) {
        return { 
          success: false, 
          error: 'User not found. Please register first.',
          shouldRegister: true 
        };
      }

      // Use the Twilio OTP service
      const result = await TwilioOTPService.sendOTP(mobile);

      if (result.success) {
        // Store the phone number for verification
        window.pendingLoginPhoneNumber = mobile;
      }

      return result;
    } catch (error) {
      console.error('Error sending login OTP:', error);
      return {
        success: false,
        error: 'Failed to send OTP. Please try again.'
      };
    }
  }
  
  // Verify OTP for login
  static async verifyLoginOTP(otp) {
    try {
      if (!window.pendingLoginPhoneNumber) {
        return { success: false, error: 'No OTP session found. Please request OTP again.' };
      }

      // Verify OTP using the Twilio service
      const otpResult = await TwilioOTPService.verifyOTP(window.pendingLoginPhoneNumber, otp);
      
      if (!otpResult.success) {
        return otpResult;
      }
      
      // Find the user in database
      const userCheck = await this.checkUserExists(window.pendingLoginPhoneNumber);
      if (!userCheck.exists) {
        return { success: false, error: 'User not found in database.' };
      }
      
      // Create a mock user object
      const userId = Object.keys(userCheck.userData)[0];
      const userData = userCheck.userData[userId];
      const mockUser = {
        uid: userId,
        phoneNumber: `+91${window.pendingLoginPhoneNumber}`,
        displayName: `${userData.name} ${userData.surname}`
      };
      
      // Update last login
      try {
        const userRef = ref(database, `users/${userId}/lastLogin`);
        await set(userRef, Date.now());
      } catch (dbError) {
        console.warn('Failed to update last login, but login continues:', dbError.message);
        // Continue with login even if database update fails
      }
      
      // Clear pending phone number
      window.pendingLoginPhoneNumber = null;
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login OTP verification error:', error);
      return { 
        success: false, 
        error: 'Failed to verify OTP. Please try again.' 
      };
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
  
  // Debug function to check all users in database
  static async debugDatabase() {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
      console.error('Error checking database:', error);
      return {};
    }
  }
  
  // Clean up duplicate users (keep the latest one)
  static async cleanupDuplicateUsers() {
    try {
      console.log('🧹 Starting cleanup of duplicate users...');
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (!snapshot.exists()) {
        console.log('📊 No users found for cleanup');
        return { success: true, message: 'No users found' };
      }
      
      const users = snapshot.val();
      const mobileToUsers = {};
      const duplicatesToRemove = [];
      
      // Group users by mobile number
      for (const userId in users) {
        const user = users[userId];
        if (user.mobile) {
          if (!mobileToUsers[user.mobile]) {
            mobileToUsers[user.mobile] = [];
          }
          mobileToUsers[user.mobile].push({ userId, user });
        }
      }
      
      // Find duplicates and mark oldest for removal
      for (const mobile in mobileToUsers) {
        const userList = mobileToUsers[mobile];
        if (userList.length > 1) {
          console.log(`🔍 Found ${userList.length} users for mobile ${mobile}`);
          
          // Sort by creation date (keep the latest)
          userList.sort((a, b) => (b.user.createdAt || 0) - (a.user.createdAt || 0));
          
          // Mark all except the first (latest) for removal
          for (let i = 1; i < userList.length; i++) {
            duplicatesToRemove.push(userList[i].userId);
            console.log(`🗑️ Marking for removal: ${userList[i].userId} (created: ${userList[i].user.createdAt})`);
          }
        }
      }
      
      // Remove duplicates
      for (const userId of duplicatesToRemove) {
        try {
          await remove(ref(database, `users/${userId}`));
          console.log(`✅ Removed duplicate user: ${userId}`);
        } catch (error) {
          console.error(`❌ Failed to remove user ${userId}:`, error);
        }
      }
      
      console.log(`🧹 Cleanup complete. Removed ${duplicatesToRemove.length} duplicate users.`);
      return { 
        success: true, 
        removed: duplicatesToRemove.length,
        message: `Removed ${duplicatesToRemove.length} duplicate users` 
      };
      
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }
}

// Expose cleanup function globally for testing
if (typeof window !== 'undefined') {
  window.cleanupDuplicateUsers = AuthServiceNew.cleanupDuplicateUsers;
  window.debugDatabase = AuthServiceNew.debugDatabase;
}

export default AuthServiceNew;