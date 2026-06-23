// Razorpay Configuration
// Replace these with your actual Razorpay credentials

export const RAZORPAY_CONFIG = {
  key_id: 'rzp_test_RWZAPFKaHDzUTe',
  key_secret: '1TKmWMkiNenFqEwKNhmIrZ8Z',
  
  // App Configuration
  currency: 'INR',
  name: 'Classic Cafe',
  description: 'Food Order Payment',
  image: 'https://via.placeholder.com/150', // Replace with your restaurant logo URL
  
  // Theme Configuration
  theme: {
    color: '#F59E0B' // Orange color matching your app theme
  }
};

// Instructions for getting Razorpay credentials:
// 1. Go to https://dashboard.razorpay.com/
// 2. Sign up or log in to your account
// 3. Go to Settings > API Keys
// 4. Generate Test Key (for development) or Live Key (for production)
// 5. Copy the Key ID and Key Secret
// 6. Replace the values above with your actual credentials

// For testing, you can use Razorpay's test credentials:
// Test Key ID: rzp_test_1DP5mmOlF5G5ag
// Test Key Secret: ThisIsSecretKey (This is just an example, get your own!)

// Important Security Notes:
// - Never commit real credentials to version control
// - Use environment variables in production
// - The key_secret should only be used on the backend
// - For frontend, only use the key_id