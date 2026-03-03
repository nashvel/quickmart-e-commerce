import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Product, Category, Store } from '@/types';
import HeroSection from './Home/components/HeroSection';
import RestaurantBanner from './Home/components/RestaurantBanner';
import BrandsSection from './Home/components/BrandsSection';
import FemaleWearsSection from './Home/components/FemaleWearsSection';
import FeaturedProductsSection from './Home/components/FeaturedProductsSection';
import CategoriesSection from './Home/components/CategoriesSection';
import ConvenienceStoresSection from './Home/components/ConvenienceStoresSection';
import RestaurantsSection from './Home/components/RestaurantsSection';
import QuickAccessCards from './Home/components/QuickAccessCards';
import MobileAppSection from './Home/components/MobileAppSection';

interface Props extends PageProps {
    featuredProducts: Product[];
    categories: Category[];
    stores: Store[];
    convenienceStores: Store[];
    restaurants: Store[];
}

export default function Welcome({ featuredProducts = [], categories = [], convenienceStores = [], restaurants = [] }: Props) {
    const bannerText = 'Your Everyday Essentials, Delivered.';
    const appDescription = 'Quick and Easy Shopping at Your Fingertips. Order your favorite convenience store items with just a few clicks.';

    return (
        <AppLayout>
            <Head title="Welcome to QuickMart" />

            <style>{`
                /* Ribbon 1 */
                .ribbon1 {
                    position: absolute;
                    top: -6.1px;
                    right: 10px;
                    z-index: 10;
                }
                .ribbon1:after {
                    position: absolute;
                    content: "";
                    width: 0;
                    height: 0;
                    border-left: 53px solid transparent;
                    border-right: 53px solid transparent;
                    border-top: 10px solid #f8463f;
                }
                .ribbon1 span {
                    position: relative;
                    display: block;
                    text-align: center;
                    background: #f8463f;
                    font-size: 14px;
                    line-height: 1;
                    padding: 12px 8px 10px;
                    border-top-right-radius: 8px;
                    width: 90px;
                    color: white;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .ribbon1 span:before,
                .ribbon1 span:after {
                    position: absolute;
                    content: "";
                }
                .ribbon1 span:before {
                    height: 6px;
                    width: 6px;
                    left: -6px;
                    top: 0;
                    background: #f8463f;
                }
                .ribbon1 span:after {
                    height: 6px;
                    width: 8px;
                    left: -8px;
                    top: 0;
                    border-radius: 8px 8px 0 0;
                    background: #c02031;
                }
            `}</style>

            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <HeroSection bannerText={bannerText} appDescription={appDescription} />
                
                {/* Banners Section */}
                <section className="relative z-0 grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12 md:mb-16">
                    <div className="h-full lg:col-span-3">
                        <RestaurantBanner />
                    </div>
                    <div className="h-full lg:col-span-2">
                        {/* Promo Banner Placeholder */}
                        <div className="bg-white rounded-2xl p-6 h-full flex flex-col justify-center items-center shadow-lg border border-gray-200 relative overflow-hidden">
                            {/* Ribbon Badge */}
                            <div className="ribbon1">
                                <span>Hot Deal</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-2 text-gray-800">Special Offers</h3>
                            <p className="text-center text-gray-600">Check out our latest promotions!</p>
                        </div>
                    </div>
                </section>

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
