# Firebase Database Setup Guide

## 🚨 **CRITICAL: Update Firebase Database Rules**

### **Step 1: Go to Firebase Console**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `classic-cafe-e1a0d`
3. Go to **Realtime Database** → **Rules**

### **Step 2: Replace Database Rules**
Replace the existing rules with this:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    },
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

### **Step 3: Click "Publish"**

## 🔧 **Database Structure**

After registration, your database should look like this:

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
    orders/
      (orders will be saved here)
```

## 🧪 **Testing Steps**

### **1. Test Registration:**
1. Go to Register page
2. Fill all fields:
   - Name: "John"
   - Surname: "Doe" 
   - Mobile: "9876543210"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Send OTP"
4. Use OTP: `123456`
5. Click "Verify OTP"
6. **Check Firebase Console** → Database → Data
7. You should see user data under `users/dev_xxxxx/`

### **2. Test Login:**
1. Go to Login page
2. Enter mobile: "9876543210"
3. Click "Send OTP"
4. Use OTP: `123456`
5. Click "Verify OTP"
6. Should login successfully

### **3. Test Order Placement:**
1. After login, add items to cart
2. Enter table number
3. Click "Pay with Razorpay"
4. **Check Firebase Console** → Database → Data
5. You should see order under `users/dev_xxxxx/orders/`

## 🐛 **Troubleshooting**

### **If data is not saving:**
1. Check Firebase Console → Database → Rules
2. Make sure rules allow read/write access
3. Check browser console for errors
4. Verify Firebase project is active

### **If registration fails:**
1. Check browser console for error messages
2. Verify Firebase configuration
3. Make sure database rules are updated

### **If login fails:**
1. Make sure you registered first
2. Check if user exists in Firebase Database
3. Use the same mobile number for login

## 📊 **Expected Database Structure**

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
    orders/
      1704110400000/
        orderNumber: "ORD1704110400000"
        tableNumber: "5"
        items: [...]
        total: 350
        status: "pending"
        createdAt: 1704110400000
```

## ✅ **Verification Checklist**

- [ ] Database rules updated and published
- [ ] Registration saves user data to Firebase
- [ ] Login works with registered user
- [ ] Orders are saved under user's orders
- [ ] My Account shows profile and orders
- [ ] No console errors

---

**If you still have issues, check:**
1. Firebase Console → Database → Data (should show user data)
2. Browser Console → Network tab (check for failed requests)
3. Firebase Console → Authentication → Users (should show registered users)

