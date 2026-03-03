import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, FormEventHandler, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PageProps } from '@/types';
import { useCart } from '@/contexts/CartContext';

// Components
import CheckoutProgress from './components/CheckoutProgress';
import AddressSection from './components/AddressSection';
import ShippingSection from './components/ShippingSection';
import PaymentSection from './components/PaymentSection';
import OrderSummary from './components/OrderSummary';
import ShippingModal from './components/ShippingModal';
import PaymentModal from './components/PaymentModal';
import AddAddressModal from './components/AddAddressModal';

interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: string;
    quantity: number;
    image: string;
    addOns?: AddOn[];
}

interface AddOn {
    addon_name?: string;
    name?: string;
    variant_value?: string;
    variant_name?: string;
    price: string;
    quantity: number;
    addon_image?: string;
    image?: string;
}

interface StoreGroup {
    storeName: string;
    items: CartItem[];
}

interface GroupedCart {
    [storeId: string]: StoreGroup;
}

interface Address {
    id: number;
    name?: string;
    address_line: string;
    address_line_1?: string;
    address_line_2?: string;
    city: string;
    province: string;
    postal_code?: string;
    type?: 'home' | 'work' | 'other';
    latitude?: number;
    longitude?: number;
}

interface Props {
    groupedCart?: GroupedCart;
    subtotal?: number;
    addresses?: Address[];
}

export default function Checkout({ groupedCart = {}, subtotal = 0, addresses = [] }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { cartItems, clearCart } = useCart();
    const [shippingOption, setShippingOption] = useState<'door_to_door' | 'pickup'>('door_to_door');
    const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(
        addresses && addresses.length > 0 ? addresses[0] : null
    );
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
    const [userAddresses, setUserAddresses] = useState<Address[]>(addresses || []);

    // Calculate subtotal from cart items
    const calculatedSubtotal = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    // Handle address added
    const handleAddressAdded = (newAddress: Address) => {
        // Add the new address to the addresses array
        setUserAddresses(prev => [...prev, newAddress]);
        // Set it as the selected address
        setDeliveryAddress(newAddress);
    };

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!auth.user) {
            toast.error('Please login to proceed with checkout', {
                duration: 3000,
                position: 'top-right',
            });
            router.visit('/login');
        }
    }, [auth.user]);

    const shippingFee = shippingOption === 'door_to_door' ? 50.00 : 0.00;
    const total = calculatedSubtotal + shippingFee;

    const isAddressComplete = deliveryAddress && deliveryAddress.id;
    const isShippingComplete = shippingOption;
    const isPaymentComplete = shippingOption === 'pickup' || paymentMethod;

    const handleCheckout: FormEventHandler = async (e) => {
        e.preventDefault();
        
        if (!isAddressComplete || !isShippingComplete || !isPaymentComplete) {
            toast.error('Please complete all required fields', {
                duration: 3000,
                position: 'top-right',
            });
            return;
        }

        // Check if cart has items
        if (cartItems.length === 0) {
            toast.error('Your cart is empty. Please add items before checkout.', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Sending cart data:', cartItems); // Debug log
            
            const response = await axios.post('/api/checkout', {
                address_id: deliveryAddress?.id,
                shipping_option: shippingOption,
                payment_method: paymentMethod,
                cart_items: cartItems,
                subtotal: calculatedSubtotal,
            });

            if (response.data.success) {
                // Show success toast
                toast.success(response.data.message || 'Order placed successfully!', {
                    duration: 3000,
                    position: 'top-right',
                });
                
                // Clear the cart using the cart context
                clearCart();
                
                // Redirect to the order details page
                router.visit(response.data.redirect_url || '/orders');
            } else {
                toast.error(response.data.message || 'Checkout failed', {
                    duration: 4000,
                    position: 'top-right',
                });
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            console.log('Error response:', error.response?.data); // Debug log
            
            // Show error toast with specific message
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                toast.error(errorMessages.join(', '), {
                    duration: 4000,
                    position: 'top-right',
                });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message, {
                    duration: 4000,
                    position: 'top-right',
                });
            } else {
                toast.error('An error occurred during checkout. Please try again.', {
                    duration: 4000,
                    position: 'top-right',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Checkout" />

            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Compact Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Checkout</h1>
                        
                        {/* Compact Progress Indicator */}
                        <CheckoutProgress
                            isAddressComplete={!!isAddressComplete}
                            isShippingComplete={!!isShippingComplete}
                            isPaymentComplete={!!isPaymentComplete}
                        />
                    </div>

                    <form className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6" onSubmit={handleCheckout}>
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Address Section */}
                            <AddressSection
                                addresses={userAddresses}
                                deliveryAddress={deliveryAddress}
                                isAddressComplete={!!isAddressComplete}
                                onAddressSelect={setDeliveryAddress}
                                onAddAddressClick={() => setIsAddAddressModalOpen(true)}
                            />

                            {/* Shipping Section */}
                            <ShippingSection
                                shippingOption={shippingOption}
                                isShippingComplete={!!isShippingComplete}
                                onShippingModalOpen={() => setIsShippingModalOpen(true)}
                            />

                            {/* Payment Section */}
                            {shippingOption === 'door_to_door' && (
                                <PaymentSection
                                    paymentMethod={paymentMethod}
                                    isPaymentComplete={!!isPaymentComplete}
                                    onPaymentModalOpen={() => setIsPaymentModalOpen(true)}
                                />
                            )}
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <OrderSummary
                                groupedCart={groupedCart}
                                subtotal={calculatedSubtotal}
                                shippingOption={shippingOption}
                                shippingFee={shippingFee}
                                total={total}
                                cartItems={cartItems}
                            />
                        </div>
                    
                        {/* Bottom Buttons */}
                        <div className="lg:col-span-3 flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t-2 border-gray-200 gap-4">
                            <button 
                                type="button" 
                                onClick={() => router.visit('/cart')} 
                                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-400 hover:shadow-md transform hover:-translate-y-0.5"
                            >
                                Back to Cart
                            </button>
                            <button 
                                type="submit" 
                                className={`w-full sm:w-auto flex items-center justify-center px-10 py-4 rounded-xl font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1 hover:shadow-xl ${
                                    isSubmitting 
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : (isAddressComplete && isShippingComplete && isPaymentComplete)
                                            ? 'bg-primary text-white hover:bg-primary-dark'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                }`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-3 w-5 h-5" />
                                        Placing Order...
                                    </> 
                                ) : (
                                    <>
                                        {(isAddressComplete && isShippingComplete && isPaymentComplete) && <CheckCircle className="mr-3 w-5 h-5" />}
                                        Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modals */}
            {isShippingModalOpen && (
                <ShippingModal
                    selectedOption={shippingOption}
                    onSelect={setShippingOption}
                    onClose={() => setIsShippingModalOpen(false)}
                />
            )}

            {isPaymentModalOpen && (
                <PaymentModal
                    selectedOption={paymentMethod}
                    onSelect={setPaymentMethod}
                    onClose={() => setIsPaymentModalOpen(false)}
                />
            )}

            <AddAddressModal
                isOpen={isAddAddressModalOpen}
                onClose={() => setIsAddAddressModalOpen(false)}
                onAddressAdded={handleAddressAdded}
            />
        </AppLayout>
    );
}