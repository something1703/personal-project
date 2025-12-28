@echo off
title Survey Tracking - Stop All Services

echo ========================================
echo Stopping Survey Tracking System
echo ========================================
echo.

echo [1/2] Stopping Apache...
"C:\xampp\apache\bin\httpd.exe" -k stop >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Apache stopped
) else (
    echo ⚠ Apache may not be running
)

echo.
echo [2/2] Stopping MySQL...
"C:\xampp\mysql\bin\mysqladmin.exe" -u root shutdown >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ MySQL stopped
) else (
    echo ⚠ MySQL may not be running
)

echo.
echo ========================================
echo Services Stopped
echo ========================================
echo.
echo Note: Next.js frontend must be stopped manually
echo       Press Ctrl+C in the Next.js terminal window
echo.
pause
