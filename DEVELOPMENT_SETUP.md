# Development Setup Guide

## Quick Start (Development Mode)

The app now includes a **development mode** that bypasses Firebase Phone Authentication setup for easy testing.

### 🚀 How to Test:

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Test Registration:**
   - Go to Register page
   - Fill in all fields (Name, Surname, Mobile, Password, Confirm Password)
   - Click "Send OTP"
   - **Use OTP: `123456`** (shown in console)
   - Click "Verify OTP"
   - Account created successfully!

3. **Test Login:**
   - Go to Login page
   - Enter the mobile number you registered with
   - Click "Send OTP"
   - **Use OTP: `123456`** (shown in console)
   - Click "Verify OTP"
   - Login successful!

### 🔧 Development Features:

- **Test OTP**: Always use `123456` for OTP verification
- **No Firebase Phone Auth Required**: Works without Firebase Phone Authentication setup
- **Real Database Storage**: User data is still stored in Firebase Realtime Database
- **Console Logging**: Check browser console for development messages

### 📱 Test Flow:

#### Registration:
1. Fill form → "Send OTP" → Use `123456` → Account created
2. User data stored in Firebase Database
3. Redirected to Home page

#### Login:
1. Enter mobile number → "Send OTP" → Use `123456` → Login successful
2. System checks if user exists in database
3. Redirected to Home page

### 🛠️ Production Setup:

When ready for production:

1. **Enable Firebase Phone Authentication** (see `FIREBASE_PHONE_AUTH_SETUP.md`)
2. **Remove development mode** by setting `NODE_ENV=production`
3. **Configure reCAPTCHA** properly
4. **Test with real phone numbers**

### 🐛 Troubleshooting:

#### If you see "appVerificationDisabledForTesting" error:
- This is normal in development mode
- The app will automatically use test OTP `123456`
- Check console for "Development mode: Using test OTP"

#### If registration fails:
- Check if Firebase Realtime Database is configured
- Verify Firebase config in `src/firebase-config.js`
- Check browser console for errors

#### If login fails:
- Make sure you registered the user first
- Check if user exists in Firebase Database
- Verify mobile number format (10 digits)

### 📊 Database Structure:

Your Firebase Database will have:
```
users/
  dev_1234567890/
    name: "John"
    surname: "Doe"
    mobile: "9876543210"
    phoneNumber: "+919876543210"
    createdAt: 1704110400000
    lastLogin: 1704110400000
    verified: true
```

### 🎯 Testing Checklist:

- [ ] Registration with test OTP works
- [ ] Login with test OTP works
- [ ] User data stored in Firebase
- [ ] Home page shows user profile
- [ ] Logout works correctly
- [ ] Error handling works for invalid OTP

### 🚀 Ready for Production?

When you're ready to deploy:

1. **Set up Firebase Phone Authentication** (see `FIREBASE_PHONE_AUTH_SETUP.md`)
2. **Configure production environment**
3. **Test with real phone numbers**
4. **Deploy to your hosting platform**

---

**Note**: Development mode is automatically enabled when `NODE_ENV=development`. For production, set `NODE_ENV=production` and configure Firebase Phone Authentication properly.





