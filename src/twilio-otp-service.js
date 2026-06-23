// Twilio OTP Service
// Calls /api/send-otp (Vercel serverless function) to avoid CORS issues

export class TwilioOTPService {

  static otpStorage = new Map();

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(phoneNumber) {
    try {
      const otp = this.generateOTP();

      const expiryTime = Date.now() + (5 * 60 * 1000);
      this.otpStorage.set(phoneNumber, {
        otp: otp,
        expiry: expiryTime,
        attempts: 0
      });

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp })
      });

      const result = await response.json();

      if (result.success) {
        console.log('OTP sent successfully');
        return {
          success: true,
          message: 'OTP sent successfully',
          messageId: result.request_id
        };
      } else {
        console.error('OTP send failed:', result.error);
        return {
          success: false,
          error: result.error || 'Failed to send OTP. Please try again.'
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

  static async verifyOTP(phoneNumber, enteredOTP) {
    try {
      let storedData = this.otpStorage.get(phoneNumber);
      let actualPhoneNumber = phoneNumber;

      if (!storedData) {
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

      if (Date.now() > storedData.expiry) {
        this.otpStorage.delete(actualPhoneNumber);
        return {
          success: false,
          error: 'OTP has expired. Please request a new one.'
        };
      }

      if (storedData.attempts >= 3) {
        this.otpStorage.delete(actualPhoneNumber);
        return {
          success: false,
          error: 'Too many failed attempts. Please request a new OTP.'
        };
      }

      if (storedData.otp === enteredOTP) {
        this.otpStorage.delete(actualPhoneNumber);
        return { success: true, message: 'OTP verified successfully' };
      } else {
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

  static hasPendingOTP(phoneNumber) {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) return false;
    return Date.now() <= storedData.expiry;
  }

  static getRemainingTime(phoneNumber) {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) return 0;
    const remaining = Math.max(0, storedData.expiry - Date.now());
    return Math.ceil(remaining / 1000);
  }

  static cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [phoneNumber, data] of this.otpStorage.entries()) {
      if (now > data.expiry) {
        this.otpStorage.delete(phoneNumber);
      }
    }
  }

  static getOTPStatus(phoneNumber) {
    const storedData = this.otpStorage.get(phoneNumber);
    if (!storedData) return { exists: false };

    return {
      exists: true,
      attempts: storedData.attempts,
      remainingTime: this.getRemainingTime(phoneNumber),
      isExpired: Date.now() > storedData.expiry
    };
  }
}

setInterval(() => {
  TwilioOTPService.cleanupExpiredOTPs();
}, 5 * 60 * 1000);

export default TwilioOTPService;
