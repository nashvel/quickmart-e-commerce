import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Order } from '@/types/order';
import { TabButton } from './components/TabButton';
import { OrderRow } from './components/OrderRow';
import { Pagination } from './components/Pagination';

interface Props {
  orders: Order[];
}

export default function SellerOrders({ orders: initialOrders }: Props) {
  const [activeTab, setActiveTab] = useState<'incoming' | 'transactions'>('incoming');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const itemsPerPage = 20;

  const handleTabChange = (tab: 'incoming' | 'transactions') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleToggleDetails = (orderId: number) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  const handleAccept = async (orderId: number) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/seller/orders/${orderId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'accepted' as const } : order
        ));
      }
    } catch (error) {
      console.error('Failed to accept order:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDecline = async (orderId: number) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/seller/orders/${orderId}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: 'rejected' as const } : order
        ));
      }
    } catch (error) {
      console.error('Failed to decline order:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleGetDirections = (order: Order) => {
    if (order.latitude && order.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`,
        '_blank'
      );
    } else {
      const address = `${order.line1}, ${order.line2 || ''}, ${order.city}, ${order.province}, ${order.zip_code}`;
      const query = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const incomingOrders = orders.filter(order => order.status === 'pending');
  const transactionOrders = orders.filter(
    order => order.status !== 'pending' && order.status !== 'rejected'
  );

  const activeOrders = activeTab === 'incoming' ? incomingOrders : transactionOrders;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(activeOrders.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <DashboardLayout role="seller">
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>
        <div className="border-b border-gray-200">
          <div className="flex -mb-px">
            <TabButton
              label="Incoming Orders"
              count={incomingOrders.length}
              isActive={activeTab === 'incoming'}
              onClick={() => handleTabChange('incoming')}
            />
            <TabButton
              label="Transactions"
              count={transactionOrders.length}
              isActive={activeTab === 'transactions'}
              onClick={() => handleTabChange('transactions')}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      isExpanded={expandedOrderId === order.id}
                      updatingOrderId={updatingOrderId}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onToggleDetails={handleToggleDetails}
                      onGetDirections={handleGetDirections}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No {activeTab === 'incoming' ? 'incoming orders' : 'transactions'} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={activeOrders.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
