#!/bin/bash

echo "🚀 QuickMart E-Commerce Setup"
echo "=============================="
echo ""

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Create database
echo "📦 Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS quickmart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "⚠️  Database might already exist or check your MySQL credentials"
fi

# Run migrations
echo ""
echo "🗄️  Running migrations..."
php artisan migrate --force

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed. Please check your database configuration in .env"
    exit 1
fi

# Create storage link
echo ""
echo "🔗 Creating storage link..."
php artisan storage:link

# Build frontend
echo ""
echo "🎨 Building frontend assets..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo "  php artisan serve"
echo ""
echo "Then visit: http://localhost:8000"
echo ""
