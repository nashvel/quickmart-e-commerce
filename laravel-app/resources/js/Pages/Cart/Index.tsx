import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Props extends PageProps {}

export default function CartIndex({ auth }: Props) {
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        if (!auth.user) {
            toast.error('Please login to checkout');
            router.visit('/login');
            return;
        }
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        router.visit('/checkout');
    };

    return (
        <AppLayout>
            <Head title="Shopping Cart" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center p-8 md:p-16 bg-gray-50 rounded-xl"
                        >
                            <ShoppingCart className="mx-auto h-20 w-20 text-gray-300" />
                            <h2 className="mt-6 text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
                            <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                            <button
                                onClick={() => router.visit('/products')}
                                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105"
                            >
                                Start Shopping <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item, index) => (
                                    <div key={`${item.product_id}-${item.variant_id || 'simple'}-${index}`} className="bg-white rounded-lg shadow p-6">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                                                <img
                                                    src={`/storage/products/${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23ddd" width="96" height="96"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                                                <p className="text-primary font-semibold">₱{parseFloat(item.price).toFixed(2)} each</p>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={() => removeFromCart(item.product_id, item.variant_id)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                                                        className="w-8 h-8 rounded border hover:bg-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                                                        className="w-8 h-8 rounded border hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="text-lg font-bold">₱{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery Fee</span>
                                            <span className="font-semibold">₱{deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-lg font-bold text-primary">₱{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
