@echo off
setlocal enabledelayedexpansion
title BLEUWI WORLD - Free Cloudflare Backend & Hosting Deployment
color 0B

echo ===============================================================================
echo                BLEUWI WORLD - 100%% FREE CLOUDFLARE HOSTING
echo         Cloudflare Pages (Static + Functions) + Cloudflare D1 (SQL Database)
echo ===============================================================================
echo.
echo  This tool will build your site and deploy it directly to Cloudflare for FREE.
echo  Free Tier includes:
echo    - Unlimited Bandwidth ^& Global CDN
echo    - 100,000 Edge Serverless Function Requests / day ($0/mo)
echo    - 5,000,000 Database Reads / day ^& 5GB Storage ($0/mo)
echo    - Free SSL ^& Free Custom Domain
echo.
echo ===============================================================================
echo.

:MENU
echo Please select an option:
echo.
echo  [1] Step 1: Login to Cloudflare (Free Account)
echo  [2] Step 2: Create Free Cloudflare D1 Database (bleuwi-db)
echo  [3] Step 3: Run Database Schema (schema.sql - Creates tables ^& default Admin)
echo  [4] Step 4: Build Website and Deploy Live to Cloudflare Pages
echo  [5] Run Local Cloudflare Edge Preview (wrangler pages dev)
echo  [6] Full 1-Click Build ^& Deploy (Options 4 in one go)
echo  [7] Exit
echo.
set /p OPT="Enter your choice (1-7): "

if "%OPT%"=="1" goto LOGIN
if "%OPT%"=="2" goto CREATEDB
if "%OPT%"=="3" goto EXECUTESCHEMA
if "%OPT%"=="4" goto BUILDANDDEPLOY
if "%OPT%"=="5" goto LOCALPREVIEW
if "%OPT%"=="6" goto BUILDANDDEPLOY
if "%OPT%"=="7" exit /b 0

echo Invalid choice. Please enter 1-7.
echo.
goto MENU

:LOGIN
echo.
echo ===============================================================================
echo [Step 1] Logging into Cloudflare CLI (Wrangler)...
echo A browser window will open. Click "Allow" to connect your free account.
echo ===============================================================================
echo.
call npx wrangler login
echo.
pause
goto MENU

:CREATEDB
echo.
echo ===============================================================================
echo [Step 2] Creating Cloudflare D1 Database: bleuwi-db...
echo ===============================================================================
echo.
call npx wrangler d1 create bleuwi-db
echo.
echo NOTE: Copy the "database_id" shown above and paste it into wrangler.toml if needed.
echo.
pause
goto MENU

:EXECUTESCHEMA
echo.
echo ===============================================================================
echo [Step 3] Applying SQL Schema and Seeding Admin User to D1...
echo ===============================================================================
echo.
call npx wrangler d1 execute bleuwi-db --remote --file=./schema.sql
echo.
echo Schema applied! Default Admin is ready:
echo Email:    admin@bleuwi.world
echo Password: Admin@123456
echo.
pause
goto MENU

:BUILDANDDEPLOY
echo.
echo ===============================================================================
echo [Step 4] Building React Production Distribution...
echo ===============================================================================
echo.
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed. Please inspect errors above.
    pause
    goto MENU
)

echo.
echo ===============================================================================
echo Deploying to Cloudflare Pages...
echo ===============================================================================
echo.
call npx wrangler pages deploy dist --project-name=bleuwi-world
echo.
echo ===============================================================================
echo   SUCCESS! Your website and backend are LIVE on Cloudflare!
echo ===============================================================================
echo.
pause
goto MENU

:LOCALPREVIEW
echo.
echo ===============================================================================
echo Starting Cloudflare Pages Local Edge Preview...
echo ===============================================================================
echo.
call npm run build
call npx wrangler pages dev dist --d1=DB=bleuwi-db
echo.
pause
goto MENU
