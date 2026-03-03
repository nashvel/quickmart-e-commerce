import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Receipt } from 'lucide-react';

interface Store {
    id: number;
    name: string;
    logo?: string;
}

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: string;
    image: string;
}

interface Order {
    id: number;
    created_at: string;
    total_amount: string;
    status: 'pending' | 'accepted' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';
    store?: Store;
    items: OrderItem[];
}

interface Props {
    orders: Order[];
}

const statusInfo = {
    pending: {
        icon: Package,
        text: 'Pending',
        bg: 'bg-yellow-100',
        text_color: 'text-yellow-800',
        icon_color: 'text-yellow-500',
    },
    accepted: {
        icon: CheckCircle,
        text: 'Processing',
        bg: 'bg-blue-100',
        text_color: 'text-blue-800',
        icon_color: 'text-blue-500',
    },
    shipped: {
        icon: Truck,
        text: 'Shipped',
        bg: 'bg-green-100',
        text_color: 'text-green-800',
        icon_color: 'text-green-500',
    },
    delivered: {
        icon: CheckCircle,
        text: 'Delivered',
        bg: 'bg-primary/10',
        text_color: 'text-primary',
        icon_color: 'text-primary',
    },
    cancelled: {
        icon: XCircle,
        text: 'Cancelled',
        bg: 'bg-red-100',
        text_color: 'text-red-800',
        icon_color: 'text-red-500',
    },
    rejected: {
        icon: XCircle,
        text: 'Rejected',
        bg: 'bg-red-100',
        text_color: 'text-red-800',
        icon_color: 'text-red-500',
    },
};

function OrderCard({ order }: { order: Order }) {
    const currentStatus = statusInfo[order.status] || {
        icon: Receipt,
        text: 'Status Unknown',
        bg: 'bg-gray-100',
        text_color: 'text-gray-800',
        icon_color: 'text-gray-500',
    };

    const StatusIcon = currentStatus.icon;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-2 space-y-1">
                {/* Header Row */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">#{order.id}</span>
                        <span className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${currentStatus.bg} ${currentStatus.text_color}`}>
                        <StatusIcon className={`w-3 h-3 ${currentStatus.icon_color}`} />
                        <span>{currentStatus.text}</span>
                    </div>
                </div>

                {/* Store Info Row */}
                {order.store && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">
                                    {order.store.name.charAt(0)}
                                </span>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                                {order.store.name}
                            </span>
                        </div>
                        <Link
                            href={`/stores/${order.store.id}`}
                            className="text-xs text-primary hover:text-primary-dark font-medium"
                        >
                            Visit Store
                        </Link>
                    </div>
                )}
                
                {/* Content Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {order.items && order.items.length > 0 && (
                            <>
                                <div className="flex -space-x-2">
                                    {order.items.slice(0, 2).map((item, index) => (
                                        <img
                                            key={index}
                                            className="w-12 h-12 rounded-full ring-2 ring-white object-cover"
                                            src={item.image ? `/storage/products/${item.image}` : '/images/placeholder.jpg'}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    ))}
                                    {order.items.length > 2 && (
                                        <div className="w-12 h-12 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
                                            +{order.items.length - 2}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-800">
                            ₱{parseFloat(order.total_amount || '0').toFixed(2)}
                        </span>
                        <Link 
                            href={`/orders/${order.id}`}
                            className="bg-primary text-white px-2 py-1 rounded text-xs font-medium hover:bg-primary-dark transition-colors"
                        >
                            View
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrdersIndex({ orders = [] }: Props) {
    const [activeFilter, setActiveFilter] = useState('All');

    const filterTabs = ['All', 'Pending', 'Shipped', 'Delivered', 'Rejected', 'Cancelled'];

    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Shipped') return order.status === 'shipped' || order.status === 'accepted';
        return order.status.toLowerCase() === activeFilter.toLowerCase();
    });

    // Force rebuild - compact cards
    return (
        <AppLayout>
            <Head title="My Orders" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-center text-4xl font-extrabold mb-8 text-gray-800">My Orders</h1>

                    <div className="mb-8 flex justify-center border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {filterTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`${
                                        activeFilter === tab 
                                            ? 'border-primary text-primary' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="min-h-[500px]">
                        {filteredOrders.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredOrders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[500px]">
                                <div className="text-center py-16 px-6 bg-white rounded-xl shadow-md max-w-md">
                                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                                    <h3 className="mt-4 text-xl font-semibold text-gray-800">No orders found</h3>
                                    <p className="mt-2 text-gray-500">
                                        You don't have any {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} orders yet.
                                    </p>
                                    <Link
                                        href="/products"
                                        className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-primary-dark transition-all"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
