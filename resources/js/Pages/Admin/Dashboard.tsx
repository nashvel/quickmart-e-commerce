import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  Users, 
  Store, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Package
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data
const salesData = [
  { month: 'Jan', sales: 45000, orders: 120 },
  { month: 'Feb', sales: 52000, orders: 145 },
  { month: 'Mar', sales: 48000, orders: 130 },
  { month: 'Apr', sales: 61000, orders: 165 },
  { month: 'May', sales: 55000, orders: 150 },
  { month: 'Jun', sales: 67000, orders: 180 },
];

const recentOrders = [
  { id: 1001, customer: 'Juan Dela Cruz', amount: 15999, status: 'delivered', date: '2024-03-15' },
  { id: 1002, customer: 'Maria Santos', amount: 2398, status: 'in_transit', date: '2024-03-15' },
  { id: 1003, customer: 'Jose Garcia', amount: 45999, status: 'pending', date: '2024-03-14' },
  { id: 1004, customer: 'Ana Lopez', amount: 3299, status: 'delivered', date: '2024-03-14' },
  { id: 1005, customer: 'Pedro Reyes', amount: 8999, status: 'in_transit', date: '2024-03-13' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  colorClass: string;
}

const StatCard = ({ title, value, icon, trend, colorClass }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp size={14} />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-4 rounded-full ${colorClass}`}>
        {icon}
      </div>
    </div>
  </div>
);

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles: Record<string, string> = {
    delivered: 'bg-green-100 text-green-800',
    in_transit: 'bg-primary/10 text-primary',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

export default function AdminDashboard() {
  const [stores] = useState([
    { id: 1, name: 'All Stores' },
    { id: 2, name: 'Tech Haven' },
    { id: 3, name: 'Fashion Store' },
    { id: 4, name: 'Food Market' },
  ]);
  const [selectedStore, setSelectedStore] = useState('');

  return (
    <DashboardLayout role="admin">
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header with Store Filter */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <select 
            onChange={(e) => setSelectedStore(e.target.value)}
            value={selectedStore}
            className="h-11 rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm text-gray-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Stores</option>
            {stores.slice(1).map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value="2,543"
            icon={<Users className="text-white" size={24} />}
            trend="+12% from last month"
            colorClass="bg-primary"
          />
          <StatCard
            title="Active Stores"
            value="156"
            icon={<Store className="text-white" size={24} />}
            trend="+8% from last month"
            colorClass="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value="8,234"
            icon={<ShoppingCart className="text-white" size={24} />}
            trend="+23% from last month"
            colorClass="bg-purple-500"
          />
          <StatCard
            title="Revenue"
            value="₱1.2M"
            icon={<DollarSign className="text-white" size={24} />}
            trend="+15% from last month"
            colorClass="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Sales</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3B82F6" 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Orders</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }} />
                  <Legend />
                  <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₱{order.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
