-- phpMyAdmin SQL Dump
-- version 5.2.3deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 03, 2026 at 01:34 PM
-- Server version: 11.8.5-MariaDB-4 from Debian
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quickmart`
--

-- --------------------------------------------------------

--
-- Table structure for table `addons`
--

CREATE TABLE `addons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addons`
--

INSERT INTO `addons` (`id`, `store_id`, `category_id`, `name`, `price`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 'Coca Cola', 45.00, 'coca-cola.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(2, 4, 1, 'Pepsi', 45.00, 'pepsi.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(3, 4, 1, 'Orange Juice', 65.00, 'orange-juice.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(4, 4, 1, 'Iced Tea', 40.00, 'iced-tea.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(5, 4, 2, 'Garlic Bread', 85.00, 'garlic-bread.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(6, 4, 2, 'Buffalo Wings', 180.00, 'buffalo-wings.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(7, 4, 2, 'Mozzarella Sticks', 140.00, 'mozzarella-sticks.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(8, 4, 2, 'Caesar Salad', 120.00, 'caesar-salad.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(9, 4, 3, 'Chocolate Brownie', 95.00, 'chocolate-brownie.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(10, 4, 3, 'Tiramisu', 110.00, 'tiramisu.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(11, 4, 3, 'Cheesecake', 95.00, 'cheesecake.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(12, 4, 4, 'Extra Cheese', 35.00, 'extra-cheese.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(13, 4, 4, 'Pepperoni', 45.00, 'pepperoni.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(14, 4, 4, 'Mushrooms', 30.00, 'mushrooms.jpg', 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `addon_categories`
--

CREATE TABLE `addon_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addon_categories`
--

INSERT INTO `addon_categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Beverages', 'Refreshing drinks to complement your meal', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(2, 'Sides', 'Delicious sides to complete your order', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(3, 'Desserts', 'Sweet treats to end your meal', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(4, 'Extras', 'Additional toppings and extras', '2026-03-02 23:41:09', '2026-03-02 23:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `addon_variants`
--

CREATE TABLE `addon_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `addon_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addon_variants`
--

INSERT INTO `addon_variants` (`id`, `addon_id`, `name`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 'Small (12oz)', 45.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(2, 1, 'Medium (16oz)', 50.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(3, 1, 'Large (20oz)', 60.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(4, 2, 'Small (12oz)', 45.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(5, 2, 'Medium (16oz)', 50.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(6, 2, 'Large (20oz)', 60.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(7, 3, 'Regular (12oz)', 65.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(8, 3, 'Large (16oz)', 75.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(9, 4, 'Regular (16oz)', 40.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(10, 4, 'Sweet Tea', 45.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(11, 6, '6 pieces', 180.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(12, 6, '12 pieces', 320.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(13, 6, 'Mild', 180.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(14, 6, 'Hot', 180.00, '2026-03-02 23:41:09', '2026-03-02 23:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(255) NOT NULL,
  `type` enum('home','work','other') NOT NULL DEFAULT 'home',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `name`, `phone`, `address_line_1`, `address_line_2`, `city`, `province`, `postal_code`, `type`, `latitude`, `longitude`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 7, 'Address 1', NULL, 'Libona', NULL, 'Manolo Fortich', 'Northern Mindanao (Region X)', '8706', 'home', 8.31974340, 124.80375450, 0, '2026-03-03 00:29:55', '2026-03-03 00:29:55'),
(2, 7, 'Address 1', NULL, 'Libona', NULL, 'Manolo Fortich', 'Northern Mindanao (Region X)', '8706', 'home', 8.31974340, 124.80375450, 0, '2026-03-03 00:30:41', '2026-03-03 00:30:41'),
(3, 7, 'Jay nashvel mejias quiblat', '+639626956959', 'Libona', NULL, 'Manolo Fortich', 'Northern Mindanao (Region X)', '8706', 'home', 8.31974340, 124.80375450, 0, '2026-03-03 02:09:34', '2026-03-03 02:09:34');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_item_addons`
--

CREATE TABLE `cart_item_addons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_item_id` bigint(20) UNSIGNED NOT NULL,
  `addon_id` bigint(20) UNSIGNED NOT NULL,
  `addon_variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'Electronics', 'fas fa-laptop', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(2, 'Computers & Accessories', NULL, 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(3, 'Headphones', NULL, 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(4, 'Cameras & Photography', NULL, 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(5, 'Smartphones & Tablets', NULL, 1, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(6, 'Fashion', 'fas fa-tshirt', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(7, 'Females Wear', NULL, 6, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(8, 'Mens Wear', NULL, 6, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(9, 'Childrens Wear', NULL, 6, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(10, 'Shoes', NULL, 6, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(11, 'Bags', NULL, 6, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(12, 'Glasses', NULL, 6, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(13, 'Home & Kitchen', 'fas fa-home', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(14, 'Kitchen & Dining', NULL, 13, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(15, 'Furniture', NULL, 13, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(16, 'Home Decor', NULL, 13, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(17, 'Bed & Bath', NULL, 13, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(18, 'Books', 'fas fa-book', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(19, 'Fiction', NULL, 18, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(20, 'Non-Fiction', NULL, 18, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(21, 'Science & Technology', NULL, 18, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(22, 'Comics', NULL, 18, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(23, 'Sports & Outdoors', 'fas fa-futbol', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(24, 'Team Sports', NULL, 23, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(25, 'Exercise & Fitness', NULL, 23, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(26, 'Outdoor Recreation', NULL, 23, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(27, 'Sports Apparel', NULL, 23, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(28, 'Food & Grocery', 'fas fa-utensils', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(29, 'Fresh Produce', NULL, 28, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(30, 'Beverages', NULL, 28, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(31, 'Snacks', NULL, 28, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(32, 'Dairy & Chilled', NULL, 28, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(33, 'Pizza', 'fas fa-pizza-slice', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(34, 'Margherita', NULL, 33, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(35, 'Pepperoni', NULL, 33, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(36, 'Supreme', NULL, 33, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(37, 'Vegetarian', NULL, 33, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(38, 'Burgers', 'fas fa-hamburger', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(39, 'Beef Burgers', NULL, 38, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(40, 'Chicken Burgers', NULL, 38, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(41, 'Veggie Burgers', NULL, 38, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(42, 'Fish Burgers', NULL, 38, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(43, 'Asian', 'fas fa-bowl-rice', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(44, 'Chinese', NULL, 43, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(45, 'Japanese', NULL, 43, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(46, 'Thai', NULL, 43, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(47, 'Korean', NULL, 43, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(48, 'Healthy', 'fas fa-leaf', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(49, 'Salads', NULL, 48, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(50, 'Smoothies', NULL, 48, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(51, 'Grain Bowls', NULL, 48, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(52, 'Wraps', NULL, 48, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(53, 'Desserts', 'fas fa-ice-cream', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(54, 'Cakes', NULL, 53, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(55, 'Ice Cream', NULL, 53, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(56, 'Pastries', NULL, 53, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(57, 'Cookies', NULL, 53, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(58, 'Coffee', 'fas fa-coffee', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(59, 'Espresso', NULL, 58, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(60, 'Latte', NULL, 58, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(61, 'Cappuccino', NULL, 58, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(62, 'Cold Brew', NULL, 58, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(63, 'Fast Food', 'fas fa-hotdog', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(64, 'Fried Chicken', NULL, 63, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(65, 'Hot Dogs', NULL, 63, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(66, 'Tacos', NULL, 63, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(67, 'Sandwiches', NULL, 63, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(68, 'Seafood', 'fas fa-fish', NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(69, 'Grilled Fish', NULL, 68, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(70, 'Shrimp', NULL, 68, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(71, 'Crab', NULL, 68, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(72, 'Sushi', NULL, 68, '2026-03-02 23:41:09', '2026-03-02 23:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_personal_access_tokens_table', 1),
(5, '2026_03_02_000001_create_stores_table', 1),
(6, '2026_03_02_000002_create_categories_table', 1),
(7, '2026_03_02_000003_create_products_table', 1),
(8, '2026_03_02_000004_create_product_variants_table', 1),
(9, '2026_03_02_000005_create_addresses_table', 1),
(10, '2026_03_02_000006_create_addon_categories_table', 1),
(11, '2026_03_02_000007_create_addons_table', 1),
(12, '2026_03_02_000008_create_addon_variants_table', 1),
(13, '2026_03_02_000009_create_cart_items_table', 1),
(14, '2026_03_02_000010_create_cart_item_addons_table', 1),
(15, '2026_03_02_000011_create_orders_table', 1),
(16, '2026_03_02_000012_create_order_items_table', 1),
(17, '2026_03_02_000013_create_order_item_addons_table', 1),
(18, '2026_03_02_000014_create_product_addons_table', 1),
(19, '2026_03_02_113149_create_settings_table', 1),
(20, '2026_03_03_082804_update_addresses_table_structure', 2),
(21, '2026_03_03_100108_add_phone_to_addresses_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `rider_id` bigint(20) UNSIGNED DEFAULT NULL,
  `delivery_address_id` bigint(20) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(8,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','accepted','rejected','in_transit','delivered','cancelled') NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `store_id`, `rider_id`, `delivery_address_id`, `total_amount`, `delivery_fee`, `status`, `payment_method`, `notes`, `created_at`, `updated_at`) VALUES
(1, 7, 1, NULL, 2, 171.97, 50.00, 'pending', 'cod', 'Order placed via checkout', '2026-03-03 00:48:35', '2026-03-03 01:55:56'),
(2, 7, 1, NULL, 2, 289.98, 50.00, 'pending', 'cod', 'Order placed via checkout', '2026-03-03 00:48:48', '2026-03-03 01:55:56'),
(3, 7, 1, NULL, 2, 103.97, 50.00, 'pending', 'cod', 'Order placed via checkout', '2026-03-03 01:02:20', '2026-03-03 01:02:20'),
(4, 7, 1, NULL, 2, 74.99, 50.00, 'pending', 'cod', 'Order placed via checkout', '2026-03-03 01:49:58', '2026-03-03 01:49:58'),
(5, 7, 1, NULL, 2, 74.99, 50.00, 'pending', 'cod', 'Order placed via checkout', '2026-03-03 01:50:59', '2026-03-03 01:50:59'),
(6, 7, 1, NULL, 3, 319.97, 50.00, 'pending', 'cod', 'Order placed via checkout', '2026-03-03 04:57:30', '2026-03-03 04:57:30');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 3, 32, NULL, 3, 17.99, '2026-03-03 01:02:20', '2026-03-03 01:02:20'),
(2, 1, 1, NULL, 2, 25.99, '2026-03-03 01:22:11', '2026-03-03 01:22:11'),
(3, 1, 2, NULL, 1, 69.99, '2026-03-03 01:22:11', '2026-03-03 01:22:11'),
(4, 2, 3, NULL, 1, 39.99, '2026-03-03 01:22:11', '2026-03-03 01:22:11'),
(5, 2, 4, NULL, 1, 199.99, '2026-03-03 01:22:11', '2026-03-03 01:22:11'),
(6, 4, 22, NULL, 1, 24.99, '2026-03-03 01:49:58', '2026-03-03 01:49:58'),
(7, 5, 22, NULL, 1, 24.99, '2026-03-03 01:50:59', '2026-03-03 01:50:59'),
(8, 6, 5, NULL, 3, 89.99, '2026-03-03 04:57:30', '2026-03-03 04:57:30');

-- --------------------------------------------------------

--
-- Table structure for table `order_item_addons`
--

CREATE TABLE `order_item_addons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_item_id` bigint(20) UNSIGNED NOT NULL,
  `addon_id` bigint(20) UNSIGNED NOT NULL,
  `addon_variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 7, 'auth-token', 'fb7a5f09fae0bafc5a96c78c713c3e9f450c5d11ceefa8ff8de2138d505ce8a0', '[\"*\"]', NULL, NULL, '2026-03-02 23:56:04', '2026-03-02 23:56:04'),
(2, 'App\\Models\\User', 1, 'auth-token', 'c044ec7ccf14f23492679d03d8b64dbe8f16fdd6ecf79279174a6a1e9aec0a6f', '[\"*\"]', NULL, NULL, '2026-03-03 02:12:07', '2026-03-03 02:12:07'),
(3, 'App\\Models\\User', 7, 'auth-token', '69aca27715a7b11e87cc181b71d1475c0efa0ef5d455df82195ad1530e4acf33', '[\"*\"]', NULL, NULL, '2026-03-03 02:20:01', '2026-03-03 02:20:01'),
(4, 'App\\Models\\User', 7, 'auth-token', 'c8cf0b56a479bcbfba91a401c6fb7ad78ee8039a06ef159b5e3261495e7702ab', '[\"*\"]', NULL, NULL, '2026-03-03 02:27:37', '2026-03-03 02:27:37'),
(5, 'App\\Models\\User', 7, 'auth-token', '339cab57df18ebc9a5dfd702825f8dadc2800576b73c868e691337d215b4a871', '[\"*\"]', NULL, NULL, '2026-03-03 02:32:35', '2026-03-03 02:32:35'),
(6, 'App\\Models\\User', 7, 'auth-token', '41d503e0b875c9cca2df8968f06ad47501f8ce9b47f8620a95ef0e5e947bc244', '[\"*\"]', NULL, NULL, '2026-03-03 02:33:24', '2026-03-03 02:33:24'),
(7, 'App\\Models\\User', 1, 'auth-token', 'ab5c438dcdd5f1081607a6a51f13b63b1f3ea31dbec0e316175dabdf9c4bd79a', '[\"*\"]', NULL, NULL, '2026-03-03 02:33:51', '2026-03-03 02:33:51'),
(8, 'App\\Models\\User', 1, 'auth-token', 'e4d4f3ee8276ae9856f9d849a441dd473cee7e6418da1828130eb45bc8db612e', '[\"*\"]', NULL, NULL, '2026-03-03 02:57:39', '2026-03-03 02:57:39'),
(9, 'App\\Models\\User', 7, 'auth-token', '4d6aa52a814ec29c261360eca26cfc337d7374db01eb66a01ceac5ca18710912', '[\"*\"]', NULL, NULL, '2026-03-03 04:21:57', '2026-03-03 04:21:57'),
(10, 'App\\Models\\User', 7, 'auth-token', '4bafb48cb98c7dd7e41f5b6746dd1175f4c718ce2d5cb8c52bb7d8d4182cfd90', '[\"*\"]', NULL, NULL, '2026-03-03 04:30:01', '2026-03-03 04:30:01'),
(11, 'App\\Models\\User', 7, 'auth-token', 'ce33072976c6a157e0bb50ed846f03464d2f138c7e0bb963b85707a996f559fe', '[\"*\"]', NULL, NULL, '2026-03-03 04:30:16', '2026-03-03 04:30:16'),
(12, 'App\\Models\\User', 7, 'auth-token', '30dd1dec9f684a5fa609559ebdae4aafe92d51ed7a62c1126ce63a5ed0913314', '[\"*\"]', NULL, NULL, '2026-03-03 04:33:41', '2026-03-03 04:33:41'),
(13, 'App\\Models\\User', 2, 'auth-token', 'a462398d960c38d6748d23628bcec418bc69a565c47f0f98f3f743321cf5dcf6', '[\"*\"]', NULL, NULL, '2026-03-03 04:51:28', '2026-03-03 04:51:28'),
(14, 'App\\Models\\User', 7, 'auth-token', 'cbe8c9985ef98764360f38bb56cc360534daee4722996b2b73d4fee82063d4cd', '[\"*\"]', NULL, NULL, '2026-03-03 04:54:29', '2026-03-03 04:54:29'),
(15, 'App\\Models\\User', 7, 'auth-token', 'a2514e7889ae6730a3469f568aa39c8a8ba1f996625cf3452b7c4760dad0dd35', '[\"*\"]', NULL, NULL, '2026-03-03 04:57:06', '2026-03-03 04:57:06');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `product_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `store_id`, `category_id`, `name`, `description`, `price`, `stock`, `image`, `is_active`, `is_approved`, `product_type`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Wireless Mouse', 'Ergonomic wireless mouse with multiple color options.', NULL, NULL, 'mouse.jpg', 1, 1, 'variable', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(2, 1, 2, 'Mechanical Keyboard', 'RGB mechanical keyboard.', 69.99, 120, 'keyboard.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(3, 1, 2, 'USB-C Hub', '7-in-1 USB-C hub.', 39.99, 200, 'usbc_hub.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(4, 1, 3, 'Noise Cancelling Headphones', 'Over-ear headphones.', 199.99, 80, 'headphones.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(5, 1, 4, '4K Webcam', 'Webcam with ring light.', 89.99, 100, 'webcam.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(6, 1, 2, 'Portable SSD', '1TB portable SSD.', 129.99, 70, 'ssd.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(7, 1, 2, 'Gaming Monitor', '27-inch 144Hz gaming monitor.', 299.99, 50, 'monitor.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(8, 1, 2, 'Laptop Stand', 'Adjustable aluminum laptop stand.', 29.99, 180, 'laptop_stand.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(9, 1, 19, 'The Great Gatsby', 'A classic novel.', 12.99, 250, 'thegreatgatsby.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(10, 1, 30, 'Energy Drink', 'A can of energy drink.', 2.99, 500, 'energy_drink.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(11, 2, 7, 'Summer Dress', 'Light and airy summer dress.', 39.99, 120, 'summer_dress.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(12, 2, 8, 'Leather Jacket', 'Classic leather jacket.', 149.99, 60, 'leather_jacket.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(13, 2, 8, 'Skinny Jeans', 'Comfortable skinny jeans.', 59.99, 200, 'jeans.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(14, 2, 8, 'T-Shirt', 'Plain white t-shirt.', 19.99, 300, 'tshirt.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(15, 2, 10, 'Sneakers', 'Stylish sneakers.', 79.99, 150, 'sneakers.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(16, 2, 12, 'Sunglasses', 'UV protection sunglasses.', 24.99, 180, 'sunglasses.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(17, 2, 11, 'Watch', 'Minimalist wrist watch.', 99.99, 90, 'watch.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(18, 2, 8, 'Beanie', 'Warm winter beanie.', 14.99, 220, 'beanie.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(19, 2, 11, 'Umbrella', 'Windproof umbrella.', 29.99, 130, 'umbrella.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(20, 2, 24, 'Basketball', 'Official size basketball.', 24.99, 100, 'basketball.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(21, 3, 17, 'Pillow', 'Memory foam pillow.', 19.99, 200, 'pillow.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(22, 3, 16, 'Scented Candles', 'Set of 3 scented candles.', 24.99, 250, 'candles.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(23, 3, 14, 'Coffee Maker', '12-cup coffee maker.', 49.99, 80, 'coffee_maker.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(24, 3, 17, 'Towel Set', '6-piece towel set.', 34.99, 150, 'towel_set.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(25, 3, 14, 'Cookware Set', '10-piece non-stick cookware set.', 89.99, 60, 'cookware.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(26, 3, 16, 'Picture Frame', '8x10 picture frame.', 9.99, 300, 'picture_frame.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(27, 3, 16, 'Wall Clock', 'Modern wall clock.', 19.99, 120, 'wall_clock.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(28, 3, 16, 'Desk Lamp', 'LED desk lamp.', 29.99, 140, 'desk_lamp.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(29, 3, 16, 'Throw Blanket', 'Cozy throw blanket.', 24.99, 180, 'blanket.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(30, 3, 31, 'Instant Noodles', 'Pack of 5 instant noodles.', 4.99, 500, 'noodles.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(31, 4, 34, 'Margherita Pizza', 'Classic pizza with tomatoes, mozzarella, and basil.', 15.99, 50, 'margherita.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(32, 4, 35, 'Pepperoni Pizza', 'Pizza with pepperoni and cheese.', 17.99, 40, 'pepperoni.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(33, 4, 36, 'Supreme Pizza', 'Pizza loaded with pepperoni, sausage, peppers, and mushrooms.', 19.99, 30, 'supreme.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(34, 4, 37, 'Veggie Pizza', 'Fresh vegetables on a crispy crust.', 16.99, 35, 'veggie.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(35, 5, 39, 'Classic Beef Burger', 'Juicy beef patty with lettuce, tomato, and cheese.', 12.99, 60, 'beef_burger.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(36, 5, 40, 'Crispy Chicken Burger', 'Crispy fried chicken with mayo and pickles.', 11.99, 45, 'chicken_burger.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(37, 5, 41, 'Plant-Based Burger', 'Delicious plant-based patty with fresh toppings.', 13.99, 40, 'veggie_burger.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(38, 6, 44, 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts and vegetables.', 14.99, 50, 'kung_pao.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(39, 6, 45, 'Chicken Teriyaki Bowl', 'Grilled chicken with teriyaki sauce over rice.', 13.99, 55, 'teriyaki.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(40, 6, 46, 'Pad Thai', 'Traditional Thai stir-fried noodles with shrimp.', 15.99, 40, 'pad_thai.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(41, 7, 49, 'Caesar Salad', 'Fresh romaine lettuce with caesar dressing and croutons.', 9.99, 70, 'caesar_salad.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(42, 7, 50, 'Green Power Smoothie', 'Spinach, banana, and mango smoothie packed with nutrients.', 7.99, 80, 'green_smoothie.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(43, 7, 51, 'Quinoa Power Bowl', 'Quinoa bowl with roasted vegetables and tahini dressing.', 12.99, 45, 'quinoa_bowl.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(44, 8, 54, 'Chocolate Fudge Cake', 'Rich chocolate cake with fudge frosting.', 4.99, 25, 'chocolate_cake.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(45, 8, 55, 'Vanilla Bean Ice Cream', 'Creamy vanilla ice cream made with real vanilla beans.', 3.99, 100, 'vanilla_ice_cream.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(46, 9, 59, 'Double Espresso', 'Rich and bold double shot of espresso.', 3.99, 200, 'espresso.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(47, 9, 60, 'Caramel Latte', 'Smooth latte with caramel syrup and steamed milk.', 5.99, 150, 'caramel_latte.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(48, 10, 64, 'Crispy Fried Chicken', 'Golden crispy fried chicken pieces.', 8.99, 80, 'fried_chicken.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(49, 10, 65, 'Classic Hot Dog', 'All-beef hot dog with mustard and ketchup.', 4.99, 120, 'hot_dog.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(50, 11, 69, 'Grilled Salmon', 'Fresh Atlantic salmon grilled to perfection.', 18.99, 30, 'grilled_salmon.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(51, 11, 70, 'Garlic Butter Shrimp', 'Succulent shrimp sautéed in garlic butter.', 16.99, 40, 'garlic_shrimp.jpg', 1, 1, 'single', '2026-03-03 03:38:33', '2026-03-03 03:38:33');

-- --------------------------------------------------------

--
-- Table structure for table `product_addons`
--

CREATE TABLE `product_addons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `addon_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `name`, `price`, `stock`, `attributes`, `created_at`, `updated_at`) VALUES
(1, 1, 'WM-BLK', 'Black - Medium', 25.00, 50, '\"{\\\"Color\\\":\\\"Black\\\",\\\"Size\\\":\\\"Medium\\\"}\"', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(2, 1, 'WM-BLU', 'Blue - Medium', 25.00, 35, '\"{\\\"Color\\\":\\\"Blue\\\",\\\"Size\\\":\\\"Medium\\\"}\"', '2026-03-03 03:38:33', '2026-03-03 03:38:33'),
(3, 1, 'WM-WHT', 'White - Medium', 22.00, 75, '\"{\\\"Color\\\":\\\"White\\\",\\\"Size\\\":\\\"Medium\\\"}\"', '2026-03-03 03:38:33', '2026-03-03 03:38:33');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('dbhXadDdyhc4GwpMN4z2CpS0kHetn1BOhIa1HIof', 7, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoibW5ZRVZDdzZrWjNKRjh0OXJ2TkR1VWkxMkRuNTBvdVBMUGtWT0FmaiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJuZXciO2E6MDp7fXM6Mzoib2xkIjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9pbWFnZXMvbmFzaC5zdmciO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo3O30=', 1772543577),
('kDn1PQWCtrW1wMwSnva5c3VncCNCwXiPX9vj05S1', NULL, '127.0.0.1', 'curl/8.18.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODk0RklQU0h2MkxPQVlrRXZDWXQ3RlZjUEVwWERBU2JKdUtud3lrQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jc3JmLXRva2VuIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1772540783),
('kEuLWkJN8UzCXbu3p64O8vcJlTJ40ssFBwR7o3yg', NULL, '127.0.0.1', 'curl/8.18.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQ012Y3RZNlZlTkwzeUtuU1pMV1pVV3hPN014VEVNR1RJTHRqZnFhOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1772541230),
('vfncwiuyyVXssxp92gIux1aXogO5YAUEm4tTYW2j', NULL, '127.0.0.1', 'curl/8.18.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoialdjSExWQ2NCSzl5VVZLYjh0dmdlWTVidWp2b3FpcXV1ZGl1NVBmeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1772540929);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'app_name', 'Ecomxpert', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(2, 'app_description', 'Quick and Easy Shopping at Your Fingertips\nOrder your favorite convenience store items with just a few clicks', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(3, 'facebook_url', '', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(4, 'twitter_url', '', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(5, 'instagram_url', '', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(6, 'api_logging', 'true', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(7, 'restaurant_banner_text', 'Explore our Restaurants with a delivery at your fingertips', '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(8, 'main_banner_text', 'Your Everyday Essentials, Delivered.', '2026-03-02 23:41:09', '2026-03-02 23:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `delivery_fee` decimal(8,2) NOT NULL DEFAULT 0.00,
  `store_type` enum('convenience','restaurant') NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `client_id`, `name`, `description`, `address`, `logo`, `cover_photo`, `phone_number`, `delivery_fee`, `store_type`, `is_active`, `latitude`, `longitude`, `created_at`, `updated_at`) VALUES
(1, 2, 'Tech World', 'Your one-stop shop for all things tech.', '123 Tech Street, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'convenience', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(2, 3, 'Fashion Forward', 'The latest trends in fashion.', '456 Fashion Ave, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'convenience', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(3, 4, 'Home Essentials', 'Everything you need for your home.', '789 Home Blvd, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'convenience', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(4, 5, 'Pizza Palace', 'Delicious pizzas made fresh.', '101 Pizza Lane, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(5, 2, 'Burger Junction', 'Gourmet burgers and fries.', '202 Burger Street, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(6, 3, 'Asian Fusion', 'Authentic Asian cuisine with a modern twist.', '303 Asia Avenue, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(7, 4, 'Healthy Bites', 'Fresh salads, smoothies, and healthy meals.', '404 Health Way, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(8, 5, 'Sweet Treats', 'Cakes, pastries, and desserts.', '505 Dessert Drive, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(9, 2, 'Coffee Corner', 'Premium coffee and light snacks.', '606 Coffee Court, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(10, 3, 'Quick Bites', 'Fast food favorites and quick meals.', '707 Fast Lane, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09'),
(11, 4, 'Ocean Delights', 'Fresh seafood and marine cuisine.', '808 Seafood Street, Tagoloan, Misamis Oriental', NULL, NULL, NULL, 0.00, 'restaurant', 1, NULL, NULL, '2026-03-03 03:29:09', '2026-03-03 03:29:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'customer',
  `avatar` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_blacklisted` tinyint(1) NOT NULL DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `password`, `role`, `avatar`, `is_verified`, `is_blacklisted`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'User', 'admin@example.com', '1112223333', '$2y$12$mWycZ34Ml3hsdMynbbPKVu5jOq59toKW1yipu7tFdI6OdmjPGjNT.', 'admin', NULL, 1, 0, NULL, NULL, '2026-03-02 23:41:07', '2026-03-02 23:41:07'),
(2, 'Tech', 'Owner', 'tech@example.com', '09000000001', '$2y$12$a30Q8VZuQDG37DgipjvAleUqYmr/e8lkxVB88tXnsQFzMhxLvKOYS', 'client', NULL, 1, 0, NULL, NULL, '2026-03-02 23:41:07', '2026-03-02 23:41:07'),
(3, 'Fashion', 'Owner', 'fashion@example.com', '09000000002', '$2y$12$cino7Co9GeVlq629fqIWQ.F5foYA4M3eLRfkCvy/s.PGP42wRRmOS', 'client', NULL, 1, 0, NULL, NULL, '2026-03-02 23:41:07', '2026-03-02 23:41:07'),
(4, 'Home', 'Owner', 'home@example.com', '09000000003', '$2y$12$Z6qQxSRgmnlEffjaRyaGTuq7o6efZlmg9UDIK57GxA6c6eg5ZF/Oq', 'client', NULL, 1, 0, NULL, NULL, '2026-03-02 23:41:08', '2026-03-02 23:41:08'),
(5, 'Pizza', 'Owner', 'pizza@example.com', '09000000004', '$2y$12$ky6mnOllOmkTUOkuPJsksO4b5EhEZ86VxnsCPn9.kJ5rs43JujoF6', 'client', NULL, 1, 0, NULL, NULL, '2026-03-02 23:41:08', '2026-03-02 23:41:08'),
(6, 'John', 'Doe', 'customer@example.com', '09123456789', '$2y$12$nbHcnsZ7IY5MaQ.NgoXuY.L6kn3fJBX7fmjLOKN7xYMSd5Oe3KnXO', 'customer', NULL, 1, 0, NULL, NULL, '2026-03-02 23:41:09', '2026-03-02 23:41:09'),
(7, 'Jay', 'quiblat', 'nash.backup21@gmail.com', NULL, '$2y$12$EjburrRNH5nHnI9yHuOLmOUaJd5YsOW04Kc/7eZ8AhTngpaY0F3w6', 'customer', NULL, 0, 0, NULL, NULL, '2026-03-02 23:54:56', '2026-03-02 23:54:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addons`
--
ALTER TABLE `addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addons_category_id_foreign` (`category_id`),
  ADD KEY `addons_store_id_is_active_index` (`store_id`,`is_active`),
  ADD KEY `addons_name_index` (`name`),
  ADD KEY `addons_is_active_index` (`is_active`);

--
-- Indexes for table `addon_categories`
--
ALTER TABLE `addon_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addon_categories_name_index` (`name`);

--
-- Indexes for table `addon_variants`
--
ALTER TABLE `addon_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addon_variants_addon_id_index` (`addon_id`);

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addresses_user_id_is_default_index` (`user_id`,`is_default`),
  ADD KEY `addresses_latitude_longitude_index` (`latitude`,`longitude`),
  ADD KEY `addresses_city_index` (`city`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_cart_unique` (`user_id`,`product_id`,`variant_id`),
  ADD UNIQUE KEY `session_cart_unique` (`session_id`,`product_id`,`variant_id`),
  ADD KEY `cart_items_product_id_foreign` (`product_id`),
  ADD KEY `cart_items_variant_id_foreign` (`variant_id`),
  ADD KEY `cart_items_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `cart_items_session_id_created_at_index` (`session_id`,`created_at`);

--
-- Indexes for table `cart_item_addons`
--
ALTER TABLE `cart_item_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_item_addons_addon_id_foreign` (`addon_id`),
  ADD KEY `cart_item_addons_addon_variant_id_foreign` (`addon_variant_id`),
  ADD KEY `cart_item_addons_cart_item_id_index` (`cart_item_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_parent_id_name_index` (`parent_id`,`name`),
  ADD KEY `categories_name_index` (`name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_delivery_address_id_foreign` (`delivery_address_id`),
  ADD KEY `orders_customer_id_status_created_at_index` (`customer_id`,`status`,`created_at`),
  ADD KEY `orders_store_id_status_created_at_index` (`store_id`,`status`,`created_at`),
  ADD KEY `orders_rider_id_status_index` (`rider_id`,`status`),
  ADD KEY `orders_status_created_at_index` (`status`,`created_at`),
  ADD KEY `orders_status_index` (`status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`),
  ADD KEY `order_items_variant_id_foreign` (`variant_id`),
  ADD KEY `order_items_order_id_index` (`order_id`);

--
-- Indexes for table `order_item_addons`
--
ALTER TABLE `order_item_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_item_addons_addon_id_foreign` (`addon_id`),
  ADD KEY `order_item_addons_addon_variant_id_foreign` (`addon_variant_id`),
  ADD KEY `order_item_addons_order_item_id_index` (`order_item_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_store_id_is_active_is_approved_index` (`store_id`,`is_active`,`is_approved`),
  ADD KEY `products_category_id_is_active_is_approved_index` (`category_id`,`is_active`,`is_approved`),
  ADD KEY `products_is_approved_created_at_index` (`is_approved`,`created_at`),
  ADD KEY `products_name_index` (`name`),
  ADD KEY `products_price_index` (`price`),
  ADD KEY `products_stock_index` (`stock`),
  ADD KEY `products_is_active_index` (`is_active`),
  ADD KEY `products_is_approved_index` (`is_approved`);

--
-- Indexes for table `product_addons`
--
ALTER TABLE `product_addons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_addons_product_id_addon_id_unique` (`product_id`,`addon_id`),
  ADD KEY `product_addons_addon_id_foreign` (`addon_id`),
  ADD KEY `product_addons_product_id_addon_id_index` (`product_id`,`addon_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_variants_sku_unique` (`sku`),
  ADD KEY `product_variants_product_id_stock_index` (`product_id`,`stock`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stores_client_id_foreign` (`client_id`),
  ADD KEY `stores_is_active_store_type_index` (`is_active`,`store_type`),
  ADD KEY `stores_latitude_longitude_index` (`latitude`,`longitude`),
  ADD KEY `stores_name_index` (`name`),
  ADD KEY `stores_store_type_index` (`store_type`),
  ADD KEY `stores_is_active_index` (`is_active`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addons`
--
ALTER TABLE `addons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `addon_categories`
--
ALTER TABLE `addon_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `addon_variants`
--
ALTER TABLE `addon_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_item_addons`
--
ALTER TABLE `cart_item_addons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_item_addons`
--
ALTER TABLE `order_item_addons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `product_addons`
--
ALTER TABLE `product_addons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addons`
--
ALTER TABLE `addons`
  ADD CONSTRAINT `addons_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `addon_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `addons_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `addon_variants`
--
ALTER TABLE `addon_variants`
  ADD CONSTRAINT `addon_variants_addon_id_foreign` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_variant_id_foreign` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_item_addons`
--
ALTER TABLE `cart_item_addons`
  ADD CONSTRAINT `cart_item_addons_addon_id_foreign` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_item_addons_addon_variant_id_foreign` FOREIGN KEY (`addon_variant_id`) REFERENCES `addon_variants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_item_addons_cart_item_id_foreign` FOREIGN KEY (`cart_item_id`) REFERENCES `cart_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_delivery_address_id_foreign` FOREIGN KEY (`delivery_address_id`) REFERENCES `addresses` (`id`),
  ADD CONSTRAINT `orders_rider_id_foreign` FOREIGN KEY (`rider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `order_items_variant_id_foreign` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `order_item_addons`
--
ALTER TABLE `order_item_addons`
  ADD CONSTRAINT `order_item_addons_addon_id_foreign` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`),
  ADD CONSTRAINT `order_item_addons_addon_variant_id_foreign` FOREIGN KEY (`addon_variant_id`) REFERENCES `addon_variants` (`id`),
  ADD CONSTRAINT `order_item_addons_order_item_id_foreign` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_addons`
--
ALTER TABLE `product_addons`
  ADD CONSTRAINT `product_addons_addon_id_foreign` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_addons_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
