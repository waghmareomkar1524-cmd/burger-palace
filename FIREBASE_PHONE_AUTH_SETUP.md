# Firebase Phone Authentication Setup Guide

## Prerequisites
- Firebase project created
- Phone Authentication enabled in Firebase Console
- reCAPTCHA verification configured

## Step 1: Enable Phone Authentication

### In Firebase Console:
1. Go to **Authentication** > **Sign-in method**
2. Click on **Phone** provider
3. Toggle **Enable** to ON
4. Click **Save**

## Step 2: Configure reCAPTCHA

### Add reCAPTCHA to your HTML:
Add this script to your `public/index.html` before the closing `</body>` tag:

```html
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>
```

### Update your Firebase config to include reCAPTCHA:
```javascript
// In src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export default app;
```

## Step 3: Test Phone Numbers (Development)

### For Testing:
1. Go to **Authentication** > **Sign-in method** > **Phone**
2. Add test phone numbers in the **Phone numbers for testing** section
3. Use format: `+91XXXXXXXXXX` (with country code)
4. Add test OTP: `123456`

### Test Phone Numbers Format:
```
+919876543210
+919876543211
+919876543212
```

## Step 4: Production Setup

### For Production:
1. **Remove test phone numbers**
2. **Enable App Check** (recommended)
3. **Set up proper domain verification**
4. **Configure rate limiting**

## Step 5: Domain Configuration

### Add Authorized Domains:
1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Add your production domain
3. Add `localhost` for development

### Example domains:
```
localhost
your-domain.com
www.your-domain.com
```

## Step 6: Security Rules

### Update Firebase Realtime Database Rules:
```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    },
    "orders": {
      "$userId": {
        "$orderId": {
          ".read": "auth != null && auth.uid == $userId",
          ".write": "auth != null && auth.uid == $userId"
        }
      }
    }
  }
}
```

## Step 7: Testing the Flow

### Registration Flow:
1. User enters mobile number
2. Clicks "Send OTP"
3. reCAPTCHA verification (invisible)
4. OTP sent to mobile
5. User enters OTP
6. Account created in Firebase Auth
7. User data stored in Realtime Database

### Login Flow:
1. User enters mobile number
2. System checks if user exists in database
3. If exists, sends OTP
4. User enters OTP
5. User logged in

## Step 8: Error Handling

### Common Errors:
1. **Invalid phone number format**
2. **reCAPTCHA verification failed**
3. **OTP expired**
4. **Too many attempts**

### Error Messages:
```javascript
// Handle these errors in your components
if (error.code === 'auth/invalid-phone-number') {
  // Show "Invalid phone number"
}
if (error.code === 'auth/too-many-requests') {
  // Show "Too many attempts, try later"
}
if (error.code === 'auth/code-expired') {
  // Show "OTP expired, request new one"
}
```

## Step 9: Production Checklist

### Before Going Live:
- [ ] Remove test phone numbers
- [ ] Configure production domain
- [ ] Set up proper error handling
- [ ] Test with real phone numbers
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Backup user data

## Step 10: Monitoring

### Firebase Analytics:
1. Enable Firebase Analytics
2. Monitor authentication events
3. Track conversion rates
4. Monitor error rates

### Custom Events:
```javascript
// Track OTP sent
analytics.logEvent('otp_sent', {
  phone_number: '+91XXXXXXXXXX'
});

// Track OTP verified
analytics.logEvent('otp_verified', {
  phone_number: '+91XXXXXXXXXX'
});
```

## Troubleshooting

### Common Issues:

1. **reCAPTCHA not loading:**
   - Check if scripts are loaded
   - Verify domain is authorized
   - Check browser console for errors

2. **OTP not received:**
   - Check phone number format
   - Verify Firebase project settings
   - Check SMS delivery logs

3. **User not found in database:**
   - Check if user completed registration
   - Verify database rules
   - Check user data structure

### Debug Mode:
```javascript
// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Auth Debug:', auth);
  console.log('Database Debug:', database);
}
```

## Security Best Practices

1. **Rate Limiting**: Implement client-side rate limiting
2. **Input Validation**: Validate phone numbers server-side
3. **Data Encryption**: Encrypt sensitive user data
4. **Audit Logs**: Log all authentication attempts
5. **Regular Backups**: Backup user data regularly

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Review browser console errors
3. Test with different phone numbers
4. Verify Firebase project configuration
5. Check network connectivity

---

**Note**: This setup requires a valid Firebase project with billing enabled for production use of Phone Authentication.








