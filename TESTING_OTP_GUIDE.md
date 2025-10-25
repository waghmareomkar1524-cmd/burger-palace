# OTP Testing Guide

## ✅ Changes Made

I've updated the authentication service to send **real OTPs via SMS** instead of using test OTPs. Now both development and production modes will send actual SMS messages to the phone numbers.

## 🔧 What You Need to Do First

### 1. Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `classic-cafe-e1a0d`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Toggle **Enable** to **ON**
6. Click **Save**

### 2. Add Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (where you deployed the app)

### 3. Add Test Phone Numbers (Optional for Testing)

1. Go to **Authentication** → **Sign-in method** → **Phone**
2. Click "Add phone number for testing"
3. Add test numbers like:
   - `+919876543210`
   - `+919876543211`
4. Set test OTP: `123456`

## 🧪 How to Test

### Testing Registration Flow

1. **Start your development server**:
   ```bash
   npm start
   ```

2. **Open the app** in your browser

3. **Go to Registration page**

4. **Fill in the form**:
   - Name: Your name
   - Surname: Your surname
   - Mobile: Your real 10-digit mobile number
   - Password: Any password

5. **Click "Send OTP"**

6. **Check your phone** - You should receive an SMS with a 6-digit OTP

7. **Enter the OTP** you received

8. **Click "Verify OTP"**

### Testing Login Flow

1. **Go to Login page**

2. **Enter your mobile number** (same one you used for registration)

3. **Click "Send OTP"**

4. **Check your phone** - You should receive an SMS with a 6-digit OTP

5. **Enter the OTP** you received

6. **Click "Verify OTP"**

## 📱 What to Expect

### Success Flow
- ✅ OTP is sent to your phone via SMS
- ✅ You receive a 6-digit OTP
- ✅ Entering the correct OTP logs you in
- ✅ User data is stored in Firebase Database

### Error Handling
- ❌ Invalid phone number format
- ❌ Network errors
- ❌ reCAPTCHA verification failed
- ❌ Invalid OTP
- ❌ OTP expired

## 🔍 Debugging

### Check Browser Console
Open browser developer tools (F12) and look for:
- Firebase connection logs
- reCAPTCHA loading logs
- OTP sending logs
- Error messages

### Check Firebase Console
1. Go to **Authentication** → **Users**
2. Check if users are being created
3. Look for any error logs

### Common Issues

#### "reCAPTCHA container not found"
- Make sure the HTML has `<div id="recaptcha-container"></div>`
- Check if reCAPTCHA script is loading

#### "Phone authentication not configured"
- Enable Phone Authentication in Firebase Console
- Add your domain to authorized domains

#### "Invalid phone number format"
- Use 10-digit mobile numbers (without +91)
- The code automatically adds +91 prefix

## 📞 Testing with Real Numbers

### For Development Testing
- Use your own phone number
- You'll receive real SMS messages
- Each OTP is valid for a limited time

### For Production Testing
- Test with different phone numbers
- Verify OTP delivery
- Check user registration in Firebase Console

## 🚀 Production Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**

3. **Test with real users**

4. **Monitor Firebase Console** for any issues

## 📊 Monitoring

### Firebase Console
- **Authentication** → **Users**: See registered users
- **Authentication** → **Sign-in method**: Check Phone auth status
- **Realtime Database**: See user data

### Browser Console
- Look for Firebase logs
- Check for any JavaScript errors
- Monitor network requests

## 🆘 Troubleshooting

### If OTP is not received:
1. Check phone number format
2. Verify Firebase Phone Auth is enabled
3. Check authorized domains
4. Try with a different phone number

### If reCAPTCHA fails:
1. Check if reCAPTCHA script is loading
2. Verify domain is authorized
3. Try refreshing the page

### If user is not created:
1. Check Firebase Database rules
2. Verify database connection
3. Check browser console for errors

---

**Note**: Each OTP request will send a real SMS message, so use this responsibly during testing.

