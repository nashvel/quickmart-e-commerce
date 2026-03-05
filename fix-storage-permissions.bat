@echo off
echo ================================================
echo  QuickMart Storage Permissions Fix (Windows)
echo ================================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script requires administrator privileges.
    echo Please right-click and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [1/4] Setting permissions for storage directory...
icacls "storage" /grant Everyone:(OI)(CI)F /T >nul 2>&1
if %errorLevel% equ 0 (
    echo     SUCCESS: storage directory permissions set
) else (
    echo     WARNING: Could not set storage permissions
)

echo.
echo [2/4] Setting permissions for public/storage directory...
icacls "public\storage" /grant Everyone:(OI)(CI)F /T >nul 2>&1
if %errorLevel% equ 0 (
    echo     SUCCESS: public/storage directory permissions set
) else (
    echo     WARNING: Could not set public/storage permissions
)

echo.
echo [3/4] Setting permissions for public/images directory...
icacls "public\images" /grant Everyone:(OI)(CI)F /T >nul 2>&1
if %errorLevel% equ 0 (
    echo     SUCCESS: public/images directory permissions set
) else (
    echo     WARNING: Could not set public/images permissions
)

echo.
echo [4/4] Creating storage symlink if needed...
if not exist "public\storage" (
    php artisan storage:link
    if %errorLevel% equ 0 (
        echo     SUCCESS: Storage symlink created
    ) else (
        echo     ERROR: Failed to create storage symlink
    )
) else (
    echo     INFO: Storage symlink already exists
)

echo.
echo ================================================
echo  Storage permissions have been configured!
echo ================================================
echo.
echo You can now access product images and uploads.
echo.
pause
