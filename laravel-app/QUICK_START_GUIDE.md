# Quick Start Guide 🚀

Get the Ecomxpert platform up and running in 5 minutes!

## Prerequisites Check ✓

Before starting, ensure you have:
- [ ] PHP 8.2+ installed (`php -v`)
- [ ] Composer installed (`composer -V`)
- [ ] Node.js 18+ installed (`node -v`)
- [ ] MySQL 8.0+ installed and running
- [ ] Git installed

## Installation Steps

### 1. Clone & Navigate (30 seconds)
```bash
git clone <repository-url>
cd laravel-app
```

### 2. Install Dependencies (2 minutes)
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 3. Environment Setup (1 minute)
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database (1 minute)
Edit `.env` file:
```env
DB_DATABASE=ecomxpert
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create database:
```bash
mysql -u root -p
CREATE DATABASE ecomxpert;
exit;
```

### 5. Setup Database (1 minute)
```bash
# Run migrations and seeders
php artisan migrate:fresh --seed
```

This creates:
- 6 test users
- 72 categories
- 11 stores
- 51 products
- 14 add-ons

### 6. Start Development Servers (30 seconds)

**Terminal 1** - Laravel:
```bash
php artisan serve
```

**Terminal 2** - Vite (for hot reload):
```bash
npm run dev
```

### 7. Access Application
Open browser: http://localhost:8000

## Test Accounts 👤

### Customer Account
```
Email: customer@example.com
Password: password
```

### Store Owner Account
```
Email: tech@example.com
Password: password
```

### Admin Account
```
Email: admin@example.com
Password: password
```

## Quick Test Workflow 🧪

1. **Browse Products**
   - Visit home page
   - Click on products
   - Use search and filters

2. **Test Cart**
   - Login as customer
   - Add products to cart
   - Update quantities
   - Remove items

3. **Place Order**
   - Go to cart
   - Click checkout
   - Add delivery address
   - Place order

4. **View Orders**
   - Go to orders page
   - View order details
   - Cancel pending order

## Common Commands 📝

### Development
```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (hot reload)
npm run dev

# Watch for file changes
npm run dev
```

### Database
```bash
# Run migrations
php artisan migrate

# Fresh migration with seeders
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=ProductSeeder

# Rollback migration
php artisan migrate:rollback
```

### Cache
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Code Generation
```bash
# Create controller
php artisan make:controller YourController

# Create model with migration
php artisan make:model YourModel -m

# Create seeder
php artisan make:seeder YourSeeder

# Create request validation
php artisan make:request YourRequest
```

## Project Structure 📁

```
laravel-app/
├── app/
│   ├── Http/Controllers/    # Controllers
│   ├── Models/              # Eloquent models
│   └── Http/Requests/       # Form validation
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── resources/
│   └── js/
│       ├── Pages/           # Inertia pages (38 pages)
│       ├── Components/      # React components
│       └── Layouts/         # Layout components
├── routes/
│   └── web.php              # Web routes
└── public/                  # Public assets
```

## Key Features to Test 🎯

### Customer Features
- [x] Browse products and stores
- [x] Search and filter
- [x] View product details
- [x] Add to cart
- [x] Manage cart
- [x] Place orders
- [x] View order history
- [x] Manage addresses

### Store Owner Features
- [x] View dashboard
- [x] Manage products
- [x] View orders
- [x] Manage store

### Admin Features
- [x] View dashboard
- [x] Manage users
- [x] Manage stores
- [x] Manage products
- [x] View orders

## Troubleshooting 🔧

### Issue: "Class not found"
```bash
composer dump-autoload
```

### Issue: Frontend not updating
```bash
npm run build
php artisan view:clear
```

### Issue: Database connection error
1. Check `.env` database credentials
2. Ensure MySQL is running
3. Verify database exists

### Issue: Permission errors
```bash
chmod -R 775 storage bootstrap/cache
```

### Issue: Port already in use
```bash
# Use different port
php artisan serve --port=8001
```

## Development Tips 💡

### Hot Reload
Keep `npm run dev` running for instant updates when editing:
- React components
- TypeScript files
- CSS files

### Database Changes
After modifying migrations:
```bash
php artisan migrate:fresh --seed
```

### Code Style
- PHP: Follow PSR-12
- TypeScript: Use ESLint
- Format: Use Prettier

### Debugging
- Check Laravel logs: `storage/logs/laravel.log`
- Use `dd()` for debugging in PHP
- Use `console.log()` for debugging in TypeScript
- Check browser console for frontend errors

## Next Steps 📚

1. **Explore the Code**
   - Check `app/Http/Controllers/` for API logic
   - Check `resources/js/Pages/` for frontend pages
   - Check `database/seeders/` for sample data

2. **Read Documentation**
   - `README.md` - Full documentation
   - `BACKEND_MIGRATION_COMPLETE.md` - Backend details
   - `PROJECT_STATUS_FINAL.md` - Project overview

3. **Start Development**
   - Add new features
   - Customize UI
   - Extend functionality

## Useful Links 🔗

- [Laravel Docs](https://laravel.com/docs)
- [Inertia.js Docs](https://inertiajs.com)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Support 💬

Need help?
1. Check documentation files
2. Review code comments
3. Test with provided accounts
4. Check external documentation

---

**Ready to start?** Run the commands above and you'll be up and running in 5 minutes! 🚀

**Status**: Production Ready ✅
