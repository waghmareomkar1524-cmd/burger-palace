// Test Twilio credentials
export const testTwilioCredentials = async () => {
  const accountSid = 'ACe76cc6f2b719f306b070627281dcb429';
  const authToken = 'e3c049f72a98a2546726b603746d0fad';
  
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      }
    });
    
    if (response.ok) {
      const account = await response.json();
      console.log('✅ Twilio credentials are valid:', account.status);
      return { success: true, account };
    } else {
      const error = await response.text();
      console.error('❌ Twilio credentials are invalid:', response.status, error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('❌ Twilio test failed:', error);
    return { success: false, error: error.message };
  }
};

