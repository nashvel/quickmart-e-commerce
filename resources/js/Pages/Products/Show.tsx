import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import { Star, X, Truck, Shield, ChevronRight, MessageCircle, Plus, Minus, Home, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { PageProps } from '@/types';
import toast from 'react-hot-toast';

interface Variant {
    id: number;
    sku: string;
    price: string;
    original_price?: string;
    stock: number;
    image?: string;
    image_url?: string;
    attributes?: {
        Color?: string;
        Size?: string;
    };
}

interface Store {
    id: number;
    name: string;
    logo_url?: string;
    owner?: {
        id: number;
    };
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    original_price?: string;
    stock: number;
    image: string;
    rating: number;
    review_count: number;
    product_type: 'simple' | 'variable';
    variants: Variant[];
    store?: Store;
    parent_category_name?: string;
    category_name?: string;
}

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const { addToCart } = useCart();
    const { auth } = usePage<PageProps>().props;
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isConfidenceModalOpen, setConfidenceModalOpen] = useState(false);
    const [isVariantModalOpen, setVariantModalOpen] = useState(false);
    const [isBuyNowMode, setIsBuyNowMode] = useState(false);

    useEffect(() => {
        if (product.product_type === 'variable' && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    const handleVariantSelect = (variant: Variant) => {
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleAddToCart = () => {
        if (product.product_type === 'variable') {
            setIsBuyNowMode(false);
            setVariantModalOpen(true);
        } else {
            addToCart({
                product_id: product.id,
                quantity: 1,
                name: product.name,
                price: product.price,
                image: product.image,
            });
        }
    };

    const handleBuyNow = () => {
        // Check if user is logged in
        if (!auth.user) {
            // Store intent to checkout in sessionStorage
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            toast.error('Please login to continue');
            router.visit('/login');
            return;
        }

        if (product.product_type === 'variable') {
            setIsBuyNowMode(true);
            setVariantModalOpen(true);
        } else {
            addToCart({
                product_id: product.id,
                quantity: 1,
                name: product.name,
                price: product.price,
                image: product.image,
            });
            router.visit('/checkout');
        }
    };

    const handleChat = () => {
        alert('Chat functionality coming soon!');
    };

    const isOutOfStock = (selectedVariant ? selectedVariant.stock : product.stock) === 0;

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'specifications', label: 'Specifications' },
        { id: 'reviews', label: 'Reviews' }
    ];

    const getPrice = (price: string | undefined) => {
        if (!price) return null;
        const num = parseFloat(price);
        return isNaN(num) ? null : num;
    };

    const displayPrice = getPrice(selectedVariant ? selectedVariant.price : product.price);
    const originalPrice = getPrice(selectedVariant?.original_price || product.original_price);
    const displayImage = selectedVariant?.image_url 
        ? `/storage/products/${selectedVariant.image_url}` 
        : `/storage/products/${product.image}`;

    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: 'Products', link: '/products' },
    ];
    if (product.parent_category_name) {
        breadcrumbItems.push({ 
            label: product.parent_category_name, 
            link: `/products?category=${encodeURIComponent(product.parent_category_name)}` 
        });
    }
    if (product.category_name) {
        breadcrumbItems.push({ 
            label: product.category_name, 
            link: `/products?category=${encodeURIComponent(product.category_name)}` 
        });
    }
    breadcrumbItems.push({ label: product.name, link: '' });

    return (
        <AppLayout>
            <Head title={product.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumbs */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {breadcrumbItems.map((item, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                                )}
                                {item.link ? (
                                    <Link
                                        href={item.link}
                                        className="text-sm font-medium text-gray-700 hover:text-blue-600"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-medium text-gray-500">
                                        {item.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Product Image Gallery */}
                    <div className="lg:col-span-2">
                        <img 
                            src={displayImage} 
                            alt={product.name} 
                            className="w-full h-auto object-cover rounded-2xl shadow-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-3 flex flex-col justify-center">
                        <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">
                            {product.name}
                        </h1>
                        
                        <div className="mt-4 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                                ({product.review_count} reviews)
                            </span>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center space-x-4">
                                {displayPrice !== null && (
                                    <p className="text-3xl font-bold text-blue-600">
                                        ₱{displayPrice.toFixed(2)}
                                    </p>
                                )}
                                {originalPrice !== null && (
                                    <p className="text-xl text-gray-500 line-through">
                                        ₱{originalPrice.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {product.product_type === 'simple' && (
                            <div className="mt-4">
                                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                                    product.stock > 0 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </span>
                            </div>
                        )}

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleAddToCart} 
                                disabled={isOutOfStock} 
                                className="w-full py-3 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleBuyNow} 
                                disabled={isOutOfStock} 
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="mt-4">
                            <button 
                                onClick={handleChat} 
                                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" /> Get Assistance
                            </button>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                    <Truck className="w-5 h-5 mr-3 text-blue-500"/>
                                    <span>Estimated delivery: 3-5 business days</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Shield className="w-5 h-5 mr-3 text-blue-500"/>
                                    <span>1-Year Manufacturer Warranty</span>
                                </div>
                            </div>
                            
                            {/* Deals Section */}
                            <div className="mt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Deals</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-teal-50/50 border border-teal-200/60 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-teal-100 text-teal-600 font-bold text-xs p-1 rounded">
                                                VOUCHER
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    Shipping Voucher
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ₱30 off shipping on orders ₱50+
                                                </p>
                                            </div>
                                        </div>
                                        <button className="bg-teal-500 text-white font-bold py-1.5 px-4 rounded-md hover:bg-teal-600 transition-colors text-sm">
                                            Claim
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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

                {/* Tabs for Description, Specs, Reviews */}
                <div className="mt-16">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id 
                                            ? 'border-blue-500 text-blue-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-8">
                        <div key={activeTab}>
                            {activeTab === 'description' && (
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                            {activeTab === 'specifications' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="flex border-b border-gray-200 py-2">
                                        <span className="font-medium text-gray-600 w-1/3">SKU</span>
                                        <span className="text-gray-800">
                                            {selectedVariant ? selectedVariant.sku : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <Reviews productId={product.id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Reviews Component
function Reviews({ productId }: { productId: number }) {
    const [reviews] = useState([
        {
            id: 1,
            author: 'Nash',
            avatar: 'https://i.pravatar.cc/150?u=nash',
            rating: 5,
            comment: 'Great product! High quality and fast delivery. Would definitely recommend to others.',
            likes: 12,
            dislikes: 1,
        },
        {
            id: 2,
            author: 'Vel',
            avatar: 'https://i.pravatar.cc/150?u=vel',
            rating: 4,
            comment: 'Good value for the price. The color is slightly different from the picture, but still nice.',
            likes: 8,
            dislikes: 3,
        },
    ]);

    const [userActions, setUserActions] = useState<Record<number, 'like' | 'dislike' | null>>({});

    const handleAction = (reviewId: number, action: 'like' | 'dislike') => {
        const currentUserAction = userActions[reviewId];
        
        if (action === currentUserAction) {
            setUserActions(prev => ({ ...prev, [reviewId]: null }));
        } else {
            setUserActions(prev => ({ ...prev, [reviewId]: action }));
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
                {reviews.map(review => (
                    <div key={review.id} className="flex items-start">
                        <img 
                            src={review.avatar} 
                            alt={review.author} 
                            className="w-10 h-10 rounded-full mr-4 flex-shrink-0" 
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <div className="font-semibold text-gray-800 text-sm">
                                    {review.author}
                                </div>
                                <div className="flex items-center text-yellow-400">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {review.comment}
                            </p>
                            <div className="flex items-center gap-4 text-gray-500 mt-2">
                                <button 
                                    onClick={() => handleAction(review.id, 'like')}
                                    className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ease-in-out hover:text-blue-600 ${
                                        userActions[review.id] === 'like' ? 'text-blue-600' : 'text-gray-500'
                                    }`}
                                >
                                    👍 {review.likes}
                                </button>
                                <button 
                                    onClick={() => handleAction(review.id, 'dislike')}
                                    className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ease-in-out hover:text-red-600 ${
                                        userActions[review.id] === 'dislike' ? 'text-red-600' : 'text-gray-500'
                                    }`}
                                >
                                    👎 {review.dislikes}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


// Shop Confidence Modal
function ShopConfidenceModal({ onClose }: { onClose: () => void }) {
    const services = [
        {
            icon: '🔄',
            title: 'Free 6-day Returns',
            description: 'Free return within 6 days of receiving your product. Terms & Conditions applied.',
        },
        {
            icon: '❌',
            title: 'Easy Cancellation',
            description: 'Cancel your order instantly with no questions asked before the item is ready to be shipped.',
            learnMore: true,
        },
        {
            icon: '🎧',
            title: 'EcomXpert Support',
            description: 'Dedicated Customer Service to ensure you have a great shopping experience.',
            learnMore: true,
        },
    ];

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-800">Shop with confidence</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-3">Services</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-2xl">💵</div>
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Cash on delivery available
                                    </p>
                                </div>
                            </div>
                            {services.map((service, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="mt-1 text-2xl">{service.icon}</div>
                                    <div>
                                        <p className="font-semibold text-gray-700">{service.title}</p>
                                        <p className="text-sm text-gray-500">{service.description}</p>
                                        {service.learnMore && (
                                            <Link 
                                                href="/help-center" 
                                                onClick={onClose} 
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Learn more
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 mb-3">Return policy</h3>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-2xl">🔄</div>
                            <div>
                                <p className="font-semibold text-gray-700">Return within 6 days</p>
                                <p className="text-sm text-gray-500">
                                    A 6-day return guarantee is applied to faulty EcomXpert products.
                                </p>
                                <Link 
                                    href="/help-center" 
                                    onClick={onClose} 
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Learn more
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Variant Selection Modal
function VariantSelectionModal({ product, onClose, isBuyNowMode = false }: { product: Product; onClose: () => void; isBuyNowMode?: boolean }) {
    const { addToCart } = useCart();
    const { auth } = usePage<PageProps>().props;
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants.length > 0 ? product.variants[0] : null
    );
    const [quantity, setQuantity] = useState(1);

    const handleVariantSelect = (variant: Variant) => {
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleQuantityChange = (amount: number) => {
        setQuantity((prev) => {
            const newQuantity = prev + amount;
            const stock = selectedVariant ? selectedVariant.stock : product.stock;
            if (newQuantity < 1) return 1;
            if (newQuantity > stock) return stock;
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        
        addToCart({
            product_id: product.id,
            variant_id: selectedVariant.id,
            quantity: quantity,
            name: product.name,
            price: selectedVariant.price,
            image: selectedVariant.image || product.image,
        });
        onClose();
    };

    const handleBuyNow = () => {
        if (!selectedVariant) return;
        
        // Check if user is logged in
        if (!auth.user) {
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            toast.error('Please login to continue');
            router.visit('/login');
            return;
        }
        
        addToCart({
            product_id: product.id,
            variant_id: selectedVariant.id,
            quantity: quantity,
            name: product.name,
            price: selectedVariant.price,
            image: selectedVariant.image || product.image,
        });
        router.visit('/checkout');
    };

    const getPrice = (price: string | undefined) => {
        if (!price) return null;
        const num = parseFloat(price);
        return isNaN(num) ? null : num;
    };

    const displayPrice = getPrice(selectedVariant ? selectedVariant.price : product.price);
    const originalPrice = getPrice(selectedVariant?.original_price);
    const displayStock = selectedVariant ? selectedVariant.stock : product.stock;
    const displayImage = selectedVariant?.image 
        ? `/storage/products/${selectedVariant.image}` 
        : `/storage/products/${product.image}`;

    const isOutOfStock = displayStock === 0;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-2xl p-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start space-x-4 mb-4">
                    <div className="w-24 h-24 cursor-pointer">
                        <img 
                            src={displayImage} 
                            alt={product.name} 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23ddd" width="96" height="96"/%3E%3C/svg%3E';
                            }}
                        />
                    </div>
                    <div className="pt-4">
                        <div className="flex items-baseline space-x-2">
                            {displayPrice !== null && (
                                <p className="text-xl font-bold text-blue-600">
                                    ₱{displayPrice.toFixed(2)}
                                </p>
                            )}
                            {originalPrice !== null && (
                                <p className="text-sm text-gray-500 line-through">
                                    ₱{originalPrice.toFixed(2)}
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Stock: {displayStock}</p>
                        {selectedVariant && (
                            <>
                                <p className="text-sm text-gray-500 mt-1">
                                    SKU: {selectedVariant.sku || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Size: {selectedVariant.attributes?.Size || 'N/A'}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {product.product_type === 'variable' && product.variants && (
                    <div className="mb-4">
                        <h3 className="text-md font-semibold mb-2">Color</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant) => (
                                <div
                                    key={variant.id}
                                    onClick={() => handleVariantSelect(variant)}
                                    className={`cursor-pointer border-2 p-2 rounded-lg flex flex-col items-center ${
                                        selectedVariant?.id === variant.id 
                                            ? 'border-blue-500' 
                                            : 'border-transparent'
                                    }`}
                                    style={{ opacity: variant.stock === 0 ? 0.5 : 1 }}
                                >
                                    <img 
                                        src={`/storage/products/${variant.image || product.image}`}
                                        alt={variant.attributes?.Color || 'Variant'}
                                        className="w-16 h-16 object-cover rounded-md mb-2"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3C/svg%3E';
                                        }}
                                    />
                                    <p className="text-sm text-center">
                                        {variant.attributes?.Color || 'N/A'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-md font-semibold">Quantity</h3>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                            onClick={() => handleQuantityChange(-1)} 
                            className="p-2 text-gray-600"
                        >
                            -
                        </button>
                        <span className="px-4 py-1 font-semibold">{quantity}</span>
                        <button 
                            onClick={() => handleQuantityChange(1)} 
                            className="p-2 text-gray-600"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="w-full py-3 bg-blue-100 text-blue-600 font-semibold rounded-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        Add to Cart
                    </button>
                    <button 
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
