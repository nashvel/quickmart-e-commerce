import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';
import { Product, ProductVariant } from '@/types/product';
import { PageProps } from '@/types';
import toast from 'react-hot-toast';

interface VariantSelectionModalProps {
    product: Product;
    onClose: () => void;
    isBuyNowMode?: boolean;
}

export default function VariantSelectionModal({
    product,
    onClose,
    isBuyNowMode = false,
}: VariantSelectionModalProps) {
    const { addToCart } = useCart();
    const { auth } = usePage<PageProps>().props;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants[0] || null
    );
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart({
            product_id: product.id,
            variant_id: selectedVariant.id,
            quantity,
            name: product.name,
            price: selectedVariant.price,
            image: selectedVariant.image_url || product.image,
        });

        toast.success('Added to cart!');
        onClose();
    };

    const handleBuyNow = () => {
        if (!auth.user) {
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            toast.error('Please login to continue');
            router.visit('/login');
            return;
        }

        if (!selectedVariant) return;

        addToCart({
            product_id: product.id,
            variant_id: selectedVariant.id,
            quantity,
            name: product.name,
            price: selectedVariant.price,
            image: selectedVariant.image_url || product.image,
        });

        router.visit('/checkout');
    };

    const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : true;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Select Variant</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Variants */}
                    <div className="space-y-4 mb-6">
                        {product.variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                                    selectedVariant?.id === variant.id
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {variant.attributes?.Color} - {variant.attributes?.Size}
                                        </p>
                                        <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                                        <p className="text-sm text-gray-600">
                                            Stock: {variant.stock > 0 ? variant.stock : 'Out of stock'}
                                        </p>
                                    </div>
                                    <p className="text-xl font-bold text-primary-600">
                                        ₱{parseFloat(variant.price).toFixed(2)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quantity
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                            <button
                                onClick={() =>
                                    setQuantity(
                                        Math.min(selectedVariant?.stock || 1, quantity + 1)
                                    )
                                }
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                disabled={quantity >= (selectedVariant?.stock || 0)}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {!isBuyNowMode && (
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Add to Cart
                            </button>
                        )}
                        <button
                            onClick={handleBuyNow}
                            disabled={isOutOfStock}
                            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
