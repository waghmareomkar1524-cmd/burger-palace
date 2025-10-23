# Firebase Setup Guide for Classic Cafe

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "classic-cafe" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Realtime Database

1. In your Firebase project, go to "Build" > "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" for development
4. Select a location closest to your users
5. Click "Done"

## Step 3: Get Web App Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>) icon
4. Register your app with nickname: "classic-cafe-web"
5. Copy the configuration object

## Step 4: Update Firebase Configuration

Replace the values in `src/firebase-config.js` with your actual Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 5: Set Up Database Security Rules

In Firebase Console, go to "Realtime Database" > "Rules" and update:

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true
    },
    "queue": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Step 6: Test the Integration

1. Start your React app: `npm start`
2. Place a test order
3. Check Firebase Console > Realtime Database to see the order data
4. Verify the order appears in both "orders" and "queue" collections

## Database Structure

Your Firebase database will have this structure:

```
{
  "orders": {
    "1704110400000": {
      "orderId": "1704110400000",
      "orderNumber": "ORD12345678",
      "tableNumber": "5",
      "items": [
        {
          "name": "Classic Burger",
          "quantity": 2,
          "price": 299
        }
      ],
      "total": 350,
      "status": "pending",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "createdAt": 1704110400000
    }
  },
  "queue": {
    "1704110400000": {
      "orderNumber": "ORD12345678",
      "tableNumber": "5",
      "timestamp": 1704110400000
    }
  }
}
```

## Environment Variables (Recommended)

Create a `.env` file in your project root:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Then update `firebase-config.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## ESP32 Integration

See `ESP32_INTEGRATION.md` for complete ESP32 setup and code examples.

## Troubleshooting

- **Database connection issues**: Check your Firebase configuration
- **Permission denied**: Update Firebase security rules
- **Orders not saving**: Check browser console for errors
- **ESP32 not working**: Verify Firebase database URL and security rules

## Security Notes

- Never commit your Firebase credentials to version control
- Use environment variables for production
- Set up proper Firebase security rules for production
- Consider using Firebase Authentication for user management
