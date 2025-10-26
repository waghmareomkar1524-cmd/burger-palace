# Deployment Setup Guide for Burger Palace

## Environment Variables Setup

### 1. Local Development
Your `.env` file is already configured with the correct Twilio credentials:
```
REACT_APP_TWILIO_ACCOUNT_SID=ACe76cc6f2b719f306b070627281dcb429
REACT_APP_TWILIO_AUTH_TOKEN=e3c049f72a98a2546726b603746d0fad
REACT_APP_TWILIO_FROM_NUMBER=+16206340502
```

### 2. GitHub Deployment
For deploying to platforms like Vercel, Netlify, or GitHub Pages:

1. **Copy the `.env.example` file** and rename it to `.env` in your deployment platform
2. **Set the environment variables** in your deployment platform's dashboard:
   - `REACT_APP_TWILIO_ACCOUNT_SID`
   - `REACT_APP_TWILIO_AUTH_TOKEN`
   - `REACT_APP_TWILIO_FROM_NUMBER`

### 3. Platform-Specific Instructions

#### Vercel
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the values from your `.env` file

#### Netlify
1. Go to Site settings → Environment variables
2. Add each variable with the values from your `.env` file

#### GitHub Pages (via GitHub Actions)
1. Go to your repository Settings → Secrets and variables → Actions
2. Add each variable as a repository secret
3. Update your GitHub Actions workflow to use these secrets

## Security Notes

- ✅ `.env` file is already in `.gitignore` - your credentials won't be committed
- ✅ `.env.example` file is provided for easy setup
- ✅ Environment variables are properly prefixed with `REACT_APP_`
- ✅ Error handling added for missing environment variables

## Testing

1. Start the development server: `npm start`
2. Navigate to the login/register page
3. Enter a phone number and request OTP
4. Check the browser console for Twilio configuration logs
5. The OTP should be sent via SMS

## Troubleshooting

### If OTP is not sending:
1. Check browser console for error messages
2. Verify environment variables are loaded correctly
3. Test Twilio credentials using the test function in console:
   ```javascript
   TwilioOTPService.testTwilioConnection()
   ```

### Common Issues:
- **401 Unauthorized**: Check if Twilio credentials are correct
- **Environment variables not loading**: Ensure variables start with `REACT_APP_`
- **CORS errors**: Twilio API should work from browser, but check for any CORS issues

## Files Modified

1. `src/twilio-otp-service.js` - Updated to use environment variables
2. `.env` - Contains your Twilio credentials (not committed to Git)
3. `.env.example` - Template for deployment setup
4. `.gitignore` - Already configured to ignore `.env` files

## Next Steps

1. Test the OTP functionality locally
2. Deploy to your chosen platform
3. Set environment variables in the deployment platform
4. Test OTP functionality in production
