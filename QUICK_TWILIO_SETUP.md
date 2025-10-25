# Quick Twilio Setup Script

## 🚀 **Quick Start Guide**

### **1. Install Twilio Package**
```bash
npm install twilio
```

### **2. Create Environment File**
Create `.env` file in your project root:

```bash
# Copy this template and replace with your actual Twilio credentials
REACT_APP_TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID_HERE
REACT_APP_TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN_HERE
REACT_APP_TWILIO_FROM_NUMBER=YOUR_TWILIO_PHONE_NUMBER_HERE
```

### **3. Get Twilio Credentials**

#### **Step A: Create Twilio Account**
1. Go to [console.twilio.com](https://console.twilio.com)
2. Sign up for free account
3. Verify your email and phone

#### **Step B: Get Account SID & Auth Token**
1. Go to Twilio Console Dashboard
2. Copy "Account SID" (starts with AC...)
3. Copy "Auth Token" (click Show to reveal)

#### **Step C: Buy Phone Number**
1. Go to Phone Numbers → Manage → Buy a number
2. Choose a number (preferably your country)
3. Buy it (free trial includes $15 credit)
4. Copy the phone number (starts with +)

### **4. Update .env File**
Replace the template values with your actual credentials:

```bash
REACT_APP_TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID_HERE
REACT_APP_TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN_HERE
REACT_APP_TWILIO_FROM_NUMBER=YOUR_TWILIO_PHONE_NUMBER_HERE
```

### **5. Test the Integration**

#### **Start Your App:**
```bash
npm start
```

#### **Test Twilio Connection:**
1. Look for "OTP Test Panel" in bottom-left corner
2. Click "Test Twilio" button
3. Should show "✅ Twilio connection successful"

#### **Send Test OTP:**
1. Enter your mobile number (10 digits, no +91)
2. Click "Send OTP"
3. Check your phone for SMS!

### **6. Test Registration Flow**
1. Go to registration page
2. Enter your details
3. Click "Send OTP"
4. Check your phone for SMS
5. Enter the OTP you received
6. Complete registration

## 🔧 **Troubleshooting**

### **"Twilio connection test failed"**
- Check your credentials in `.env` file
- Verify Account SID and Auth Token are correct
- Ensure `npm install twilio` was successful

### **"SMS not received"**
- Check phone number format (10 digits only)
- Verify Twilio phone number is correct
- Check Twilio console for delivery status
- Ensure sufficient credits in Twilio account

### **"Invalid phone number"**
- Use 10-digit format (no +91 prefix)
- Ensure number is valid and active
- For trial accounts, verify your phone number in Twilio

## 💰 **Cost Information**

### **Free Trial:**
- $15 credit included
- ~2000 SMS messages
- SMS cost: ~$0.0075 per message

### **Production:**
- SMS: $0.0075 per message
- Phone number: $1/month
- Very affordable for most apps

## 🎯 **What Happens Now**

### **Development Mode:**
- If Twilio is not configured: Shows OTP in console
- If Twilio is configured: Sends real SMS

### **Production Mode:**
- Always sends real SMS via Twilio
- Charges apply per SMS sent

## 📱 **Expected Behavior**

1. **Enter mobile number**: `9876543210`
2. **Click "Send OTP"**: SMS sent to `+919876543210`
3. **Receive SMS**: "Your Classic Cafe OTP is: 123456. Valid for 5 minutes..."
4. **Enter OTP**: `123456`
5. **Success**: User registered/logged in

---

**🎉 Once set up, you'll receive real OTPs on your mobile number!**


