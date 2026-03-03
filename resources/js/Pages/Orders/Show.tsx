import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import axios from 'axios';

interface AddOn {
    id: number;
    name: string;
    addon_name?: string;
    variant_value?: string;
    variant_name?: string;
    quantity: number;
    price: string;
    image: string;
}

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: string;
    image: string;
    addOns?: AddOn[];
}

interface Order {
    id: number;
    created_at: string;
    total: string;
    subtotal: number;
    delivery_fee: number;
    status: 'pending' | 'accepted' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';
    items: OrderItem[];
}

interface Props {
    order: Order;
}

export default function OrderShow({ order }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmCancel = async () => {
        try {
            const response = await axios.put(`/api/my-orders/cancel/${order.id}`);
            if (response.data.success) {
                alert('The order has been successfully cancelled.');
                router.visit('/orders');
            } else {
                alert(response.data.message || 'Failed to cancel the order.');
            }
        } catch (err) {
            alert('An error occurred while cancelling the order.');
            console.error(err);
        } finally {
            setIsModalOpen(false);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'accepted': return 'bg-green-500';
            case 'shipped': return 'bg-blue-500';
            case 'delivered': return 'bg-indigo-500';
            case 'rejected':
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <AppLayout>
            <Head title={`Order #${order.id}`} />

            <div className="max-w-3xl mx-auto my-20 p-8 bg-white rounded-xl shadow-lg">
                <Link 
                    href="/orders" 
                    className="inline-block mb-6 px-4 py-2 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300 transition"
                >
                    ← Back to Orders
                </Link>
                <h2 className="text-center text-3xl font-bold mb-6">Order #{order.id}</h2>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8 text-center md:text-left">
                    <div>
                        <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div>
                        <strong>Total:</strong> ₱{parseFloat(order.total || '0').toFixed(2)}
                    </div>
                    <div>
                        <strong>Status:</strong> 
                        <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-semibold capitalize ${getStatusClass(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                <h3 className="mt-8 mb-4 pb-2 border-b-2 border-gray-200 text-xl font-semibold">Items</h3>
                
                <div className="flex flex-col gap-2">
                    {order.items.map(item => (
                        <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <img 
                                        src={`/storage/products/${item.image}`}
                                        alt={item.name} 
                                        className="w-16 h-16 object-cover rounded-lg mr-4"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3C/svg%3E';
                                        }}
                                    />
                                    <span className="font-semibold">{item.name} (x{item.quantity})</span>
                                </div>
                                <span className="font-semibold">₱{parseFloat(item.price || '0').toFixed(2)}</span>
                            </div>
                            {item.addOns && item.addOns.length > 0 && (
                                <div className="ml-12 mt-3 pl-8 border-l-2 border-gray-200">
                                    <div className="flex flex-col gap-2">
                                        {item.addOns.map((addon, index) => (
                                            <div key={index} className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={`/storage/products/${addon.image}`}
                                                        alt={addon.name} 
                                                        className="w-8 h-8 object-cover rounded-md"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%23ddd" width="32" height="32"/%3E%3C/svg%3E';
                                                        }}
                                                    />
                                                    <span>
                                                        {addon.name || addon.addon_name}
                                                        {(addon.variant_value || addon.variant_name) && (
                                                            <span> - {addon.variant_value || addon.variant_name}</span>
                                                        )}
                                                        {addon.quantity > 1 && <span> (x{addon.quantity})</span>}
                                                    </span>
                                                </div>
                                                <span>+ ₱{(parseFloat(addon.price) * addon.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₱{parseFloat(order.subtotal?.toString() || '0').toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span>₱{parseFloat(order.delivery_fee?.toString() || '0').toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>₱{parseFloat(order.total || '0').toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <Link 
                        href={`/track-order/${order.id}`}
                        className="flex-1 text-center bg-primary text-white py-3 rounded-lg font-semibold transition hover:bg-primary-dark"
                    >
                        Track Order
                    </Link>
                    {order.status === 'pending' && (
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold transition hover:bg-red-700"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>

                {/* Cancel Order Modal */}
                {isModalOpen && (
                    <CancelOrderModal
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmCancel}
                    />
                )}
            </div>
        </AppLayout>
    );
}

// Cancel Order Modal Component
function CancelOrderModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                <p className="mt-2 text-gray-600">
                    Are you sure you want to cancel this order? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                    >
                        No, Keep Order
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                        Yes, Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
}
