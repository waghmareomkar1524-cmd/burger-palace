# 🚀 Deployment Guide - Burger Palace

Deploy your burger palace app to GitHub Pages or Vercel with these simple steps!

## 📋 Prerequisites

- GitHub account
- Node.js installed on your computer
- Git installed on your computer

---

## 🌐 Option 1: GitHub Pages (Free)

### Step 1: Prepare Your Repository

1. **Initialize Git in your project folder:**
   ```bash
   cd burger-palace
   git init
   git add .
   git commit -m "Initial commit - Burger Palace app"
   ```

2. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `burger-palace` (or any name you prefer)
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README

3. **Connect your local repository to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/burger-palace.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages

1. **Go to your repository on GitHub**
2. **Click "Settings" tab**
3. **Scroll down to "Pages" section**
4. **Under "Source", select "GitHub Actions"**
5. **The deployment will start automatically!**

### Step 3: Access Your Website

- Your website will be available at: `https://YOUR_USERNAME.github.io/burger-palace`
- It may take 5-10 minutes for the first deployment

---

## ⚡ Option 2: Vercel (Recommended - Faster)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy to Vercel

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy your app:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name: **burger-palace**
   - Directory: **./** (current directory)
   - Override settings? **No**

### Step 3: Configure Environment Variables

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add your Razorpay Key ID:**
   - Name: `REACT_APP_RAZORPAY_KEY_ID`
   - Value: Your Razorpay Key ID
   - Environment: Production, Preview, Development

### Step 4: Redeploy

```bash
vercel --prod
```

---

## 🔧 Option 3: Manual Vercel Deployment (Web Interface)

### Step 1: Push to GitHub

Follow the GitHub Pages steps 1-3 to push your code to GitHub.

### Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - Framework Preset: **Create React App**
   - Root Directory: **./**
   - Build Command: **npm run build**
   - Output Directory: **build**

### Step 3: Add Environment Variables

1. **In project settings, go to Environment Variables**
2. **Add:**
   - `REACT_APP_RAZORPAY_KEY_ID` = Your Razorpay Key ID

### Step 4: Deploy

Click "Deploy" and wait for deployment to complete!

---

## 🔐 Security Notes

### For Production Deployment:

1. **Never commit your Razorpay credentials to Git**
2. **Use environment variables for sensitive data**
3. **Update your Razorpay configuration:**

```javascript
// src/razorpay-config.js
export const RAZORPAY_CONFIG = {
  key_id: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  // ... rest of config
};
```

---

## 🎯 Quick Commands

### GitHub Pages:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Vercel:
```bash
vercel --prod
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check if all dependencies are installed: `npm install`
   - Check for any syntax errors in your code

2. **Razorpay not working:**
   - Verify your Razorpay Key ID is correct
   - Check if environment variables are set properly

3. **Page not loading:**
   - Wait 5-10 minutes for deployment to complete
   - Check the deployment logs in GitHub Actions or Vercel dashboard

### Getting Help:

- **GitHub Pages:** Check the Actions tab in your repository
- **Vercel:** Check the Functions tab in your Vercel dashboard
- **Console:** Open browser developer tools to see any errors

---

## 🎉 Success!

Once deployed, your Burger Palace app will be live and accessible to anyone on the internet!

**Your live URLs will be:**
- **GitHub Pages:** `https://YOUR_USERNAME.github.io/burger-palace`
- **Vercel:** `https://burger-palace-YOUR_USERNAME.vercel.app`

Happy coding! 🍔💳
