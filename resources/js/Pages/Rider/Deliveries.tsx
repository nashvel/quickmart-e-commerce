import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { MapPin, Phone, Package, CheckCircle, Navigation, Loader2 } from 'lucide-react';

interface Order {
  id: number;
  customer_name: string;
  delivery_address: string;
  phone: string;
  total_amount: number;
  status: 'accepted' | 'in_transit' | 'delivered';
  items_count: number;
  created_at: string;
  store_name: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface Props {
  orders: Order[];
}

interface RiderLocation {
  latitude: number;
  longitude: number;
}

interface OrderCardProps {
  order: Order;
  onStartDelivery?: (orderId: number) => void;
  onMarkDelivered?: (orderId: number) => void;
  onGetDirections?: (order: Order) => void;
  isUpdating?: boolean;
  riderLocation?: RiderLocation | null;
  calculateDistance?: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

const OrderCard = ({ order, onStartDelivery, onMarkDelivered, onGetDirections, isUpdating, riderLocation, calculateDistance }: OrderCardProps) => {
  const statusColors: Record<Order['status'], string> = {
    accepted: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
  };

  // Calculate distance if both locations are available
  const distance = riderLocation && order.latitude && order.longitude && calculateDistance
    ? calculateDistance(riderLocation.latitude, riderLocation.longitude, order.latitude, order.longitude)
    : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
          <p className="text-sm text-gray-600">{order.customer_name}</p>
          <p className="text-xs text-gray-500 mt-1">{order.store_name}</p>
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
        {distance !== null && (
          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
            <Navigation size={16} className="flex-shrink-0" />
            <span>{distance.toFixed(2)} km away</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {order.status === 'accepted' && onStartDelivery && (
          <button
            onClick={() => onStartDelivery(order.id)}
            disabled={isUpdating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Starting...' : 'Start Delivery'}
          </button>
        )}
        {order.status === 'in_transit' && onMarkDelivered && (
          <button
            onClick={() => onMarkDelivered(order.id)}
            disabled={isUpdating}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Mark as Delivered'}
          </button>
        )}
        {order.status === 'delivered' && (
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
            <CheckCircle size={18} />
            <span>Delivered</span>
          </div>
        )}
        
        {(order.status === 'accepted' || order.status === 'in_transit') && onGetDirections && (
          <button
            onClick={() => onGetDirections(order)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Navigation size={16} />
            Get Directions
          </button>
        )}
      </div>
    </div>
  );
};

export default function RiderDeliveries({ orders: initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Get rider's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    // Watch position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setRiderLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoadingLocation(false);
        setLocationError(null);
      },
      (error) => {
        setLocationError(error.message);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleStartDelivery = async (orderId: number) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/rider/deliveries/${orderId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'in_transit' as const } : order
        ));
      }
    } catch (error) {
      console.error('Failed to start delivery:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleMarkDelivered = async (orderId: number) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/rider/deliveries/${orderId}/delivered`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'delivered' as const } : order
        ));
      }
    } catch (error) {
      console.error('Failed to mark as delivered:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleGetDirections = (order: Order) => {
    if (!order.latitude || !order.longitude) {
      // Fallback to address search if no coordinates
      const query = encodeURIComponent(order.delivery_address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
      return;
    }

    if (riderLocation) {
      // Open with directions from current location
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${riderLocation.latitude},${riderLocation.longitude}&destination=${order.latitude},${order.longitude}&travelmode=driving`,
        '_blank'
      );
    } else {
      // Just open the destination if location not available
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`,
        '_blank'
      );
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const activeOrders = orders.filter(o => o.status === 'accepted' || o.status === 'in_transit');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <DashboardLayout role="rider">
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Deliveries</h1>
          
          {/* Location Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
            {isLoadingLocation ? (
              <>
                <Loader2 className="animate-spin text-blue-600" size={16} />
                <span className="text-sm text-gray-600">Getting location...</span>
              </>
            ) : locationError ? (
              <>
                <MapPin className="text-red-500" size={16} />
                <span className="text-sm text-red-600">Location unavailable</span>
              </>
            ) : riderLocation ? (
              <>
                <Navigation className="text-green-600" size={16} />
                <span className="text-sm text-green-600">Location active</span>
              </>
            ) : null}
          </div>
        </div>

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
                onGetDirections={handleGetDirections}
                isUpdating={updatingOrderId === order.id}
                riderLocation={riderLocation}
                calculateDistance={calculateDistance}
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
