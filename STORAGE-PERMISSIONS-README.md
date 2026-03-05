# Storage Permissions Fix

This directory contains scripts to fix storage and image permissions for the QuickMart application.

## Problem

Product images and uploaded files may not be accessible due to incorrect file permissions or missing storage symlinks.

## Solution

Run the appropriate script for your operating system:

### Windows

1. Right-click on `fix-storage-permissions.bat`
2. Select "Run as administrator"
3. Wait for the script to complete

**OR** from Command Prompt (as Administrator):
```cmd
fix-storage-permissions.bat
```

### Linux / macOS

```bash
sudo ./fix-storage-permissions.sh
```

## What These Scripts Do

1. **Set storage directory permissions** - Makes the `storage/` directory readable and writable
2. **Set public/storage permissions** - Ensures uploaded files are accessible via web
3. **Set public/images permissions** - Makes app badges and product images accessible
4. **Create storage symlink** - Links `public/storage` to `storage/app/public` if not exists

## Manual Alternative

If you prefer to run commands manually:

### Linux/Mac:
```bash
chmod -R 755 storage
chmod -R 755 public/storage
chmod -R 755 public/images
php artisan storage:link
```

### Windows (Command Prompt as Admin):
```cmd
icacls storage /grant Everyone:(OI)(CI)F /T
icacls public\storage /grant Everyone:(OI)(CI)F /T
icacls public\images /grant Everyone:(OI)(CI)F /T
php artisan storage:link
```

## Troubleshooting

**Images still not loading?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that files exist in `storage/app/public/products/`
- Verify `public/storage` symlink exists
- Check web server configuration (Apache/Nginx)

**Permission denied errors?**
- Make sure you're running the script with administrator/sudo privileges
- On Linux, ensure your user owns the files: `sudo chown -R $USER:$USER storage public`

## App Store Badges

The scripts also ensure the following badges are accessible:
- Google Play Badge: `public/images/google-play-badge.png`
- App Store Badge: `public/images/app-store-badge.svg`

These are used in the "Get Our App" section of the homepage.
