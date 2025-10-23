# Razorpay Integration Setup Guide

## 🚀 Quick Setup

### 1. Get Razorpay Credentials

1. **Sign up for Razorpay Account**
   - Go to [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
   - Create a new account or log in

2. **Get API Keys**
   - Go to **Settings** → **API Keys**
   - Click **Generate Test Key** (for development)
   - Copy your **Key ID** and **Key Secret**

### 2. Configure Your App

1. **Open the configuration file:**
   ```
   src/razorpay-config.js
   ```

2. **Replace the placeholder values:**
   ```javascript
   export const RAZORPAY_CONFIG = {
     key_id: 'rzp_test_YOUR_ACTUAL_KEY_ID', // Replace this
     key_secret: 'YOUR_ACTUAL_KEY_SECRET', // Replace this
     // ... rest of the config
   };
   ```

### 3. Test the Integration

1. **Start your app:**
   ```bash
   npm start
   ```

2. **Test with low-value items:**
   - Add items with ₹1-2 prices (already configured)
   - Go to cart and proceed to payment
   - Use Razorpay test cards for payment

## 🧪 Test Cards

Use these test card numbers for testing:

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|---------|
| 4111 1111 1111 1111 | 123 | Any future date | Success |
| 5555 5555 5555 4444 | 123 | Any future date | Success |
| 4000 0000 0000 0002 | 123 | Any future date | Failure |

## 🔧 Configuration Options

### Customize Payment Modal
Edit `src/razorpay-config.js`:

```javascript
export const RAZORPAY_CONFIG = {
  // Basic Configuration
  key_id: 'your_key_id',
  currency: 'INR',
  name: 'Your Restaurant Name',
  description: 'Food Order Payment',
  image: 'https://your-logo-url.com/logo.png',
  
  // Theme Configuration
  theme: {
    color: '#F59E0B' // Your brand color
  }
};
```

### Prefill Customer Details
In `src/App.js`, update the prefill section:

```javascript
prefill: {
  name: 'Customer Name',
  email: 'customer@example.com',
  contact: '9999999999'
}
```

## 🚨 Important Security Notes

1. **Never commit real credentials to Git**
2. **Use environment variables in production**
3. **Key Secret should only be used on backend**
4. **For frontend, only use Key ID**

## 🔄 Production Setup

For production, you'll need:

1. **Backend API** to create orders securely
2. **Webhook handling** for payment verification
3. **Environment variables** for credentials
4. **Live Razorpay keys** (not test keys)

## 📱 Mobile Responsiveness

The Razorpay modal is fully responsive and works on:
- ✅ Desktop browsers
- ✅ Mobile browsers
- ✅ PWA (Progressive Web App)

## 🐛 Troubleshooting

### Common Issues:

1. **"Razorpay is not defined"**
   - Check if Razorpay script is loaded
   - Ensure script is loaded before using it

2. **"Invalid Key ID"**
   - Verify your Key ID is correct
   - Make sure you're using the right environment (test/live)

3. **Payment not processing**
   - Check browser console for errors
   - Verify network connectivity
   - Ensure Razorpay account is active

### Debug Mode:
Add this to see detailed logs:
```javascript
console.log('Razorpay Config:', RAZORPAY_CONFIG);
console.log('Order Data:', orderData);
```

## 📞 Support

- **Razorpay Documentation:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Support:** [https://razorpay.com/support/](https://razorpay.com/support/)
- **Test Credentials:** Available in your Razorpay dashboard

---

**Happy Coding! 🍔💳**
