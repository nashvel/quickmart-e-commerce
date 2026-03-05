import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Laptop, Shirt, Home, Book, Dumbbell, Utensils } from 'lucide-react';
import axios from 'axios';
import ProductCard from '@/Components/ProductCard';
import ProductCardSkeleton from '@/Components/ProductCardSkeleton';
import ScrollToTopButton from '@/Components/ScrollToTopButton';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
    store_name: string;
    product_type: string;
    variant_count?: number;
    variants?: any[];
    rating?: number;
    review_count?: number;
}

interface ActiveFilter {
    type: string;
    value: string;
    label: string;
    key: string;
}

export default function ProductsIndex(): JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('best-sellers');
    const [visibleCount, setVisibleCount] = useState(20);
    const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
    const [onDeal, setOnDeal] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
    const [searchSuggestion, setSearchSuggestion] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, sortOption, selectedCategory, onDeal, priceRange]);

    useEffect(() => {
        updateActiveFilters();
    }, [selectedCategory, onDeal, priceRange]);

    const updateActiveFilters = () => {
        const filters: ActiveFilter[] = [];
        
        if (selectedCategory !== 'All Products') {
            filters.push({ 
                type: 'category', 
                value: selectedCategory, 
                label: selectedCategory, 
                key: `cat-${selectedCategory}` 
            });
        }
        
        if (onDeal) {
            filters.push({ 
                type: 'on_deal', 
                value: 'true', 
                label: 'On Deal', 
                key: 'deal' 
            });
        }
        
        if (priceRange.min && priceRange.max) {
            filters.push({ 
                type: 'price', 
                value: `${priceRange.min}-${priceRange.max}`, 
                label: `₱${priceRange.min} - ₱${priceRange.max}`, 
                key: 'price' 
            });
        }
        
        setActiveFilters(filters);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products', {
                params: {
                    perPage: 50,
                    store_type: 'convenience',
                    search: searchTerm,
                    sort: sortOption,
                    category: selectedCategory !== 'All Products' ? selectedCategory : undefined,
                    on_deal: onDeal || undefined,
                    min_price: priceRange.min || undefined,
                    max_price: priceRange.max || undefined,
                }
            });

            if (response.data && Array.isArray(response.data.products)) {
                setProducts(response.data.products);
                
                // Simple search suggestion logic
                if (searchTerm && response.data.products.length === 0) {
                    const suggestions = ['electronics', 'fashion', 'books', 'foods', 'home', 'sports'];
                    const suggestion = suggestions.find(s => 
                        s.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        searchTerm.toLowerCase().includes(s.toLowerCase())
                    );
                    setSearchSuggestion(suggestion || '');
                } else {
                    setSearchSuggestion('');
                }
            } else {
                setError('Received invalid product data from the server.');
                setProducts([]);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Failed to fetch products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
    };

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const removeFilter = (filter: ActiveFilter) => {
        if (filter.type === 'category') {
            setSelectedCategory('All Products');
        } else if (filter.type === 'on_deal') {
            setOnDeal(false);
        } else if (filter.type === 'price') {
            setPriceRange({ min: '', max: '' });
        }
    };

    const clearAllFilters = () => {
        setSelectedCategory('All Products');
        setOnDeal(false);
        setPriceRange({ min: '', max: '' });
        setSearchTerm('');
    };

    const mainCategories = [
        { name: 'Electronics', icon: Laptop, children: ['Computers & Accessories', 'Headphones', 'Cameras & Photography', 'Smartphones & Tablets'] },
        { name: 'Fashion', icon: Shirt, children: ['Females Wear', 'Mens Wear', 'Childrens Wear', 'Shoes'] },
        { name: 'Home & Kitchen', icon: Home, children: [] },
        { name: 'Books', icon: Book, children: [] },
        { name: 'Sports & Outdoor', icon: Dumbbell, children: [] },
        { name: 'Foods', icon: Utensils, children: [] },
    ];

    return (
        <AppLayout>
            <Head title="Shop" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 min-h-screen"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Sidebar */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                {loading ? (
                                    <>
                                        {/* Categories Skeleton */}
                                        <div className="mb-6">
                                            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                                            <div className="space-y-2">
                                                {[...Array(7)].map((_, i) => (
                                                    <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Filters Skeleton */}
                                        <div className="border-t pt-6">
                                            <div className="h-6 bg-gray-200 rounded w-16 mb-4 animate-pulse"></div>
                                            <div className="space-y-4">
                                                <div className="h-5 bg-gray-100 rounded w-20 animate-pulse"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                                                    <div className="flex gap-2">
                                                        <div className="h-10 bg-gray-100 rounded-lg flex-1 animate-pulse"></div>
                                                        <div className="h-10 bg-gray-100 rounded-lg flex-1 animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Categories */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => setSelectedCategory('All Products')}
                                                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                                                        selectedCategory === 'All Products'
                                                            ? 'bg-blue-50 text-primary font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    All Products
                                                </button>
                                                {mainCategories.map((category) => {
                                                    const IconComponent = category.icon;
                                                    return (
                                                    <div key={category.name}>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCategory(category.name);
                                                                if (category.children.length > 0) {
                                                                    toggleCategory(mainCategories.indexOf(category));
                                                                }
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                                                                selectedCategory === category.name
                                                                    ? 'bg-blue-50 text-primary font-semibold'
                                                                    : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                <IconComponent className="w-5 h-5" />
                                                                <span>{category.name}</span>
                                                            </span>
                                                            {category.children.length > 0 && (
                                                                expandedCategories.includes(mainCategories.indexOf(category)) ? (
                                                                    <ChevronUp className="text-xs" size={16} />
                                                                ) : (
                                                                    <ChevronDown className="text-xs" size={16} />
                                                                )
                                                            )}
                                                        </button>
                                                        {category.children.length > 0 && expandedCategories.includes(mainCategories.indexOf(category)) && (
                                                            <div className="ml-4 mt-1 space-y-1">
                                                                {category.children.map((child) => (
                                                                    <button
                                                                        key={child}
                                                                        onClick={() => setSelectedCategory(child)}
                                                                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                                                                            selectedCategory === child
                                                                                ? 'bg-blue-50 text-primary font-medium'
                                                                                : 'text-gray-600 hover:bg-gray-50'
                                                                        }`}
                                                                    >
                                                                        {child}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )})}

                                            </div>
                                        </div>

                                        {/* Filters */}
                                        <div className="border-t pt-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
                                            
                                            {/* On Deal Toggle */}
                                            <div className="mb-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={onDeal}
                                                        onChange={(e) => setOnDeal(e.target.checked)}
                                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">On Deal</span>
                                                </label>
                                            </div>

                                            {/* Price Range */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h4>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={priceRange.min}
                                                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                                    />
                                                    <span className="text-gray-500">-</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={priceRange.max}
                                                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1">
                            {/* Search and Sort */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                                {loading ? (
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <div className="h-12 bg-gray-100 rounded-full flex-grow w-full animate-pulse"></div>
                                        <div className="h-12 bg-gray-100 rounded-full w-full md:w-48 animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <form onSubmit={handleSearchSubmit} className="relative flex-grow w-full">
                                            <Search className="absolute top-3 left-4 text-gray-400 pointer-events-none" size={20} />
                                            <div className="w-full bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-primary shadow-sm min-h-[52px] flex flex-wrap items-center gap-2 pl-12 pr-4 py-2">
                                                {/* Active Filters inside search bar */}
                                                <AnimatePresence>
                                                    {activeFilters.map(filter => (
                                                        <motion.span
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            transition={{
                                                                opacity: { duration: 0.15 },
                                                                scale: { duration: 0.15 },
                                                                layout: { duration: 0.2, ease: 'easeInOut' }
                                                            }}
                                                            key={filter.key}
                                                            className="bg-blue-100 text-primary font-semibold px-2.5 py-1 rounded-full text-xs flex items-center shadow-sm flex-shrink-0"
                                                        >
                                                            {filter.label}
                                                            <button 
                                                                onClick={() => removeFilter(filter)} 
                                                                className="ml-1.5 text-primary hover:bg-blue-200 rounded-full p-0.5"
                                                                type="button"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </motion.span>
                                                    ))}
                                                </AnimatePresence>
                                                <input
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none focus:ring-0 p-1"
                                                />
                                            </div>
                                        </form>
                                        <div className="w-full md:w-auto flex-shrink-0">
                                            <select 
                                                value={sortOption} 
                                                onChange={handleSortChange} 
                                                className="w-full p-3 border border-gray-200 bg-white rounded-full focus:ring-2 focus:ring-primary focus:outline-none h-[52px]"
                                            >
                                                <option value="best-sellers">Best Sellers</option>
                                                <option value="price-asc">Price: Low to High</option>
                                                <option value="price-desc">Price: High to Low</option>
                                                <option value="name-asc">Name: A-Z</option>
                                                <option value="name-desc">Name: Z-A</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Suggestion */}
                            {searchSuggestion && (
                                <div className="mb-4 text-sm text-gray-600">
                                    Did you mean:{" "}
                                    <button
                                        onClick={() => handleSuggestionClick(searchSuggestion)}
                                        className="text-primary font-semibold hover:underline"
                                    >
                                        {searchSuggestion}
                                    </button>
                                    ?
                                </div>
                            )}

                            {/* Products Grid */}
                            <div className="relative min-h-[400px]">
                                <AnimatePresence>
                                    {loading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg"
                                        >
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {loading ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
                                    </div>
                                ) : error ? (
                                    <div className="bg-white rounded-lg p-8 text-center">
                                        <p className="text-red-500">Error: {error}</p>
                                        <button
                                            onClick={fetchProducts}
                                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : products.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {products.slice(0, visibleCount).map(product => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                        {visibleCount < products.length && (
                                            <div className="text-center mt-10">
                                                <button 
                                                    onClick={() => setVisibleCount(prev => prev + 20)}
                                                    className="bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-md"
                                                >
                                                    Load More
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-white rounded-lg p-12 text-center">
                                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                                        <p className="text-gray-500">Try adjusting your filters or search term.</p>
                                        {searchSuggestion && (
                                            <p className="text-gray-500 mt-2">
                                                Or try searching for:{" "}
                                                <button
                                                    onClick={() => handleSuggestionClick(searchSuggestion)}
                                                    className="text-primary font-semibold hover:underline"
                                                >
                                                    {searchSuggestion}
                                                </button>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </motion.div>
            <ScrollToTopButton />
        </AppLayout>
    );
}