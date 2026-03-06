import { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Loader2, Package, X } from 'lucide-react';

interface Order {
  id: number;
  customer_name: string;
  delivery_address: string;
  latitude?: number | null;
  longitude?: number | null;
  status: 'accepted' | 'in_transit' | 'delivered';
  phone: string;
  total_amount: number;
  items_count: number;
  store_name: string;
}

interface OrderWithDistance extends Order {
  distance: number | null;
}

interface Props {
  orders: Order[];
}

interface RiderLocation {
  latitude: number;
  longitude: number;
}

export const SimpleMapView = ({ orders }: Props) => {
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDistance | null>(null);
  const watchIdRef = useRef<number | null>(null);

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

  // Filter orders with valid coordinates
  const ordersWithLocation = orders.filter(
    order => order.latitude && order.longitude
  );

  // Calculate distances for all orders
  const ordersWithDistance: OrderWithDistance[] = ordersWithLocation.map(order => {
    if (!riderLocation || !order.latitude || !order.longitude) {
      return { ...order, distance: null };
    }
    const distance = calculateDistance(
      riderLocation.latitude,
      riderLocation.longitude,
      order.latitude,
      order.longitude
    );
    return { ...order, distance };
  });

  // Open in Google Maps with directions
  const openInGoogleMaps = (order: OrderWithDistance) => {
    if (!order.latitude || !order.longitude) return;
    
    if (riderLocation) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${riderLocation.latitude},${riderLocation.longitude}&destination=${order.latitude},${order.longitude}&travelmode=driving`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`,
        '_blank'
      );
    }
  };

  if (isLoadingLocation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm">Getting your location...</p>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
        <MapPin className="mb-2 text-red-400" size={32} />
        <p className="text-sm text-center text-red-600 mb-2">{locationError}</p>
        <p className="text-xs text-center text-gray-500">
          Please enable location access in your browser settings
        </p>
      </div>
    );
  }

  if (ordersWithLocation.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Package className="mb-2" size={32} />
        <p className="text-sm">No orders with location data</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Your Location */}
      {riderLocation && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="text-blue-600" size={16} />
            <div>
              <p className="font-semibold text-blue-900">Your Location</p>
              <p className="text-xs text-blue-700">
                {riderLocation.latitude.toFixed(6)}, {riderLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {ordersWithDistance.map((order) => (
          <div
            key={order.id}
            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
              selectedOrder?.id === order.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  Order #{order.id}
                </p>
                <p className="text-xs text-gray-600">{order.customer_name}</p>
                <p className="text-xs text-gray-500">{order.store_name}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                order.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 line-clamp-2">
                {order.delivery_address}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                <Navigation size={12} />
                <span>
                  {order.distance !== null ? `${order.distance.toFixed(2)} km away` : 'Distance calculating...'}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openInGoogleMaps(order);
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
              >
                Navigate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <div className="mt-3 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1">Selected Delivery</p>
              <p className="text-sm font-bold">Order #{selectedOrder.id}</p>
              <p className="text-xs opacity-90">{selectedOrder.customer_name}</p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs opacity-75">Items</p>
              <p className="text-sm font-semibold">{selectedOrder.items_count}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Total</p>
              <p className="text-sm font-semibold">₱{selectedOrder.total_amount.toLocaleString()}</p>
            </div>
          </div>
          
          {selectedOrder.distance !== null && (
            <p className="text-xs mb-3 font-semibold">
              📍 Distance: {selectedOrder.distance.toFixed(2)} km
              {selectedOrder.distance < 1 && ' (Less than 1 km!)'}
            </p>
          )}
          
          <button
            onClick={() => openInGoogleMaps(selectedOrder)}
            className="w-full bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <Navigation size={16} />
            Open Google Maps
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs font-semibold mb-2 text-gray-700">Status Legend</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Accepted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">In Transit</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
};