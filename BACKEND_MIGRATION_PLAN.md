# Backend Migration Plan: CodeIgniter to Laravel

## Overview
Converting the entire CodeIgniter backend to Laravel and replacing hardcoded data with real database data.

---

## Phase 1: Database & Models (Priority: HIGH)
### 1.1 Database Migrations ✅ (Already exists)
- Users, Roles, Stores, Products, Categories, Orders, etc.

### 1.2 Models to Create/Update
- [x] User Model (exists)
- [x] Store Model (exists)
- [x] Product Model (exists)
- [x] Category Model (exists)
- [ ] Order Model
- [ ] OrderItem Model
- [ ] Cart Model
- [ ] CartItem Model
- [ ] Address Model
- [ ] Review Model
- [ ] Promotion Model
- [ ] Setting Model
- [ ] Notification Model
- [ ] Achievement Model
- [ ] RiderStoreAssignment Model

### 1.3 Seeders to Convert
- [x] UserSeeder - Created (6 users: admin, clients, customer)
- [x] CategorySeeder - Created (72 categories)
- [x] StoreSeeder - Created (11 stores)
- [x] ProductSeeder - Created (51 products)
- [x] AddOnSeeder - Created (14 add-ons with variants)
- [x] SettingSeeder - Created (8 settings)

**Status**: ✅ Phase 1 Database Seeders Complete!

---

## Phase 2: API Controllers (Priority: HIGH)
### 2.1 Public APIs
- [x] HomeController - Get featured products, categories, stores ✅
- [x] ProductController - List, show, search, filter ✅
- [x] StoreController - List, show, filter by type ✅
- [ ] CategoryController - List with hierarchy (optional)
- [ ] PromotionController - Active promotions (optional)

### 2.2 Auth APIs
- [x] AuthController - Login, Register, Logout, Refresh ✅
- [ ] EmailVerificationController (optional)
- [ ] PasswordResetController (optional)

### 2.3 Customer APIs
- [x] CartController - Add, update, remove, clear ✅
- [x] OrderController - Create, list, show, cancel, track ✅
- [x] AddressController - CRUD operations ✅
- [ ] ProfileController - Update profile, change password (optional)
- [ ] ReviewController - Create, list reviews (optional)

**Status**: ✅ Phase 2 Core APIs - 100% Complete!

### 2.2 Auth APIs
- [ ] AuthController - Login, Register, Logout, Refresh
- [ ] EmailVerificationController
- [ ] PasswordResetController

### 2.3 Customer APIs
- [ ] CartController - Add, update, remove, clear
- [ ] OrderController - Create, list, show, cancel, track
- [ ] AddressController - CRUD operations
- [ ] ProfileController - Update profile, change password
- [ ] ReviewController - Create, list reviews

### 2.4 Seller APIs
- [ ] Seller/ProductController - CRUD for products
- [ ] Seller/OrderController - List, update status
- [ ] Seller/StoreController - Update store info
- [ ] Seller/ReviewController - View reviews
- [ ] Seller/DashboardController - Statistics

### 2.5 Admin APIs
- [ ] Admin/UserController - CRUD users
- [ ] Admin/StoreController - Approve/reject stores
- [ ] Admin/ProductController - Approve/reject products
- [ ] Admin/OrderController - View all orders
- [ ] Admin/PromotionController - CRUD promotions
- [ ] Admin/SettingController - Update settings
- [ ] Admin/DashboardController - Statistics

### 2.6 Rider APIs
- [ ] Rider/OrderController - Accept, complete deliveries
- [ ] Rider/DashboardController - Earnings, statistics

---

## Phase 3: Frontend Integration (Priority: MEDIUM)
### 3.1 Update Inertia Controllers
- [x] Convert API responses to Inertia responses ✅
- [x] Pass real data instead of mock data ✅

### 3.2 Update Frontend Pages
- [x] Welcome.tsx - Use real featured products, categories, stores ✅
- [x] Products/Index.tsx - Use real products with filters ✅
- [x] Products/Show.tsx - Use real product details ✅
- [x] Stores/Index.tsx - Use real stores ✅
- [x] Stores/Show.tsx - Use real store products ✅
- [x] Restaurants/Index.tsx - Use real restaurants ✅
- [x] Cart - Use real cart data ✅
- [x] Checkout - Use real checkout flow ✅
- [x] Orders - Use real order data ✅
- [x] Profile - Use real user data ✅

**Status**: ✅ Phase 3 Frontend Integration - 100% Complete!

### 3.3 Seller Pages
- [ ] Dashboard - Real statistics
- [ ] Products/Manage - Real products
- [ ] Products/Add - Real form submission
- [ ] Orders - Real orders
- [ ] Reviews - Real reviews
- [ ] Chat - Real messages
- [ ] ManageStore - Real store data

### 3.4 Admin Pages
- [ ] Dashboard - Real statistics
- [ ] Users - Real users
- [ ] Stores - Real stores
- [ ] Products - Real products
- [ ] Orders - Real orders
- [ ] Promotions - Real promotions
- [ ] Settings - Real settings

### 3.5 Rider Pages
- [ ] Dashboard - Real statistics
- [ ] Deliveries - Real deliveries
- [ ] Earnings - Real earnings

---

## Phase 4: File Uploads & Storage (Priority: MEDIUM)
- [ ] Product images
- [ ] Store logos
- [ ] User avatars
- [ ] Category images
- [ ] Promotion banners

---

## Phase 5: Real-time Features (Priority: LOW)
- [ ] Chat system (Laravel Echo + Pusher/Socket.io)
- [ ] Order tracking (real-time updates)
- [ ] Notifications (real-time)

---

## Phase 6: Payment Integration (Priority: LOW)
- [ ] Payment gateway integration
- [ ] Order payment processing
- [ ] Rider earnings calculation

---

## Phase 7: Testing & Optimization (Priority: MEDIUM)
- [ ] API tests
- [ ] Feature tests
- [ ] Performance optimization
- [ ] Security audit

---

## Immediate Next Steps (Start Here)

### Step 1: Convert Seeders (1-2 hours)
1. CategorySeeder
2. StoreSeeder  
3. ProductSeeder
4. SettingSeeder

### Step 2: Create Missing Models (1 hour)
1. Order, OrderItem
2. Cart, CartItem
3. Address
4. Review
5. Promotion
6. Setting

### Step 3: Create Home API (2 hours)
1. HomeController with real data
2. Update Welcome.tsx to use real data

### Step 4: Create Product APIs (3 hours)
1. ProductController (list, show, search, filter)
2. Update Products pages to use real data

---

## Estimated Timeline
- **Phase 1**: 1-2 days
- **Phase 2**: 1-2 weeks
- **Phase 3**: 1-2 weeks
- **Phase 4**: 2-3 days
- **Phase 5**: 1 week
- **Phase 6**: 3-5 days
- **Phase 7**: 3-5 days

**Total**: 4-6 weeks for complete migration

---

## Current Status
- Frontend: 100% complete (38/38 pages)
- Backend: 10% complete (basic structure only)
- Integration: 0% complete (all hardcoded data)

---

## Priority Order
1. ✅ Database migrations (done)
2. 🔄 Seeders (in progress)
3. ⏳ Models
4. ⏳ Home API + Integration
5. ⏳ Product APIs + Integration
6. ⏳ Auth APIs
7. ⏳ Cart & Checkout
8. ⏳ Orders
9. ⏳ Seller features
10. ⏳ Admin features
11. ⏳ Rider features
