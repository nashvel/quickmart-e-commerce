import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Product } from '@/types/product';
import toast from 'react-hot-toast';

// Components
import ProductBreadcrumb from './components/ProductBreadcrumb';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import ShopConfidenceModal from './components/ShopConfidenceModal';
import VariantSelectionModal from './components/VariantSelectionModal';
import MiniChatPopup from '@/Components/Chat/MiniChatPopup';

// Hooks
import { useProduct } from '@/hooks/useProduct';

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [isConfidenceModalOpen, setConfidenceModalOpen] = useState(false);
    const [isVariantModalOpen, setVariantModalOpen] = useState(false);
    const [isBuyNowMode, setIsBuyNowMode] = useState(false);
    const [showMiniChat, setShowMiniChat] = useState(false);

    const {
        selectedVariant,
        displayPrice,
        originalPrice,
        displayImage,
        isOutOfStock,
        handleAddToCart,
        handleBuyNow,
    } = useProduct(product);

    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: 'Products', link: '/products' },
        ...(product.parent_category_name
            ? [{ label: product.parent_category_name, link: '/products' }]
            : []),
        ...(product.category_name
            ? [{ label: product.category_name, link: '/products' }]
            : []),
        { label: product.name, link: '#' },
    ];

    const onAddToCart = () => {
        if (product.product_type === 'variable') {
            setIsBuyNowMode(false);
            setVariantModalOpen(true);
        } else {
            handleAddToCart();
        }
    };

    const onBuyNow = () => {
        if (product.product_type === 'variable') {
            setIsBuyNowMode(true);
            setVariantModalOpen(true);
        } else {
            handleBuyNow();
        }
    };

    const onChat = () => {
        if (!auth.user) {
            toast.error('Please login to chat with seller');
            return;
        }
        setShowMiniChat(true);
    };

    // Create product with current variant info for chat attachment
    const productForChat = {
        ...product,
        price: selectedVariant ? selectedVariant.price : product.price,
        stock: selectedVariant ? selectedVariant.stock : product.stock,
        image: selectedVariant?.image_url || product.image,
    };

    return (
        <AppLayout>
            <Head title={product.name} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductBreadcrumb items={breadcrumbItems} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <ProductImage src={displayImage} alt={product.name} />
                        <ProductInfo
                            product={product}
                            displayPrice={displayPrice}
                            originalPrice={originalPrice}
                            isOutOfStock={isOutOfStock}
                            onAddToCart={onAddToCart}
                            onBuyNow={onBuyNow}
                            onChat={onChat}
                        />
                    </div>

                    <ProductTabs description={product.description} productId={product.id} />
                </div>
            </div>

            {/* Modals */}
            {isConfidenceModalOpen && (
                <ShopConfidenceModal onClose={() => setConfidenceModalOpen(false)} />
            )}

            {isVariantModalOpen && (
                <VariantSelectionModal
                    product={product}
                    onClose={() => setVariantModalOpen(false)}
                    isBuyNowMode={isBuyNowMode}
                />
            )}

            {/* Mini Chat Popup */}
            <AnimatePresence>
                {showMiniChat && product.store && (
                    <MiniChatPopup
                        store={product.store}
                        currentUserId={auth.user?.id || 0}
                        onClose={() => setShowMiniChat(false)}
                        attachedProduct={productForChat}
                    />
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
