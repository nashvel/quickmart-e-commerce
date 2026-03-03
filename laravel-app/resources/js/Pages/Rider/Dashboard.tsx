import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  DollarSign, 
  CheckCircle, 
  Package,
  MapPin,
  Phone
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Mock data
const weeklyData = [
  { day: 'Mon', earnings: 1250 },
  { day: 'Tue', earnings: 1500 },
  { day: 'Wed', earnings: 980 },
  { day: 'Thu', earnings: 1780 },
  { day: 'Fri', earnings: 2100 },
  { day: 'Sat', earnings: 2500 },
  { day: 'Sun', earnings: 1890 },
];

interface Order {
  id: number;
  customer_name: string;
  delivery_address: string;
  phone: string;
  total_amount: number;
  status: 'accepted' | 'in_transit' | 'delivered';
  items_count: number;
}

const mockOrders: Order[] = [
  {
    id: 1001,
    customer_name: 'Juan Dela Cruz',
    delivery_address: '123 Main Street, Quezon City',
    phone: '+63 912 345 6789',
    total_amount: 15999,
    status: 'accepted',
    items_count: 1
  },
  {
    id: 1002,
    customer_name: 'Maria Santos',
    delivery_address: '456 Rizal Avenue, Manila',
    phone: '+63 923 456 7890',
    total_amount: 2398,
    status: 'in_transit',
    items_count: 2
  },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center">
    <div className="p-3 bg-gradient-to-tr from-primary to-cyan-400 text-white rounded-full shadow-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: number, status: Order['status']) => void;
}

const OrderCard = ({ order, onUpdateStatus }: OrderCardProps) => {
  const statusColors: Record<Order['status'], string> = {
    accepted: 'bg-primary/10 text-primary',
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

      <div className="flex gap-2">
        {order.status === 'accepted' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'in_transit')}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Start Delivery
          </button>
        )}
        {order.status === 'in_transit' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'delivered')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Mark as Delivered
          </button>
        )}
        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default function RiderDashboard() {
  const [assignedOrders, setAssignedOrders] = useState<Order[]>(mockOrders);

  const stats = [
    { title: "Today's Earnings", value: "₱1,250.00", icon: <DollarSign size={20} /> },
    { title: "Completed Trips", value: "15", icon: <CheckCircle size={20} /> },
    { title: "Active Deliveries", value: assignedOrders.length, icon: <Package size={20} /> },
  ];

  const handleUpdateStatus = (orderId: number, status: Order['status']) => {
    setAssignedOrders(orders => 
      orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <DashboardLayout role="rider">
      <div className="p-8 bg-gray-50 min-h-screen space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Performance Chart and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Performance</h2>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 14 }} />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#6B7280', fontSize: 14 }} 
                      tickFormatter={(value) => `₱${value/1000}k`} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.5rem' 
                      }} 
                    />
                    <Bar dataKey="earnings" fill="#3B82F6" barSize={20} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 h-80 lg:h-auto bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Live Orders Map</h2>
            <div className="flex-grow min-h-0 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map placeholder</p>
            </div>
          </div>
        </div>

        {/* My Assigned Deliveries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Assigned Deliveries</h2>
          {assignedOrders.length > 0 ? (
            <div className="space-y-4 overflow-y-auto max-h-[500px]">
              {assignedOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-md text-center text-gray-500">
              <p>You have no assigned deliveries at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
