# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-03-06

### Added
- **Notification System**
  - Real-time notification dropdown in dashboard header
  - Notification context provider with polling (30s interval)
  - Mark as read functionality (individual and bulk)
  - Notification badge with unread count
  - Animated dropdown with framer-motion
  - Notification types: order updates, delivery status, system alerts
  - Database migration for notifications table
  - API endpoints: `/api/notifications`, `/api/notifications/unread-count`, `/api/notifications/{id}/read`, `/api/notifications/mark-all-read`
  - Notification seeder with sample data

- **Order Management (Seller)**
  - Accept/Decline order functionality with icon-only buttons
  - Real-time order status updates
  - Loading states during API calls
  - Order filtering: Incoming Orders (pending) and Transactions (accepted/in_transit/delivered)
  - Expanded order details with product images and delivery information
  - Google Maps integration for delivery directions
  - Refactored into multiple component files for better maintainability:
    - `Index.tsx` - Main orders page
    - `TabButton.tsx` - Tab navigation
    - `StatusBadge.tsx` - Order status display
    - `Pagination.tsx` - Pagination controls
    - `OrderActions.tsx` - Accept/Decline buttons
    - `OrderRow.tsx` - Order table row
    - `OrderDetails.tsx` - Expanded order information

- **Rider System**
  - Rider user role and middleware
  - Rider seeder with 3 sample accounts:
    - rider1@example.com (Mark Rider)
    - rider2@example.com (Sarah Delivery)
    - rider3@example.com (Mike Express)
  - Rider dashboard pages: Dashboard, Deliveries, Earnings
  - Role-based header customization (removed Stocks/Orders/Add Product buttons for riders)

- **Asset Management**
  - Centralized asset configuration in `resources/js/config/assets.ts`
  - Helper functions: `getProductImageUrl()`, `getStoreImageUrl()`, `getAvatarUrl()`, `getAssetUrl()`
  - Consistent fallback placeholders for missing images
  - Updated all components to use centralized config

- **Chat System**
  - Real-time chat between customers and sellers
  - Product attachment support in chat messages
  - Mini chat popup component
  - Chat database migrations and models
  - Seller chat controller and endpoints

### Fixed
- **Image Loading Issues**
  - Fixed 403 errors on product images
  - Renamed image files to match database expectations (hyphens vs underscores)
  - Corrected image paths from `/storage/` to `/storage/products/`
  - Added proper error handling with fallback images

- **Syntax Errors**
  - Fixed duplicate `onError` attributes in ProductCard.tsx
  - Fixed JSX syntax errors in Orders.tsx (duplicate closing tags)
  - Resolved TypeScript type errors in DashboardLayout

### Changed
- **Code Organization**
  - Separated UserSeeder and RiderSeeder into distinct files
  - Refactored large components into smaller, reusable components
  - Improved file structure for seller orders page
  - Updated DatabaseSeeder to include RiderSeeder

- **UI/UX Improvements**
  - Icon-only action buttons with tooltips for cleaner interface
  - Animated notification dropdown with smooth transitions
  - Role-based dashboard header customization
  - Improved loading states and user feedback

### Technical Details
- **Database**
  - Notifications table with user_id, type, title, message, link, data, is_read, read_at
  - Chat and messages tables for real-time messaging
  - Order status tracking: pending, accepted, in_transit, delivered, cancelled, rejected

- **API Endpoints**
  - `GET /api/notifications` - Fetch all notifications
  - `GET /api/notifications/unread-count` - Get unread count
  - `POST /api/notifications/{id}/read` - Mark notification as read
  - `POST /api/notifications/mark-all-read` - Mark all as read
  - `DELETE /api/notifications/{id}` - Delete notification
  - `POST /seller/orders/{order}/accept` - Accept order
  - `POST /seller/orders/{order}/decline` - Decline order

- **Dependencies**
  - framer-motion for animations
  - date-fns for date formatting
  - Inertia.js for SPA navigation
  - React context for state management

### Security
- CSRF token validation on all POST/DELETE requests
- Role-based middleware for rider, seller, and admin routes
- Proper authentication checks on notification endpoints

---

## Development Notes

### Running Seeders
```bash
# Seed all data
php artisan migrate:fresh --seed

# Seed specific seeder
php artisan db:seed --class=RiderSeeder
php artisan db:seed --class=NotificationSeeder
```

### Test Accounts
- **Admin**: admin@example.com / password
- **Sellers**: tech@example.com, fashion@example.com, home@example.com, pizza@example.com / password
- **Customer**: customer@example.com / password
- **Riders**: rider1@example.com, rider2@example.com, rider3@example.com / password

### Known Issues
- None at this time

### Future Enhancements
- Real-time notifications with WebSockets/Pusher
- Push notifications for mobile devices
- Notification preferences and settings
- Email notifications for important events
- Rider assignment automation
- Order tracking with live location updates
