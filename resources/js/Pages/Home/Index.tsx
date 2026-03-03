import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Product, Category, Store } from '@/types';
import HeroSection from './components/HeroSection';
import RestaurantBanner from './components/RestaurantBanner';
import BrandsSection from './components/BrandsSection';
import FemaleWearsSection from './components/FemaleWearsSection';
import FeaturedProductsSection from './components/FeaturedProductsSection';
import CategoriesSection from './components/CategoriesSection';
import ConvenienceStoresSection from './components/ConvenienceStoresSection';
import RestaurantsSection from './components/RestaurantsSection';
import QuickAccessCards from './components/QuickAccessCards';
import MobileAppSection from './components/MobileAppSection';

interface Props extends PageProps {
    featuredProducts: Product[];
    categories: Category[];
    stores: Store[];
    convenienceStores: Store[];
    restaurants: Store[];
}

export default function Home({ featuredProducts = [], categories = [], convenienceStores = [], restaurants = [] }: Props) {
    const bannerText = 'Your Everyday Essentials, Delivered.';
    const appDescription = 'Quick and Easy Shopping at Your Fingertips. Order your favorite convenience store items with just a few clicks.';

    return (
        <AppLayout>
            <Head title="Welcome to QuickMart" />

            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <HeroSection bannerText={bannerText} appDescription={appDescription} />
                
                <RestaurantBanner />

                <BrandsSection />

                {featuredProducts && featuredProducts.length > 0 && (
                    <FemaleWearsSection products={featuredProducts.slice(0, 6)} />
                )}

                {featuredProducts && featuredProducts.length > 0 && (
                    <FeaturedProductsSection products={featuredProducts.slice(0, 10)} />
                )}

                {categories && categories.length > 0 && (
                    <CategoriesSection categories={categories} />
                )}

                {convenienceStores && convenienceStores.length > 0 && (
                    <ConvenienceStoresSection stores={convenienceStores} />
                )}

                {restaurants && restaurants.length > 0 && (
                    <RestaurantsSection restaurants={restaurants} />
                )}

                <QuickAccessCards />

                <MobileAppSection />
            </motion.div>
        </AppLayout>
    );
}
