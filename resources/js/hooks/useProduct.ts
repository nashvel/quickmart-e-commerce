import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';
import { Product, ProductVariant } from '@/types/product';
import { PageProps } from '@/types';
import toast from 'react-hot-toast';

export function useProduct(product: Product) {
    const { addToCart } = useCart();
    const { auth } = usePage<PageProps>().props;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product.product_type === 'variable' && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleAddToCart = (onSuccess?: () => void) => {
        if (product.product_type === 'simple') {
            addToCart({
                product_id: product.id,
                quantity: 1,
                name: product.name,
                price: product.price,
                image: product.image,
            });
            onSuccess?.();
        }
    };

    const handleBuyNow = (onSuccess?: () => void) => {
        if (!auth.user) {
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            toast.error('Please login to continue');
            router.visit('/login');
            return;
        }

        if (product.product_type === 'simple') {
            addToCart({
                product_id: product.id,
                quantity: 1,
                name: product.name,
                price: product.price,
                image: product.image,
            });
            router.visit('/checkout');
        } else {
            onSuccess?.();
        }
    };

    const getPrice = (price: string | undefined): number | null => {
        if (!price) return null;
        const num = parseFloat(price);
        return isNaN(num) ? null : num;
    };

    const displayPrice = getPrice(selectedVariant ? selectedVariant.price : product.price);
    const originalPrice = getPrice(selectedVariant?.original_price || product.original_price);
    const displayImage = selectedVariant?.image_url
        ? `/storage/products/${selectedVariant.image_url}`
        : `/storage/products/${product.image}`;
    const isOutOfStock = (selectedVariant ? selectedVariant.stock : product.stock) === 0;

    return {
        selectedVariant,
        quantity,
        displayPrice,
        originalPrice,
        displayImage,
        isOutOfStock,
        setQuantity,
        handleVariantSelect,
        handleAddToCart,
        handleBuyNow,
    };
}
