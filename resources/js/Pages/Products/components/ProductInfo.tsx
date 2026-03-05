import { Star, MessageCircle } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductInfoProps {
    product: Product;
    displayPrice: number | null;
    originalPrice: number | null;
    isOutOfStock: boolean;
    onAddToCart: () => void;
    onBuyNow: () => void;
    onChat: () => void;
}

export default function ProductInfo({
    product,
    displayPrice,
    originalPrice,
    isOutOfStock,
    onAddToCart,
    onBuyNow,
    onChat,
}: ProductInfoProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={20}
                            className={
                                i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                            }
                        />
                    ))}
                    <span className="ml-2 text-gray-600">
                        {product.rating} ({product.review_count} reviews)
                    </span>
                </div>
            </div>

            {/* Price */}
            <div className="mb-6">
                {displayPrice !== null && (
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-primary-600">
                            ₱{displayPrice.toFixed(2)}
                        </span>
                        {originalPrice && originalPrice > displayPrice && (
                            <>
                                <span className="text-xl text-gray-400 line-through">
                                    ₱{originalPrice.toFixed(2)}
                                </span>
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                                    {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% OFF
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
                {isOutOfStock ? (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                ) : (
                    <span className="text-green-600 font-semibold">In Stock</span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={onAddToCart}
                    disabled={isOutOfStock}
                    className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Add to Cart
                </button>
                <button
                    onClick={onBuyNow}
                    disabled={isOutOfStock}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Buy Now
                </button>
                <button
                    onClick={onChat}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                    <MessageCircle size={20} />
                    Chat with Seller
                </button>
            </div>

            {/* Store Info */}
            {product.store && (
                <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Sold by</h3>
                    <div className="flex items-center gap-3">
                        {product.store.logo_url && (
                            <img
                                src={product.store.logo_url}
                                alt={product.store.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        )}
                        <span className="font-medium text-gray-900">{product.store.name}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
