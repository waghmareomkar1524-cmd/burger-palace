// Vercel serverless function — proxies OTP request to Twilio
// Keeps credentials server-side and avoids CORS issues

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'phone and otp are required' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return res.status(500).json({ error: 'Twilio not configured' });
  }

  // Format to E.164 — add +91 if it's a 10-digit Indian number
  let toNumber = phone;
  if (/^\d{10}$/.test(phone)) {
    toNumber = `+91${phone}`;
  } else if (/^91\d{10}$/.test(phone)) {
    toNumber = `+${phone}`;
  }

  try {
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append('To', toNumber);
    formData.append('From', fromNumber);
    formData.append('Body', `Your Classic Cafe OTP is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, messageId: result.sid });
    } else {
      console.error('Twilio error:', result);
      return res.status(400).json({ success: false, error: result.message || 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ success: false, error: 'SMS service unavailable' });
  }
}
