// Vercel serverless function — proxies OTP request to Fast2SMS
// Keeps the API key server-side and avoids CORS issues

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'phone and otp are required' });
  }

  // Strip country code — Fast2SMS expects 10-digit Indian number
  const digits = phone.replace(/^\+91/, '').replace(/^91/, '');

  if (!/^\d{10}$/.test(digits)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.REACT_APP_FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: digits
      })
    });

    const result = await response.json();

    if (result.return === true) {
      return res.status(200).json({ success: true, request_id: result.request_id });
    } else {
      const errorMsg = Array.isArray(result.message) ? result.message[0] : result.message;
      return res.status(400).json({ success: false, error: errorMsg || 'SMS sending failed' });
    }
  } catch (error) {
    console.error('Fast2SMS error:', error);
    return res.status(500).json({ success: false, error: 'SMS service unavailable' });
  }
}
