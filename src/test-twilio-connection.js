// Test script to verify Twilio connection
// Run this in browser console or as a separate test

import { TwilioOTPService } from './twilio-otp-service';

// Test function to run in browser console
window.testTwilioConnection = async () => {
  console.log('🧪 Testing Twilio Connection...');
  
  // Test 1: Check environment variables
  console.log('📋 Environment Variables:');
  console.log('REACT_APP_TWILIO_ACCOUNT_SID:', process.env.REACT_APP_TWILIO_ACCOUNT_SID);
  console.log('REACT_APP_TWILIO_AUTH_TOKEN:', process.env.REACT_APP_TWILIO_AUTH_TOKEN ? '***hidden***' : 'NOT SET');
  console.log('REACT_APP_TWILIO_FROM_NUMBER:', process.env.REACT_APP_TWILIO_FROM_NUMBER);
  
  // Test 2: Test Twilio API connection
  const connectionTest = await TwilioOTPService.testTwilioConnection();
  console.log('🔗 Twilio Connection Test:', connectionTest);
  
  // Test 3: Test OTP sending (with a test number)
  console.log('📱 Testing OTP sending...');
  const testPhoneNumber = '9999999999'; // Replace with a real number for testing
  const otpResult = await TwilioOTPService.sendOTP(testPhoneNumber);
  console.log('📨 OTP Send Result:', otpResult);
  
  return {
    environmentVariables: {
      accountSid: !!process.env.REACT_APP_TWILIO_ACCOUNT_SID,
      authToken: !!process.env.REACT_APP_TWILIO_AUTH_TOKEN,
      fromNumber: !!process.env.REACT_APP_TWILIO_FROM_NUMBER
    },
    connectionTest,
    otpResult
  };
};

// Auto-run test when script loads (for development)
if (typeof window !== 'undefined') {
  console.log('🚀 Twilio Test Script Loaded. Run testTwilioConnection() in console to test.');
}
