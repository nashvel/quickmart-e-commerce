import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { MapPin, Phone, Package, CheckCircle } from 'lucide-react';

interface Order {
  id: number;
  customer_name: string;
  delivery_address: string;
  phone: string;
  total_amount: number;
  status: 'accepted' | 'in_transit' | 'delivered';
  items_count: number;
  created_at: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: 1001,
    customer_name: 'Juan Dela Cruz',
    delivery_address: '123 Main Street, Quezon City',
    phone: '+63 912 345 6789',
    total_amount: 15999,
    status: 'accepted',
    items_count: 1,
    created_at: '2024-03-15T10:30:00'
  },
  {
    id: 1002,
    customer_name: 'Maria Santos',
    delivery_address: '456 Rizal Avenue, Manila',
    phone: '+63 923 456 7890',
    total_amount: 2398,
    status: 'in_transit',
    items_count: 2,
    created_at: '2024-03-15T14:45:00'
  },
  {
    id: 1003,
    customer_name: 'Jose Garcia',
    delivery_address: '789 Bonifacio Street, Makati',
    phone: '+63 934 567 8901',
    total_amount: 45999,
    status: 'delivered',
    items_count: 1,
    created_at: '2024-03-14T09:20:00'
  },
  {
    id: 1004,
    customer_name: 'Ana Lopez',
    delivery_address: '321 Luna Street, Pasig',
    phone: '+63 945 678 9012',
    total_amount: 3299,
    status: 'delivered',
    items_count: 1,
    created_at: '2024-03-14T11:00:00'
  },
];

interface OrderCardProps {
  order: Order;
  onStartDelivery?: (orderId: number) => void;
  onMarkDelivered?: (orderId: number) => void;
}

const OrderCard = ({ order, onStartDelivery, onMarkDelivered }: OrderCardProps) => {
  const statusColors: Record<Order['status'], string> = {
    accepted: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
          <p className="text-sm text-gray-600">{order.customer_name}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <span>{order.delivery_address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} className="flex-shrink-0" />
          <span>{order.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package size={16} className="flex-shrink-0" />
          <span>{order.items_count} item(s) - ₱{order.total_amount.toLocaleString()}</span>
        </div>
      </div>

      {order.status === 'accepted' && onStartDelivery && (
        <button
          onClick={() => onStartDelivery(order.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Start Delivery
        </button>
      )}
      {order.status === 'in_transit' && onMarkDelivered && (
        <button
          onClick={() => onMarkDelivered(order.id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Mark as Delivered
        </button>
      )}
      {order.status === 'delivered' && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
          <CheckCircle size={18} />
          <span>Delivered</span>
        </div>
      )}
    </div>
  );
};

export default function RiderDeliveries() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const handleStartDelivery = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'in_transit' as const } : order
    ));
  };

  const handleMarkDelivered = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'delivered' as const } : order
    ));
  };

  const activeOrders = orders.filter(o => o.status === 'accepted' || o.status === 'in_transit');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <DashboardLayout role="rider">
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Deliveries</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Deliveries ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed ({completedOrders.length})
            </button>
          </nav>
        </div>

        {/* Orders Grid */}
        {displayOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onStartDelivery={activeTab === 'active' ? handleStartDelivery : undefined}
                onMarkDelivered={activeTab === 'active' ? handleMarkDelivered : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-xl shadow-md text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No {activeTab === 'active' ? 'active' : 'completed'} deliveries
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'active' 
                ? 'You have no active deliveries at the moment.' 
                : 'You haven\'t completed any deliveries yet.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
