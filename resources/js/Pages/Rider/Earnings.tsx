import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Transaction {
  id: number;
  date: string;
  order_id: number;
  amount: number;
  type: 'delivery' | 'bonus' | 'withdrawal';
  customer_name: string;
  store_name: string;
}

interface WeeklyData {
  day: string;
  earnings: number;
}

interface MonthlyData {
  month: string;
  earnings: number;
}

interface Props {
  transactions: Transaction[];
  totalEarnings: number;
  availableBalance: number;
  weeklyEarnings: WeeklyData[];
  monthlyEarnings: MonthlyData[];
  thisWeekEarnings: number;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
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
      <div className="p-4 bg-blue-100 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

export default function RiderEarnings({ 
  transactions: initialTransactions,
  totalEarnings,
  availableBalance,
  weeklyEarnings,
  monthlyEarnings,
  thisWeekEarnings
}: Props) {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const chartData = period === 'weekly' ? weeklyEarnings : monthlyEarnings;

  const getTransactionLabel = (transaction: Transaction) => {
    if (transaction.type === 'delivery') {
      return `Delivery #${transaction.order_id}`;
    } else if (transaction.type === 'bonus') {
      return 'Performance Bonus';
    } else {
      return 'Withdrawal';
    }
  };

  return (
    <DashboardLayout role="rider">
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Earnings</h1>
          <button
            onClick={() => setIsWithdrawalModalOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            <Download className="mr-2" size={18} />
            Request Withdrawal
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={`₱${totalEarnings.toLocaleString()}`}
            icon={<DollarSign className="text-blue-600" size={24} />}
          />
          <StatCard
            title="Available Balance"
            value={`₱${availableBalance.toLocaleString()}`}
            icon={<DollarSign className="text-blue-600" size={24} />}
          />
          <StatCard
            title="This Week"
            value={`₱${thisWeekEarnings.toLocaleString()}`}
            icon={<Calendar className="text-blue-600" size={24} />}
          />
        </div>

        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Earnings Overview</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('weekly')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  period === 'weekly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  period === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              {period === 'weekly' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey={period === 'weekly' ? 'day' : 'month'} stroke="#666" />
                  <YAxis stroke="#666" tickFormatter={(value: any) => `₱${Number(value)/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                    formatter={(value: any) => `₱${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="earnings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" tickFormatter={(value: any) => `₱${Number(value)/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                    formatter={(value: any) => `₱${Number(value).toLocaleString()}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTransactionLabel(transaction)}
                      {transaction.type === 'delivery' && (
                        <div className="text-xs text-gray-500">
                          {transaction.customer_name} • {transaction.store_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'delivery' ? 'bg-blue-100 text-blue-800' :
                        transaction.type === 'bonus' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}₱{Math.abs(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Modal */}
        {isWithdrawalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Withdrawal</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Balance
                  </label>
                  <div className="text-2xl font-bold text-blue-600">
                    ₱{availableBalance.toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Amount
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    max={availableBalance}
                    min="100"
                  />
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawalModalOpen(false)}
                    className="px-6 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
