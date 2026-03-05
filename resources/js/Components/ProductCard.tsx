import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Star, Heart, Eye, Store, Tag } from 'lucide-react';
import { getProductImageUrl, ASSET_URLS } from '@/config/assets';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
    store_name?: string;
    product_type?: string;
    variant_count?: number;
    variants?: any[];
    rating?: number;
    review_count?: number;
}

interface Props {
    product: Product;
    size?: 'normal' | 'small';
}

const getStockStatus = (stock: number) => {
    if (stock > 10) return { text: 'In Stock', className: 'bg-green-100 text-green-800' };
    if (stock > 0) return { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Out of Stock', className: 'bg-red-100 text-red-800' };
};

const calculateTotalStock = (product: Product) => {
    const { stock, product_type, variants } = product;
    
    if (product_type === 'variable' && variants && variants.length > 0) {
        return variants.reduce((total, variant) => {
            const variantStock = parseInt(variant.stock) || 0;
            return total + variantStock;
        }, 0);
    }
    
    return parseInt(String(stock)) || 0;
};

export default function ProductCard({ product, size = 'normal' }: Props) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    if (!product) {
        return null;
    }

    const { id, name, price, image, store_name, product_type, variants, rating, review_count } = product;
    const totalStock = calculateTotalStock(product);
    const stockStatus = getStockStatus(totalStock);
    const isSmall = size === 'small';

    const getDisplayPrice = () => {
        if (product_type === 'variable' && variants && variants.length > 0) {
            const prices = variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
            if (prices.length > 0) {
                const minPrice = Math.min(...prices);
                return `₱${minPrice.toFixed(2)}`;
            }
        }
        
        const productPrice = parseFloat(String(price));
        if (!isNaN(productPrice)) {
            return `₱${productPrice.toFixed(2)}`;
        }
        
        return 'Price not available';
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Link 
                href={`/products/${id}`}
                className={`block bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 h-full flex flex-col ${isSmall ? 'w-full' : 'max-w-sm'}`}
            >
                {/* Image Container */}
                <div className={`relative overflow-hidden ${isSmall ? 'h-32' : 'h-44'}`}>
                    {/* Store Badge */}
                    {store_name && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-3 left-3 z-20"
                        >
                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                <Store className="text-primary" size={14} />
                                <span>{store_name}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div 
                        className="absolute top-3 right-3 z-20 flex flex-col gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLikeClick}
                            className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${
                                isLiked 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500'
                            }`}
                        >
                            <Heart className={`${isLiked ? 'animate-pulse fill-current' : ''}`} size={14} />
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleQuickView}
                            className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-primary rounded-full shadow-lg transition-all duration-200"
                        >
                            <Eye size={14} />
                        </motion.button>
                    </motion.div>

                    {/* Product Image */}
                    <div className="relative w-full h-full bg-gray-100">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <img 
                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            src={getProductImageUrl(image)}
                            alt={name}
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.currentTarget.src = ASSET_URLS.PLACEHOLDERS.PRODUCT;
                                setImageLoaded(true);
                            }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg ${
                            stockStatus.className
                        } bg-opacity-90 backdrop-blur-sm`}>
                            <div className={`w-2 h-2 rounded-full ${
                                totalStock > 10 ? 'bg-green-500' : totalStock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            } animate-pulse`}></div>
                            {stockStatus.text}
                        </span>
                    </div>

                    {/* Variant Badge */}
                    {product_type === 'variable' && variants && variants.length > 0 && (
                        <div className="absolute bottom-3 right-3 z-10">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg bg-purple-500/90 text-white backdrop-blur-sm">
                                <Tag size={12} />
                                {variants.length} variants
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={`flex-1 flex flex-col ${isSmall ? 'p-3' : 'p-4'}`}>
                    {/* Product Name */}
                    <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 ${
                        isSmall ? 'text-sm leading-tight min-h-[2rem]' : 'text-base leading-tight min-h-[2.5rem]'
                    }`}>
                        {name}
                    </h3>

                    {/* Rating */}
                    <div className={`mb-2 ${isSmall ? 'min-h-[1rem]' : 'min-h-[1.25rem]'}`}>
                        {rating ? (
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={12}
                                            className={`${
                                                i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                            }`} 
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                    {rating.toFixed(1)} ({review_count || 0})
                                </span>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400">No reviews yet</div>
                        )}
                    </div>

                    {/* Spacer to push price to bottom */}
                    <div className="flex-1"></div>

                    {/* Price */}
                    <div className="mt-auto">
                        <div className="flex items-center gap-1">
                            {product_type === 'variable' && variants && variants.length > 0 && (
                                <span className="text-xs text-gray-500 font-medium">From</span>
                            )}
                            <p className={`font-bold text-primary ${
                                isSmall ? 'text-base' : 'text-lg'
                            }`}>
                                {getDisplayPrice()}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
