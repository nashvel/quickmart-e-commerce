import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MapPin,
  Loader2
} from 'lucide-react';

interface OrderItem {
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled' | 'rejected';
  delivery_full_name: string;
  delivery_phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  rider_first_name?: string;
  rider_last_name?: string;
  items: OrderItem[];
}

interface Props {
  orders: Order[];
}

interface TabButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ label, count, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}{' '}
    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
      isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
    }`}>
      {count}
    </span>
  </button>
);

interface StatusBadgeProps {
  status: Order['status'];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
      statusStyles[status] || 'bg-gray-100 text-gray-800'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }: PaginationProps) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-6 flex justify-center">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-2 leading-tight border border-gray-300 ${
                currentPage === number
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default function SellerOrders({ orders: initialOrders }: Props) {
  const [activeTab, setActiveTab] = useState<'incoming' | 'transactions'>('incoming');
  const [orders] = useState<Order[]>(initialOrders);
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

  const handleAccept = (orderId: number) => {
    setUpdatingOrderId(orderId);
    // TODO: API call to accept order
    setTimeout(() => {
      setUpdatingOrderId(null);
      console.log('Order accepted:', orderId);
    }, 1000);
  };

  const handleDecline = (orderId: number) => {
    setUpdatingOrderId(orderId);
    // TODO: API call to decline order
    setTimeout(() => {
      setUpdatingOrderId(null);
      console.log('Order declined:', orderId);
    }, 1000);
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
                  currentItems.map((order) => {
                    const customerName = `${order.first_name} ${order.last_name}`;
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <React.Fragment key={order.id}>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₱{Number(order.total_amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {order.status === 'pending' ? (
                              <div className="flex items-center gap-3">
                                {updatingOrderId === order.id ? (
                                  <div className="flex items-center gap-2 text-gray-500 px-2">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleAccept(order.id)}
                                      className="flex items-center gap-1 text-green-600 hover:text-green-900"
                                    >
                                      <Check size={16} /> Accept
                                    </button>
                                    <button
                                      onClick={() => handleDecline(order.id)}
                                      className="flex items-center gap-1 text-red-600 hover:text-red-900"
                                    >
                                      <X size={16} /> Decline
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleToggleDetails(order.id)}
                                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 ml-2"
                                  disabled={updatingOrderId === order.id}
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp size={16} /> Hide
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown size={16} /> Details
                                    </>
                                  )}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleToggleDetails(order.id)}
                                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp size={16} /> Hide Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={16} /> View Details
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="p-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Items Section */}
                                <div className="p-4 bg-white rounded-lg shadow-inner">
                                  <h4 className="text-md font-semibold mb-3 text-gray-700">
                                    Order Items
                                  </h4>
                                  <div className="flex flex-col gap-4">
                                    {order.items.map((item, index) => (
                                      <div key={index} className="flex gap-4 items-center">
                                        <img
                                          src={`https://via.placeholder.com/64?text=${item.product_name.substring(0, 2)}`}
                                          alt={item.product_name}
                                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-grow">
                                          <p className="font-bold text-gray-800">
                                            {item.product_name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            Price: ₱{Number(item.price).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Delivery Details Section */}
                                <div className="p-4 bg-white rounded-lg shadow-inner">
                                  <h4 className="text-md font-semibold mb-3 text-gray-700">
                                    Delivery Details
                                  </h4>
                                  <div className="text-sm text-gray-600">
                                    <p className="font-bold">{order.delivery_full_name}</p>
                                    <p>{order.delivery_phone}</p>
                                    <p>
                                      {order.line1}, {order.line2 ? `${order.line2}, ` : ''}
                                    </p>
                                    <p>
                                      {order.city}, {order.province} {order.zip_code}
                                    </p>
                                  </div>
                                  <div className="mt-4">
                                    <button
                                      onClick={() => handleGetDirections(order)}
                                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                      <MapPin className="mr-2 -ml-1 h-5 w-5" />
                                      Get Directions
                                    </button>
                                  </div>
                                  {/* Assigned Rider Section */}
                                  {order.rider_first_name && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <h5 className="text-sm font-semibold text-gray-700">
                                        Assigned Rider
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        {`${order.rider_first_name} ${order.rider_last_name}`}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
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
