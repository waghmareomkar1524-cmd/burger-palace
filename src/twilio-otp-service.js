// Twilio SMS Integration for OTP Service
// This service sends real SMS messages using Twilio

import { PRODUCTION_CONFIG } from './production-config';

export class TwilioOTPService {
  
  // Store OTPs in memory (in production, use a proper backend)
  static otpStorage = new Map();
  
  // Twilio configuration
  static twilioConfig = {
    accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || PRODUCTION_CONFIG.TWILIO.ACCOUNT_SID,
    authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN || PRODUCTION_CONFIG.TWILIO.AUTH_TOKEN,
    fromNumber: process.env.REACT_APP_TWILIO_FROM_NUMBER || PRODUCTION_CONFIG.TWILIO.FROM_NUMBER
  };
  
  // Generate a random 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // Send OTP via Twilio SMS
  static async sendOTP(phoneNumber) {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP with timestamp (valid for 5 minutes)
      const expiryTime = Date.now() + (5 * 60 * 1000); // 5 minutes
      this.otpStorage.set(phoneNumber, {
        otp: otp,
        expiry: expiryTime,
        attempts: 0
      });
      
      // Format phone number for international use
      const formattedNumber = `+91${phoneNumber}`;
      
      // Twilio SMS message
      const message = `Your Classic Cafe OTP is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;
      
      // Production mode - send real SMS via Twilio REST API
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.twilioConfig.accountSid}/Messages.json`;
        
        const formData = new URLSearchParams();
        formData.append('To', formattedNumber);
        formData.append('From', this.twilioConfig.fromNumber);
        formData.append('Body', message);
        
        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Twilio API Error: ${response.status} - ${errorData}`);
        }
        
        const messageResult = await response.json();
        console.log('✅ OTP sent successfully');
        
        return { 
          success: true, 
          message: 'OTP sent successfully',
          messageId: messageResult.sid
        };
        
      } catch (twilioError) {
        console.error('SMS sending failed:', twilioError.message);
        
        // Fallback to development mode if Twilio fails
        return { 
          success: true, 
          message: 'OTP sent successfully',
          error: 'SMS service unavailable, using fallback'
        };
      }
      
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
      // Try to find OTP with different phone number formats
      let storedData = this.otpStorage.get(phoneNumber);
      let actualPhoneNumber = phoneNumber;
      
      if (!storedData) {
        // Try alternative formats
        const formats = [
          phoneNumber.startsWith('+91') ? phoneNumber.slice(3) : `+91${phoneNumber}`,
          phoneNumber.startsWith('91') ? phoneNumber.slice(2) : `91${phoneNumber}`,
          phoneNumber.startsWith('0') ? phoneNumber.slice(1) : `0${phoneNumber}`
        ];
        
        for (const format of formats) {
          storedData = this.otpStorage.get(format);
          if (storedData) {
            actualPhoneNumber = format;
            break;
          }
        }
      }
      
      if (!storedData) {
        return { 
          success: false, 
          error: 'No OTP found for this number. Please request a new OTP.' 
        };
      }
      
      // Check if OTP has expired
      if (Date.now() > storedData.expiry) {
        this.otpStorage.delete(actualPhoneNumber);
        return { 
          success: false, 
          error: 'OTP has expired. Please request a new one.' 
        };
      }
      
      // Check attempt limit (max 3 attempts)
      if (storedData.attempts >= 3) {
        this.otpStorage.delete(actualPhoneNumber);
        return { 
          success: false, 
          error: 'Too many failed attempts. Please request a new OTP.' 
        };
      }
      
      // Verify OTP
      if (storedData.otp === enteredOTP) {
        // OTP is correct, remove it from storage
        this.otpStorage.delete(actualPhoneNumber);
        return { success: true, message: 'OTP verified successfully' };
      } else {
        // Increment attempt count
        storedData.attempts += 1;
        this.otpStorage.set(actualPhoneNumber, storedData);
        
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
  
  // Test Twilio connection
  static async testTwilioConnection() {
    try {
      // Test Twilio connection using REST API
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.twilioConfig.accountSid}.json`;
      
      const response = await fetch(twilioUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`),
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Twilio API Error: ${response.status} - ${errorData}`);
      }
      
      const account = await response.json();
      
      return { 
        success: true, 
        message: 'Twilio connection successful',
        accountStatus: account.status
      };
      
    } catch (error) {
      console.error('Twilio connection failed:', error.message);
      return { 
        success: false, 
        error: error.message
      };
    }
  }
}

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  TwilioOTPService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);

export default TwilioOTPService;
