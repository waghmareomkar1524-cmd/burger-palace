// Simple OTP Service for Classic Cafe
// This service simulates OTP sending without Firebase Phone Auth

export class OTPService {
  
  // Store OTPs in memory (in production, use a proper backend)
  static otpStorage = new Map();
  
  // Generate a random 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // Send OTP to phone number
  static async sendOTP(phoneNumber) {
    try {
      console.log('Sending OTP to:', phoneNumber);
      
      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP with timestamp (valid for 5 minutes)
      const expiryTime = Date.now() + (5 * 60 * 1000); // 5 minutes
      this.otpStorage.set(phoneNumber, {
        otp: otp,
        expiry: expiryTime,
        attempts: 0
      });
      
      // In development, show OTP in console
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 OTP for', phoneNumber, ':', otp);
        console.log('⏰ Valid for 5 minutes');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would integrate with SMS service like:
      // - Twilio
      // - AWS SNS
      // - MessageBird
      // - Your own SMS gateway
      
      console.log('✅ OTP sent successfully');
      return { 
        success: true, 
        message: 'OTP sent successfully',
        otp: process.env.NODE_ENV === 'development' ? otp : null // Only return OTP in development
      };
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { 
        success: false, 
        error: 'Failed to send OTP. Please try again.' 
      };
    }
  }
  
  // Verify OTP
  static async verifyOTP(phoneNumber, enteredOTP) {
    try {
      console.log('Verifying OTP for:', phoneNumber);
      
      const storedData = this.otpStorage.get(phoneNumber);
      
      if (!storedData) {
        return { 
          success: false, 
          error: 'No OTP found for this number. Please request a new OTP.' 
        };
      }
      
      // Check if OTP has expired
      if (Date.now() > storedData.expiry) {
        this.otpStorage.delete(phoneNumber);
        return { 
          success: false, 
          error: 'OTP has expired. Please request a new one.' 
        };
      }
      
      // Check attempt limit (max 3 attempts)
      if (storedData.attempts >= 3) {
        this.otpStorage.delete(phoneNumber);
        return { 
          success: false, 
          error: 'Too many failed attempts. Please request a new OTP.' 
        };
      }
      
      // Verify OTP
      if (storedData.otp === enteredOTP) {
        // OTP is correct, remove it from storage
        this.otpStorage.delete(phoneNumber);
        console.log('✅ OTP verified successfully');
        return { success: true, message: 'OTP verified successfully' };
      } else {
        // Increment attempt count
        storedData.attempts += 1;
        this.otpStorage.set(phoneNumber, storedData);
        
        const remainingAttempts = 3 - storedData.attempts;
        return { 
          success: false, 
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
        };
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { 
        success: false, 
        error: 'Failed to verify OTP. Please try again.' 
      };
    }
  }
  
  // Check if phone number has pending OTP
  static hasPendingOTP(phoneNumber) {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) return false;
    
    // Check if not expired
    return Date.now() <= storedData.expiry;
  }
  
  // Get remaining time for OTP
  static getRemainingTime(phoneNumber) {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) return 0;
    
    const remaining = Math.max(0, storedData.expiry - Date.now());
    return Math.ceil(remaining / 1000); // Return seconds
  }
  
  // Clear expired OTPs (cleanup function)
  static cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [phoneNumber, data] of this.otpStorage.entries()) {
      if (now > data.expiry) {
        this.otpStorage.delete(phoneNumber);
      }
    }
  }
  
  // Get OTP status for debugging
  static getOTPStatus(phoneNumber) {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) {
      return { exists: false };
    }
    
    return {
      exists: true,
      attempts: storedData.attempts,
      remainingTime: this.getRemainingTime(phoneNumber),
      isExpired: Date.now() > storedData.expiry
    };
  }
}

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  OTPService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);

export default OTPService;


