import { Head } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Search, Star, Heart } from 'lucide-react';
import axios from 'axios';

interface Restaurant {
    id: number;
    name: string;
    logo?: string;
    cuisine?: string;
    isOpen?: boolean;
    rating?: number;
    deliveryTime?: number;
    deliveryFee?: number;
    created_at?: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    store_id: number;
}

interface FoodCategory {
    name: string;
    emoji: string;
}

interface Props {
    stores: Restaurant[];
    pagination?: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

const PRODUCT_ASSET_URL = '/storage/products';

export default function RestaurantsIndex({ stores: initialStores }: Props) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialStores || []);
    const [foodItems, setFoodItems] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('relevance');
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [offers, setOffers] = useState({ freeDelivery: false, fastDelivery: false, newRestaurants: false });
    const [ratingFilter, setRatingFilter] = useState(0);
    const [cuisineSearch, setCuisineSearch] = useState('');

    const foodCategories: FoodCategory[] = [
        { name: 'All', emoji: '🍽️' },
        { name: 'Pizza', emoji: '🍕' },
        { name: 'Burgers', emoji: '🍔' },
        { name: 'Asian', emoji: '🍜' },
        { name: 'Healthy', emoji: '🥗' },
        { name: 'Desserts', emoji: '🍰' },
        { name: 'Coffee', emoji: '☕' },
        { name: 'Fast Food', emoji: '🌭' },
        { name: 'Seafood', emoji: '🦐' }
    ];

    const categoryImages: Record<string, string> = {
        Pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop',
        Burgers: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=120&h=120&fit=crop',
        Asian: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=120&h=120&fit=crop',
        Healthy: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop',
        Desserts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=120&h=120&fit=crop',
        Coffee: '/storage/products/coffee_category.jpg',
        'Fast Food': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=120&h=120&fit=crop',
        Seafood: '/storage/products/seafood_category.jpg',
        All: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop',
    };

    useEffect(() => {
        // Add mock data for restaurant properties and assign proper cuisines based on restaurant names
        const restaurantData = initialStores.map((store: Restaurant) => {
            let cuisine = 'Variety of dishes';
            
            // Assign cuisines based on restaurant names
            if (store.name.toLowerCase().includes('pizza')) {
                cuisine = 'Pizza';
            } else if (store.name.toLowerCase().includes('burger')) {
                cuisine = 'Burgers';
            } else if (store.name.toLowerCase().includes('asian')) {
                cuisine = 'Asian';
            } else if (store.name.toLowerCase().includes('healthy') || store.name.toLowerCase().includes('salad')) {
                cuisine = 'Healthy';
            } else if (store.name.toLowerCase().includes('sweet') || store.name.toLowerCase().includes('treats') || store.name.toLowerCase().includes('dessert')) {
                cuisine = 'Desserts';
            } else if (store.name.toLowerCase().includes('coffee')) {
                cuisine = 'Coffee';
            } else if (store.name.toLowerCase().includes('quick') || store.name.toLowerCase().includes('bites')) {
                cuisine = 'Fast Food';
            } else if (store.name.toLowerCase().includes('ocean') || store.name.toLowerCase().includes('seafood')) {
                cuisine = 'Seafood';
            }

            return {
                ...store,
                isOpen: true,
                rating: 4.2 + Math.random() * 0.8,
                deliveryTime: Math.floor(Math.random() * 20) + 15,
                deliveryFee: Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 50) + 20,
                cuisine: cuisine
            };
        });
        setRestaurants(restaurantData);
        fetchFoodItems();
    }, [initialStores]);

    const fetchFoodItems = async () => {
        try {
            const response = await axios.get('/api/products?store_type=restaurant');
            setFoodItems(response.data.products || []);
        } catch (error) {
            console.error('Failed to fetch food items:', error);
        }
    };

    const filteredRestaurants = useMemo(() => {
        let filtered = restaurants;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(r => {
                if (!r.cuisine) return false;
                // Exact match or partial match for cuisine
                return r.cuisine.toLowerCase() === selectedCategory.toLowerCase() ||
                       r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                       selectedCategory.toLowerCase().includes(r.cuisine.toLowerCase());
            });
        }

        if (searchQuery) {
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (offers.freeDelivery) {
            filtered = filtered.filter(r => r.deliveryFee === 0);
        }
        if (offers.fastDelivery) {
            filtered = filtered.filter(r => (r.deliveryTime || 999) <= 20);
        }
        if (ratingFilter > 0) {
            filtered = filtered.filter(r => (r.rating || 0) >= ratingFilter);
        }
        if (cuisineSearch) {
            filtered = filtered.filter(r =>
                r.cuisine && r.cuisine.toLowerCase().includes(cuisineSearch.toLowerCase())
            );
        }

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'rating': return (b.rating || 0) - (a.rating || 0);
                case 'deliveryTime': return (a.deliveryTime || 999) - (b.deliveryTime || 999);
                case 'name': return a.name.localeCompare(b.name);
                default: return 0;
            }
        });
    }, [restaurants, selectedCategory, searchQuery, sortBy, offers, ratingFilter, cuisineSearch]);

    const filteredFoodItems = useMemo(() => {
        let filtered = foodItems;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(food => {
                // Filter food items based on selected category
                // This would ideally use product categories, but for now we'll use simple name matching
                const foodName = food.name.toLowerCase();
                const category = selectedCategory.toLowerCase();
                
                switch (category) {
                    case 'pizza':
                        return foodName.includes('pizza');
                    case 'burgers':
                        return foodName.includes('burger');
                    case 'asian':
                        return foodName.includes('kung pao') || foodName.includes('teriyaki') || foodName.includes('pad thai');
                    case 'healthy':
                        return foodName.includes('salad') || foodName.includes('smoothie') || foodName.includes('quinoa');
                    case 'desserts':
                        return foodName.includes('cake') || foodName.includes('ice cream');
                    case 'coffee':
                        return foodName.includes('espresso') || foodName.includes('latte') || foodName.includes('coffee');
                    case 'fast food':
                        return foodName.includes('hot dog') || foodName.includes('chicken') || foodName.includes('fries');
                    case 'seafood':
                        return foodName.includes('shrimp') || foodName.includes('salmon') || foodName.includes('fish');
                    default:
                        return true;
                }
            });
        }

        return filtered;
    }, [foodItems, selectedCategory]);

    const toggleFavorite = (restaurantId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(restaurantId)) {
            newFavorites.delete(restaurantId);
        } else {
            newFavorites.add(restaurantId);
        }
        setFavorites(newFavorites);
    };

    return (
        <AppLayout>
            <Head title="Restaurants" />

            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24">
                                <h2 className="text-xl font-bold p-4 border-b">Filters</h2>
                                
                                {/* Sort By */}
                                <div className="p-4 border-b">
                                    <h3 className="font-bold text-primary mb-4 text-sm uppercase">Sort by</h3>
                                    <div className="space-y-2">
                                        {['relevance', 'deliveryTime', 'rating'].map(option => (
                                            <label key={option} className="flex items-center space-x-3 cursor-pointer hover:bg-primary/5 p-2 rounded-lg">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    value={option}
                                                    checked={sortBy === option}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="h-4 w-4 text-primary"
                                                />
                                                <span className="text-gray-700 capitalize">{option === 'deliveryTime' ? 'Fastest Delivery' : option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="p-4 border-b">
                                    <h3 className="font-bold text-primary mb-4 text-sm uppercase">Quick filters</h3>
                                    <button
                                        onClick={() => setRatingFilter(ratingFilter === 4 ? 0 : 4)}
                                        className={`w-full text-left px-4 py-2 rounded-lg border-2 transition-colors ${ratingFilter === 4 ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-100 border-gray-200 hover:bg-primary/5'}`}
                                    >
                                        Ratings 4+
                                    </button>
                                </div>

                                {/* Offers */}
                                <div className="p-4 border-b">
                                    <h3 className="font-bold text-primary mb-4 text-sm uppercase">Offers</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-3 cursor-pointer hover:bg-primary/5 p-2 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={offers.freeDelivery}
                                                onChange={() => setOffers(prev => ({ ...prev, freeDelivery: !prev.freeDelivery }))}
                                                className="h-4 w-4 rounded text-primary"
                                            />
                                            <span className="text-gray-700">Free delivery</span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer hover:bg-primary/5 p-2 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={offers.fastDelivery}
                                                onChange={() => setOffers(prev => ({ ...prev, fastDelivery: !prev.fastDelivery }))}
                                                className="h-4 w-4 rounded text-primary"
                                            />
                                            <span className="text-gray-700">Fast delivery (≤20 min)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Cuisines Search */}
                                <div className="p-4">
                                    <h3 className="font-bold text-primary mb-4 text-sm uppercase">Cuisines</h3>
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search for cuisine"
                                            value={cuisineSearch}
                                            onChange={(e) => setCuisineSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <main className="lg:col-span-3">
                            {/* Search Bar */}
                            <div className="relative mb-8">
                                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for restaurants, cuisines, and dishes"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Favorite Cuisines */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your favorite cuisines</h2>
                                <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                                    {foodCategories.map((category) => (
                                        <motion.div
                                            key={category.name}
                                            className="flex-shrink-0 text-center cursor-pointer group w-24"
                                            onClick={() => setSelectedCategory(category.name)}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div className={`w-24 h-24 rounded-full mb-2 overflow-hidden flex items-center justify-center transition-all duration-300 shadow-md ${selectedCategory === category.name ? 'border-4 border-orange-500' : 'border-2 border-transparent'}`}>
                                                <img src={categoryImages[category.name]} alt={category.name} className="w-full h-full object-cover" />
                                            </div>
                                            <p className={`text-sm font-semibold transition-colors duration-300 ${selectedCategory === category.name ? 'text-orange-600' : 'text-gray-700 group-hover:text-orange-500'}`}>
                                                {category.name}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Restaurant List */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {selectedCategory !== 'All' ? selectedCategory : 'All'} ({filteredRestaurants.length} restaurants)
                                    </h2>
                                </div>

                                {filteredRestaurants.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {filteredRestaurants.map((restaurant) => (
                                            <motion.div
                                                key={restaurant.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                                            >
                                                <div className="relative">
                                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-4xl">{restaurant.name.charAt(0)}</span>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFavorite(restaurant.id);
                                                        }}
                                                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${favorites.has(restaurant.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-red-100'}`}
                                                    >
                                                        <Heart size={16} fill={favorites.has(restaurant.id) ? 'currentColor' : 'none'} />
                                                    </motion.button>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-lg text-gray-800 truncate">{restaurant.name}</h3>
                                                    <p className="text-sm text-gray-500 mb-2 truncate">{restaurant.cuisine}</p>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Star className="text-yellow-400 mr-1 fill-yellow-400" size={14} />
                                                        <span className="font-semibold">{restaurant.rating?.toFixed(1)}</span>
                                                        <span className="mx-2">·</span>
                                                        <span>{restaurant.deliveryTime} min</span>
                                                        <span className="mx-2">·</span>
                                                        <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `₱${restaurant.deliveryFee}`}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No restaurants found matching your criteria.</p>
                                    </div>
                                )}
                            </section>

                            {/* Discover Food */}
                            <section className="mt-16">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Discover Food ({filteredFoodItems.length} items)</h2>
                                {filteredFoodItems.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredFoodItems.map((food) => (
                                            <motion.div
                                                key={food.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                                            >
                                                <div className="relative">
                                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                                        {food.image ? (
                                                            <img
                                                                src={`${PRODUCT_ASSET_URL}/${food.image}`}
                                                                alt={food.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">No Image</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{food.name}</h3>
                                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{food.description || 'Delicious food item'}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-bold text-primary">₱{parseFloat(String(food.price)).toFixed(2)}</span>
                                                        <button className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No food items available at the moment.</p>
                                    </div>
                                )}
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
