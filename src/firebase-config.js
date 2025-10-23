// Firebase Configuration
// Replace these with your actual Firebase project credentials

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCuNLS1JnaQPTq0V81oHfqvtRZsGfDdoZ0",
    authDomain: "classic-cafe-e1a0d.firebaseapp.com",
    databaseURL: "https://classic-cafe-e1a0d-default-rtdb.firebaseio.com",
    projectId: "classic-cafe-e1a0d",
    storageBucket: "classic-cafe-e1a0d.firebasestorage.app",
    messagingSenderId: "211838609925",
    appId: "1:211838609925:web:bc02ca80b16e9fab1a8a6c",
    measurementId: "G-VWHD6HY5TB"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;

// Instructions for getting Firebase credentials:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing project
// 3. Go to Project Settings (gear icon) > General tab
// 4. Scroll down to "Your apps" section
// 5. Click "Add app" and select Web (</>) icon
// 6. Register your app with a nickname
// 7. Copy the config object and replace the values above
// 8. Enable Realtime Database in Firebase Console:
//    - Go to Build > Realtime Database
//    - Click "Create Database"
//    - Choose "Start in test mode" for development
//    - Select a location for your database
// 9. Update your .env file with the actual values (recommended for security)

// Database Structure for ESP32 Integration:
// {
//   "orders": {
//     "orderId": {
//       "orderNumber": "ORD12345678",
//       "tableNumber": "5",
//       "items": [...],
//       "total": 350,
//       "status": "pending", // pending, preparing, ready, completed
//       "timestamp": "2024-01-01T12:00:00.000Z",
//       "createdAt": 1704110400000
//     }
//   },
//   "queue": {
//     "orderId": {
//       "orderNumber": "ORD12345678",
//       "tableNumber": "5",
//       "timestamp": 1704110400000
//     }
//   }
// }
