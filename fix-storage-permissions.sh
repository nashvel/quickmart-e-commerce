#!/bin/bash

echo "================================================"
echo " QuickMart Storage Permissions Fix (Linux/Mac)"
echo "================================================"
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "ERROR: This script requires sudo privileges."
    echo "Please run: sudo ./fix-storage-permissions.sh"
    echo ""
    exit 1
fi

echo "[1/4] Setting permissions for storage directory..."
chmod -R 755 storage
if [ $? -eq 0 ]; then
    echo "    ✓ SUCCESS: storage directory permissions set"
else
    echo "    ✗ WARNING: Could not set storage permissions"
fi

echo ""
echo "[2/4] Setting permissions for public/storage directory..."
chmod -R 755 public/storage 2>/dev/null
if [ $? -eq 0 ]; then
    echo "    ✓ SUCCESS: public/storage directory permissions set"
else
    echo "    ⚠ INFO: public/storage may not exist yet"
fi

echo ""
echo "[3/4] Setting permissions for public/images directory..."
chmod -R 755 public/images
if [ $? -eq 0 ]; then
    echo "    ✓ SUCCESS: public/images directory permissions set"
else
    echo "    ✗ WARNING: Could not set public/images permissions"
fi

echo ""
echo "[4/4] Creating storage symlink if needed..."
if [ ! -L "public/storage" ]; then
    php artisan storage:link
    if [ $? -eq 0 ]; then
        echo "    ✓ SUCCESS: Storage symlink created"
    else
        echo "    ✗ ERROR: Failed to create storage symlink"
    fi
else
    echo "    ℹ INFO: Storage symlink already exists"
fi

echo ""
echo "================================================"
echo " Storage permissions have been configured!"
echo "================================================"
echo ""
echo "You can now access product images and uploads."
echo ""
