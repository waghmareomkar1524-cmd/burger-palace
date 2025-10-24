# Firebase Security Rules for Classic Cafe

## Database Security Rules

Update your Firebase Realtime Database rules in the Firebase Console:

### Go to Firebase Console:
1. Navigate to your project: `classic-cafe-e1a0d`
2. Go to **Build** > **Realtime Database**
3. Click on **Rules** tab
4. Replace the existing rules with the following:

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
    },
    "queue": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Authentication Setup

### Enable Email/Password Authentication:
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Save the changes

### Optional: Enable Phone Authentication:
1. In **Authentication** > **Sign-in method**
2. Enable **Phone** provider
3. Add your domain to authorized domains

## Database Structure

Your Firebase database will have this structure:

```
{
  "users": {
    "userId": {
      "name": "John",
      "surname": "Doe", 
      "mobile": "9876543210",
      "email": "9876543210@classiccafe.com",
      "createdAt": 1704110400000,
      "lastLogin": 1704110400000
    }
  },
  "orders": {
    "userId": {
      "orderId": {
        "orderNumber": "ORD12345678",
        "tableNumber": "5",
        "items": [...],
        "total": 350,
        "status": "pending",
        "createdAt": 1704110400000
      }
    }
  },
  "queue": {
    "orderId": {
      "orderNumber": "ORD12345678",
      "tableNumber": "5",
      "timestamp": 1704110400000
    }
  }
}
```

## Security Features

### User Data Protection:
- Users can only read/write their own data
- Each user's data is isolated by their UID
- No cross-user data access

### Order Management:
- Users can only access their own orders
- Queue data is accessible to authenticated users
- Order status updates are secure

### Authentication Requirements:
- All database operations require authentication
- User must be logged in to access any data
- Mobile number is used as email for Firebase Auth

## Testing the Rules

### Test User Access:
1. Register a new user
2. Try to access another user's data (should fail)
3. Verify you can only access your own data

### Test Order Creation:
1. Create an order while logged in
2. Verify it appears in your order history
3. Check that it's added to the queue

## Production Considerations

### For Production Deployment:
1. **Update Security Rules**: Make them more restrictive if needed
2. **Enable App Check**: Add additional security layer
3. **Monitor Usage**: Set up Firebase Analytics
4. **Backup Data**: Enable automatic backups

### Environment Variables:
Create a `.env` file for production:

```env
REACT_APP_FIREBASE_API_KEY=your-production-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Troubleshooting

### Common Issues:
1. **Permission Denied**: Check if user is authenticated
2. **Rules Not Applied**: Wait a few minutes for rules to propagate
3. **Data Not Saving**: Verify Firebase configuration
4. **Login Issues**: Check if Email/Password auth is enabled

### Debug Mode:
For development, you can temporarily use these rules (NOT for production):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**⚠️ WARNING**: Never use these rules in production as they allow anyone to read/write all data.





