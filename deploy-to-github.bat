@echo off
echo 🚀 Deploying Burger Palace to GitHub...
echo.

echo 📋 Checking git status...
git status
echo.

echo 📁 Adding all files to git...
git add .
echo.

echo 💾 Committing changes...
git commit -m "Fix Twilio OTP service and prepare for Vercel deployment"
echo.

echo 🔗 Setting up GitHub remote...
echo Please enter your GitHub username:
set /p GITHUB_USERNAME=
git remote add origin https://github.com/%GITHUB_USERNAME%/burger-palace.git
echo.

echo 🌿 Setting main branch...
git branch -M main
echo.

echo 📤 Pushing to GitHub...
git push -u origin main
echo.

echo ✅ Done! Your code is now on GitHub.
echo.
echo 🎯 Next steps:
echo 1. Go to https://vercel.com
echo 2. Import your repository
echo 3. Add environment variables in Vercel dashboard
echo 4. Deploy!
echo.
pause
