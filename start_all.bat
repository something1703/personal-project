@echo off
title Survey Tracking - Start All Services

echo ========================================
echo Starting Survey Tracking System
echo ========================================
echo.

REM Check if XAMPP is installed
if not exist "C:\xampp\xampp-control.exe" (
    echo ERROR: XAMPP not found!
    echo Please run setup_php_nextjs.bat first
    pause
    exit /b 1
)

echo [1/3] Starting XAMPP Services...
start "" "C:\xampp\xampp-control.exe"
echo ✓ XAMPP Control Panel opened
echo   Please start Apache and MySQL manually
echo.
timeout /t 3 >nul

echo [2/3] Waiting for services to start...
timeout /t 5 >nul

echo [3/3] Starting Next.js Frontend...
echo.
echo Opening new terminal for Next.js...
start cmd /k "cd /d %~dp0frontend && echo Starting Next.js Frontend... && npm run dev"

echo.
echo ========================================
echo Services Starting...
echo ========================================
echo.
echo XAMPP Control Panel: Opened
echo   → Make sure Apache and MySQL are running (green)
echo.
echo Next.js Frontend: Starting in new window
echo   → Wait for "Ready" message
echo   → Then visit: http://localhost:3000
echo.
echo Backend API: http://localhost/survey_tracking/php/api
echo Test Backend: http://localhost/survey_tracking/php/test.php
echo.
echo Default Login:
echo   Username: admin
echo   Password: admin123
echo.
echo Press any key to open browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo Browser opened!
echo.
pause
