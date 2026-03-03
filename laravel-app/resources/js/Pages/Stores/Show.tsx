import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { Search, MapPin, Navigation, Share2, MessageCircle, Star, Package, Loader, Filter, Heart, Store, XCircle } from 'lucide-react';

interface Store {
    id: number;
    name: string;
    logo?: string;
    banner?: string;
    description?: string;
    address?: string;
    client_id?: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
    description?: string;
    category_name?: string;
    rating?: number;
    created_at?: string;
    store_id: number;
    store_name?: string;
    product_type?: string;
    variant_count?: number;
    variants?: any[];
    review_count?: number;
}

const LOGO_ASSET_URL = '/storage/logos';

interface Props {
    store: Store;
    products: Product[];
}

export default function StoreShow({ store: initialStore, products: initialProducts }: Props) {
    const [store] = useState<Store | null>(initialStore);
    const [products] = useState<Product[]>(initialProducts || []);
    const [sortOption, setSortOption] = useState('best-sellers');
    const [searchInput, setSearchInput] = useState('');
    const [isSorting, setIsSorting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Remove the useEffect and fetchStoreData since we get data from props

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category_name).filter(Boolean))];
        return ['all', ...uniqueCategories];
    }, [products]);

    const storeProducts = useMemo(() => {
        let filtered = products;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category_name === selectedCategory);
        }

        if (searchInput) {
            const query = searchInput.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query)) ||
                (p.category_name && p.category_name.toLowerCase().includes(query))
            );
        }

        const sorted = [...filtered];
        switch (sortOption) {
            case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
            case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
            case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'newest': sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()); break;
            case 'best-sellers': default: sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
        }
        return sorted;
    }, [products, searchInput, sortOption, selectedCategory]);

    const handleSortChange = (newSortOption: string) => {
        setIsSorting(true);
        setTimeout(() => {
            setSortOption(newSortOption);
            setIsSorting(false);
        }, 300);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Store link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!store) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <XCircle className="mx-auto text-gray-400 mb-4" size={48} />
                        <h2 className="text-xl font-semibold text-gray-600">Store not found</h2>
                        <p className="text-gray-500 mt-2">The store you're looking for doesn't exist.</p>
                        <Link href="/stores" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                            Browse All Stores
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!store) {
        return (
            <AppLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    Store not found.
                </div>
            </AppLayout>
        );
    }

    const logoUrl = store.logo ? `${LOGO_ASSET_URL}/${store.logo}` : '';

    return (
        <AppLayout>
            <Head title={store.name} />

            <div className="min-h-screen bg-gray-50 pt-16 pb-10">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white shadow-sm border-b"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                                Home
                            </Link>
                            <span className="text-gray-400">/</span>
                            <Link href="/stores" className="text-gray-500 hover:text-blue-600 transition-colors">
                                Stores
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 font-medium">{store.name}</span>
                        </nav>
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Store Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
                    >
                        <div className="relative">
                            <div className="h-64 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                <div className="relative z-10 h-full flex items-end p-8">
                                    <div className="flex items-end gap-6 w-full">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                            className="relative"
                                        >
                                            {logoUrl ? (
                                                <div className="w-32 h-32 rounded-2xl bg-white p-3 shadow-2xl">
                                                    <img
                                                        src={logoUrl}
                                                        alt={store.name}
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 rounded-2xl bg-white p-3 shadow-2xl flex items-center justify-center">
                                                    <Store className="text-4xl text-gray-400" size={48} />
                                                </div>
                                            )}
                                        </motion.div>

                                        <div className="flex-1 text-white">
                                            <motion.h1
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-4xl font-bold mb-3"
                                            >
                                                {store.name}
                                            </motion.h1>
                                            <motion.p
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-blue-100 mb-4 text-lg"
                                            >
                                                {store.description || 'Welcome to our store!'}
                                            </motion.p>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="flex flex-wrap items-center gap-6 text-sm"
                                            >
                                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                                    <MapPin className="text-blue-200" size={16} />
                                                    <span>{store.address || 'Location not available'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                                                    <span>4.8 (324 reviews)</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                                                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                                    <span>Open Now</span>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <motion.button
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.7, type: "spring" }}
                                            onClick={() => setIsLiked(!isLiked)}
                                            className={`p-3 rounded-full transition-all duration-300 ${isLiked
                                                    ? 'bg-red-500 text-white shadow-lg'
                                                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                                                }`}
                                        >
                                            <Heart className={`text-xl ${isLiked ? 'animate-pulse fill-current' : ''}`} size={20} />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 bg-white border-b">
                                <div className="flex flex-wrap gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <MessageCircle className="text-lg" size={20} />
                                        <span>Message Store</span>
                                    </motion.button>

                                    <motion.a
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <Navigation className="text-lg" size={20} />
                                        <span>Get Directions</span>
                                    </motion.a>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <Share2 className="text-lg" size={20} />
                                        <span>Share Store</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Products Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Package className="text-primary text-xl" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Store Products</h2>
                                        <p className="text-gray-600">{storeProducts.length} products available</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${showFilters
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Filter className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} size={20} />
                                    Filters
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search products, categories, or descriptions..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-lg"
                                    />
                                    {searchInput && (
                                        <button
                                            onClick={() => setSearchInput('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <XCircle className="text-xl" size={20} />
                                        </button>
                                    )}
                                </div>

                                {/* Filters */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    >
                                                        {categories.map(category => (
                                                            <option key={category} value={category}>
                                                                {category === 'all' ? 'All Categories' : category}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                                    <select
                                                        value={sortOption}
                                                        onChange={(e) => handleSortChange(e.target.value)}
                                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    >
                                                        <option value="best-sellers">⭐ Best Sellers</option>
                                                        <option value="newest">🆕 Newest First</option>
                                                        <option value="price-asc">💰 Price: Low to High</option>
                                                        <option value="price-desc">💎 Price: High to Low</option>
                                                        <option value="name-asc">🔤 Name: A to Z</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="p-6">
                            <div className="relative min-h-[400px]">
                                <AnimatePresence>
                                    {isSorting && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10 rounded-xl"
                                        >
                                            <div className="text-center">
                                                <Loader className="animate-spin text-primary text-4xl mb-4 mx-auto" size={48} />
                                                <p className="text-gray-600 font-medium">Sorting products...</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    layout
                                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-all duration-300 ${isSorting ? 'blur-sm opacity-50' : ''
                                        }`}
                                >
                                    <AnimatePresence>
                                        {storeProducts.length > 0 ? (
                                            storeProducts.map((product, index) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                                    layout
                                                >
                                                    <ProductCard product={product} size="small" />
                                                </motion.div>
                                            ))
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="col-span-full text-center py-16 px-6"
                                            >
                                                <div className="max-w-md mx-auto">
                                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Package className="text-4xl text-gray-400" size={48} />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                                                        {searchInput || selectedCategory !== 'all'
                                                            ? 'No matching products found'
                                                            : 'No products available'
                                                        }
                                                    </h3>
                                                    <p className="text-gray-500 mb-6">
                                                        {searchInput || selectedCategory !== 'all'
                                                            ? 'Try adjusting your search or filters to find what you\'re looking for.'
                                                            : 'This store hasn\'t listed any products yet. Please check back later!'
                                                        }
                                                    </p>
                                                    {(searchInput || selectedCategory !== 'all') && (
                                                        <button
                                                            onClick={() => {
                                                                setSearchInput('');
                                                                setSelectedCategory('all');
                                                            }}
                                                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                                                        >
                                                            Clear filters
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
