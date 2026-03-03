# Deployment Checklist 🚀

Use this checklist to deploy the application to production.

---

## ✅ Pre-Deployment Verification

### 1. Code Verification
- [x] All migrations created
- [x] All seeders working
- [x] All controllers implemented
- [x] All models created
- [x] All routes configured
- [x] All frontend pages created
- [x] No syntax errors
- [x] No TypeScript errors

### 2. Database Verification
- [x] Database schema finalized
- [x] All relationships working
- [x] Foreign keys configured
- [x] Indexes added
- [x] Seeders tested
- [x] Sample data available

### 3. Testing Verification
- [x] User registration works
- [x] User login works
- [x] Product browsing works
- [x] Cart functionality works
- [x] Checkout works
- [x] Order placement works
- [x] Address management works

---

## 🔧 Local Setup (Development)

### Prerequisites
- [ ] PHP 8.2+ installed
- [ ] Composer installed
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed
- [ ] Git installed

### Installation Steps
```bash
# 1. Clone repository
git clone <repository-url>
cd laravel-app

# 2. Install dependencies
composer install
npm install

# 3. Environment setup
cp .env.example .env
php artisan key:generate

# 4. Configure database in .env
# DB_DATABASE=ecomxpert
# DB_USERNAME=root
# DB_PASSWORD=your_password

# 5. Run migrations and seeders
php artisan migrate:fresh --seed

# 6. Build frontend
npm run dev

# 7. Start server
php artisan serve
```

---

## 🌐 Production Deployment

### 1. Server Requirements
- [ ] PHP 8.2 or higher
- [ ] MySQL 8.0 or higher
- [ ] Nginx or Apache
- [ ] SSL certificate
- [ ] Composer
- [ ] Node.js (for building assets)
- [ ] Git

### 2. Server Setup

#### Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip -y

# Install MySQL
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

### 3. Application Deployment

#### Clone and Setup
```bash
# Clone repository
cd /var/www
sudo git clone <repository-url> ecomxpert
cd ecomxpert/laravel-app

# Set permissions
sudo chown -R www-data:www-data /var/www/ecomxpert
sudo chmod -R 755 /var/www/ecomxpert

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install
```

#### Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Edit .env file
nano .env
```

#### Production .env Configuration
```env
APP_NAME=Ecomxpert
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecomxpert_prod
DB_USERNAME=ecomxpert_user
DB_PASSWORD=secure_password_here

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

#### Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE ecomxpert_prod;
CREATE USER 'ecomxpert_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON ecomxpert_prod.* TO 'ecomxpert_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
php artisan migrate --force

# Run seeders (optional for production)
php artisan db:seed --force
```

#### Build Frontend Assets
```bash
# Build for production
npm run build

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Web Server Configuration

#### Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/ecomxpert
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/ecomxpert/laravel-app/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ecomxpert /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

### 6. File Permissions
```bash
cd /var/www/ecomxpert/laravel-app

# Set ownership
sudo chown -R www-data:www-data storage bootstrap/cache

# Set permissions
sudo chmod -R 775 storage bootstrap/cache
```

### 7. Queue Workers (Optional)
```bash
# Create supervisor config
sudo nano /etc/supervisor/conf.d/ecomxpert-worker.conf
```

```ini
[program:ecomxpert-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/ecomxpert/laravel-app/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/ecomxpert/laravel-app/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Update supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start ecomxpert-worker:*
```

### 8. Cron Jobs (Optional)
```bash
# Edit crontab
sudo crontab -e -u www-data
```

Add:
```
* * * * * cd /var/www/ecomxpert/laravel-app && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔒 Security Checklist

### Application Security
- [ ] APP_DEBUG=false in production
- [ ] Strong APP_KEY generated
- [ ] Database credentials secure
- [ ] HTTPS enabled (SSL certificate)
- [ ] CSRF protection enabled
- [ ] XSS protection enabled
- [ ] SQL injection prevention
- [ ] File upload validation
- [ ] Rate limiting configured

### Server Security
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication
- [ ] Disable root login
- [ ] Regular security updates
- [ ] Fail2ban installed
- [ ] Database access restricted
- [ ] File permissions correct

### Firewall Setup
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

---

## 📊 Monitoring & Maintenance

### Log Files
```bash
# Application logs
tail -f /var/www/ecomxpert/laravel-app/storage/logs/laravel.log

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# PHP-FPM logs
tail -f /var/log/php8.2-fpm.log
```

### Regular Maintenance
```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Update dependencies
composer update
npm update
```

### Backup Strategy
```bash
# Database backup
mysqldump -u ecomxpert_user -p ecomxpert_prod > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf ecomxpert_backup_$(date +%Y%m%d).tar.gz /var/www/ecomxpert
```

---

## 🧪 Post-Deployment Testing

### Smoke Tests
- [ ] Homepage loads
- [ ] User can register
- [ ] User can login
- [ ] Products display correctly
- [ ] Cart works
- [ ] Checkout works
- [ ] Orders can be placed
- [ ] Admin panel accessible
- [ ] SSL certificate valid
- [ ] All assets loading (CSS, JS, images)

### Performance Tests
- [ ] Page load time < 2 seconds
- [ ] Database queries optimized
- [ ] No N+1 query issues
- [ ] Images optimized
- [ ] Caching working

---

## 🚨 Rollback Plan

If deployment fails:

```bash
# 1. Restore database backup
mysql -u ecomxpert_user -p ecomxpert_prod < backup_YYYYMMDD.sql

# 2. Restore application files
tar -xzf ecomxpert_backup_YYYYMMDD.tar.gz -C /

# 3. Clear caches
php artisan cache:clear
php artisan config:clear

# 4. Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm
```

---

## 📞 Support Contacts

### Technical Support
- **Documentation**: Check README.md and other docs
- **Logs**: Check application and server logs
- **Community**: Laravel, Inertia.js communities

### Emergency Contacts
- **Server Admin**: [contact info]
- **Database Admin**: [contact info]
- **Developer**: [contact info]

---

## ✅ Final Checklist

Before going live:
- [ ] All tests passing
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Email service configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rollback plan tested
- [ ] Team notified
- [ ] Documentation updated

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Status**: _______________

🎉 **Ready for Production!**
