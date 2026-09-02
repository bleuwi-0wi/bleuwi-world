@echo off
setlocal enabledelayedexpansion
title Bleuwi World - Local Website Host

echo ========================================================
echo               HOSTING BLEUWI WORLD WEBSITE              
echo ========================================================
echo.

:: Detect project folder
set "PROJECT_DIR="
if exist "%~dp0package.json" (
    set "PROJECT_DIR=%~dp0"
) else if exist "%~dp02026-09-01\step-1-project-foundation-use-this\package.json" (
    set "PROJECT_DIR=%~dp02026-09-01\step-1-project-foundation-use-this"
)

if "%PROJECT_DIR%"=="" (
    echo [ERROR] Could not locate the project folder with package.json!
    echo Looked in:
    echo   - %~dp0
    echo   - %~dp02026-09-01\step-1-project-foundation-use-this
    echo.
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your PATH!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing npm packages...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install encountered an error.
        pause
        exit /b 1
    )
)

echo Project directory: %CD%
echo.
echo Select an option (auto-starting Development Server in 3 seconds):
echo   [1] Start Development Server (Hot Reload + Network Host + Open Browser)
echo   [2] Build and Host Production Preview (Faster, Optimized)
echo   [3] Reinstall Dependencies (npm install)
echo.

choice /C 123 /D 1 /T 3 /M "Choice: "
set "USER_CHOICE=%errorlevel%"

if "%USER_CHOICE%"=="1" goto start_dev
if "%USER_CHOICE%"=="2" goto start_preview
if "%USER_CHOICE%"=="3" goto reinstall

:start_dev
echo.
echo [INFO] Starting Development Server with --host --open...
echo [INFO] Accessible locally and across your Wi-Fi network!
echo [INFO] Press Ctrl+C anytime in this window to stop hosting.
echo ========================================================
echo.
call npm run dev -- --host --open
goto end

:start_preview
echo.
echo [INFO] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo.
echo [INFO] Starting Production Preview Server with --host --open...
echo [INFO] Accessible locally and across your Wi-Fi network!
echo [INFO] Press Ctrl+C anytime in this window to stop hosting.
echo ========================================================
echo.
call npm run preview -- --host --open
goto end

:reinstall
echo.
echo [INFO] Running npm install...
call npm install
echo.
echo [INFO] Dependencies installed! Starting Dev Server...
goto start_dev

:end
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Server stopped.
    pause
)
