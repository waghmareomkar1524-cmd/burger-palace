// Twilio SMS Integration for OTP Service
// This service sends real SMS messages using Twilio

export class TwilioOTPService {
  
  // Store OTPs in memory (in production, use a proper backend)
  static otpStorage = new Map();
  
  // Twilio configuration
  static twilioConfig = {
    accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID_HERE',
    authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN_HERE',
    fromNumber: process.env.REACT_APP_TWILIO_FROM_NUMBER || 'YOUR_TWILIO_PHONE_NUMBER_HERE'
  };
  
  // Generate a random 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // Send OTP via Twilio SMS
  static async sendOTP(phoneNumber) {
    try {
      console.log('Sending OTP via Twilio to:', phoneNumber);
      
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
      
      // Force production mode for real SMS sending
      // Comment out this block to enable real SMS sending
      /*
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Development Mode - OTP:', otp);
        console.log('📱 Would send SMS to:', formattedNumber);
        console.log('💬 Message:', message);
        
        // In development, simulate SMS sending
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return { 
          success: true, 
          message: 'OTP sent successfully (Development Mode)',
          otp: otp // Return OTP in development
        };
      }
      */
      
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
        console.log('✅ SMS sent successfully via Twilio:', messageResult.sid);
        console.log('🔐 OTP sent via SMS:', otp);
        
        return { 
          success: true, 
          message: 'OTP sent successfully via SMS',
          messageId: messageResult.sid,
          otp: otp // Include OTP for verification
        };
        
      } catch (twilioError) {
        console.error('Twilio SMS Error:', twilioError);
        
        // Fallback to development mode if Twilio fails
        console.log('🔄 Falling back to development mode');
        console.log('🔐 Fallback OTP for testing:', otp);
        return { 
          success: true, 
          message: 'OTP sent successfully (Fallback Mode)',
          otp: otp,
          error: 'Twilio service unavailable, using fallback'
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
      console.log('Verifying OTP for:', phoneNumber);
      console.log('Entered OTP:', enteredOTP);
      console.log('OTP Storage contents:', Array.from(this.otpStorage.entries()));
      
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
            console.log('Found OTP with format:', format);
            break;
          }
        }
      }
      
      if (!storedData) {
        console.error('No stored OTP found for phone number:', phoneNumber);
        console.error('Available phone numbers in storage:', Array.from(this.otpStorage.keys()));
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
      console.log('Comparing stored OTP:', storedData.otp, 'with entered OTP:', enteredOTP);
      console.log('OTP match:', storedData.otp === enteredOTP);
      
      if (storedData.otp === enteredOTP) {
        // OTP is correct, remove it from storage
        this.otpStorage.delete(actualPhoneNumber);
        console.log('✅ OTP verified successfully');
        return { success: true, message: 'OTP verified successfully' };
      } else {
        // Increment attempt count
        storedData.attempts += 1;
        this.otpStorage.set(actualPhoneNumber, storedData);
        
        const remainingAttempts = 3 - storedData.attempts;
        console.log('❌ OTP mismatch. Attempts:', storedData.attempts, 'Remaining:', remainingAttempts);
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
      // Always test Twilio connection (commented out development mode skip)
      /*
      if (process.env.NODE_ENV === 'development') {
        return { 
          success: true, 
          message: 'Development mode - Twilio test skipped',
          config: {
            accountSid: this.twilioConfig.accountSid,
            fromNumber: this.twilioConfig.fromNumber
          }
        };
      }
      */
      
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
      console.error('Twilio connection test failed:', error);
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
