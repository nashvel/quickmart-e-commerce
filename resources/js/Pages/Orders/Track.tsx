import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState, useEffect } from 'react';
import { ShoppingBag, Settings, Truck, Home, Clock, Receipt, ChevronDown } from 'lucide-react';

interface OrderItem {
    name: string;
    quantity: number;
    price: string;
}

interface Rider {
    name: string;
}

interface Customer {
    latitude?: number;
    longitude?: number;
}

interface Order {
    id: number;
    status: 'pending' | 'processing' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
    created_at: string;
    estimated_delivery_time?: string;
    items: OrderItem[];
    rider?: Rider;
    customer?: Customer;
}

interface Props {
    order: Order;
}

interface TrackingStep {
    name: string;
    date?: string;
    icon: typeof ShoppingBag;
    isCompleted: boolean;
}

function MapPlaceholder({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100 text-gray-600 rounded-lg">
            <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">Order Tracking</p>
                <p className="text-sm text-gray-600">{message}</p>
                <div className="mt-4 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        </div>
    );
}

function TimeAgo({ timestamp }: { timestamp: number }) {
    const [time, setTime] = useState('just now');
    
    useEffect(() => {
        const update = () => {
            const seconds = Math.floor((Date.now() - timestamp) / 1000);
            if (seconds < 5) setTime('just now');
            else if (seconds < 60) setTime(`${seconds}s ago`);
            else setTime(`${Math.floor(seconds / 60)}m ago`);
        };
        update();
        const interval = setInterval(update, 5000);
        return () => clearInterval(interval);
    }, [timestamp]);
    
    return <span className="text-xs text-gray-400 font-normal">updated {time}</span>;
}

function OrderSummaryCard({ items }: { items: OrderItem[] }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!items || items.length === 0 || (items.length === 1 && items[0] && !items[0].name)) {
        return null;
    }

    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    return (
        <div className="mt-6 pt-6 border-t border-gray-200">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-left"
            >
                <h3 className="font-semibold text-gray-800 flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-gray-500" /> 
                    Order Summary
                </h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-4 pl-2 space-y-2 text-sm">
                    {items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>₱{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>₱{total.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackOrder({ order }: Props) {
    const [lastUpdated, setLastUpdated] = useState(Date.now());

    useEffect(() => {
        setLastUpdated(Date.now());
    }, [order]);

    // Handle case when order is undefined
    if (!order) {
        return (
            <AppLayout>
                <Head title="Track Order" />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                            <p className="text-gray-600 mb-6">The order you're looking for could not be found.</p>
                            <button
                                onClick={() => router.visit('/orders')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const getTrackingSteps = (): TrackingStep[] => {
        if (!order) return [];
        
        const { status, created_at } = order;
        const steps: TrackingStep[] = [
            { name: 'Order Placed', date: created_at, icon: ShoppingBag, isCompleted: true },
            { name: 'Processing', icon: Settings, isCompleted: ['processing', 'accepted', 'in_transit', 'delivered'].includes(status) },
            { name: 'In Transit', icon: Truck, isCompleted: ['in_transit', 'delivered'].includes(status) },
            { name: 'Delivered', icon: Home, isCompleted: status === 'delivered' },
        ];
        return steps;
    };

    const trackingSteps = getTrackingSteps();
    const hasCustomerLocation = order.customer && order.customer.latitude && order.customer.longitude;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'from-yellow-50 to-yellow-100 text-yellow-700';
            case 'accepted':
            case 'processing': return 'from-blue-50 to-blue-100 text-blue-700';
            case 'in_transit': return 'from-purple-50 to-purple-100 text-purple-700';
            case 'delivered': return 'from-green-50 to-green-100 text-green-700';
            case 'cancelled': return 'from-red-50 to-red-100 text-red-700';
            default: return 'from-gray-50 to-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = () => {
        switch (order.status) {
            case 'pending': return '⏳';
            case 'accepted':
            case 'processing': return '👨‍🍳';
            case 'in_transit': return '🚚';
            case 'delivered': return '✅';
            case 'cancelled': return '❌';
            default: return '📦';
        }
    };

    const riderStatusMessage = () => {
        if (order.status === 'pending') return 'Order placed successfully! Waiting for confirmation.';
        if (order.status === 'accepted' || order.status === 'processing') return 'Your order is being prepared by the store.';
        if (order.status === 'in_transit' && order.rider) return 'Your order is on the way!';
        if (order.status === 'in_transit' && !order.rider) return 'Finding a delivery rider for your order.';
        if (order.status === 'delivered') return 'Your order has been delivered successfully!';
        if (order.status === 'cancelled') return 'This order has been cancelled.';
        return 'Tracking your order progress...';
    };

    return (
        <AppLayout>
            <Head title={`Track Order #${order.id}`} />

            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto py-6 px-4">
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-6">
                        <button 
                            onClick={() => router.visit('/orders')} 
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            ← Back
                        </button>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-gray-800">
                                Order ID: <span className="text-primary">#{order.id}</span>
                            </p>
                            <TimeAgo timestamp={lastUpdated} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Map */}
                        <div className="h-96 rounded-xl shadow-md overflow-hidden border border-gray-200">
                            <div className={`flex flex-col items-center justify-center h-full bg-gradient-to-br ${getStatusColor(order.status)} rounded-lg`}>
                                <div className="text-center p-8">
                                    <div className="text-6xl mb-4">
                                        {getStatusIcon()}
                                    </div>
                                    <p className="text-lg font-medium mb-2">Order Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                                    <p className="text-sm">{riderStatusMessage()}</p>
                                    <div className="mt-4 flex justify-center space-x-2">
                                        <div className="w-2 h-2 bg-current rounded-full animate-pulse opacity-60"></div>
                                        <div className="w-2 h-2 bg-current rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-current rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 space-y-4">
                            {/* Estimated Delivery */}
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 text-primary" />
                                <div className="ml-3">
                                    <p className="text-sm font-semibold text-gray-700">Estimated Delivery</p>
                                    <p className="text-lg font-bold text-primary">
                                        {order.estimated_delivery_time 
                                            ? new Date(order.estimated_delivery_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Order Status Timeline */}
                            <div>
                                <h2 className="text-base font-bold text-gray-800 mb-3">Order Status</h2>
                                <div className="relative pl-4">
                                    <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gray-200" style={{ left: '0.875rem' }}></div>
                                    {trackingSteps.map((step) => {
                                        const StepIcon = step.icon;
                                        return (
                                            <div key={step.name} className="flex items-start mb-4 relative">
                                                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 z-10 ${
                                                    step.isCompleted ? 'bg-primary' : 'bg-gray-300'
                                                }`}>
                                                    <StepIcon className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className={`font-semibold text-sm ${
                                                        step.isCompleted ? 'text-gray-800' : 'text-gray-500'
                                                    }`}>
                                                        {step.name}
                                                    </h4>
                                                    {step.date && (
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(step.date).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rider Info */}
                            {order.status === 'in_transit' && order.rider && (
                                <div className="p-3 bg-primary/5 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img 
                                            src={`https://i.pravatar.cc/60?u=${order.rider.name}`}
                                            alt="Rider" 
                                            className="w-8 h-8 rounded-full mr-3" 
                                        />
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">
                                                {order.rider.name || 'Your Rider'}
                                            </p>
                                            <p className="text-gray-600 text-xs">Is on the way!</p>
                                        </div>
                                    </div>
                                    <button className="bg-primary text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-primary-dark transition">
                                        Call
                                    </button>
                                </div>
                            )}

                            <OrderSummaryCard items={order.items} />
                            
                            {/* Help Section */}
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="font-semibold text-sm text-gray-800">Need Help?</h3>
                                <button className="mt-2 w-full bg-primary text-white py-1.5 rounded-md hover:bg-primary-dark transition text-sm">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
