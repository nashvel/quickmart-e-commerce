import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapPin, Navigation, Loader2, Package, X } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

// Component to update map center when rider location changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Component to handle routing
function RoutingMachine({ 
  start, 
  end, 
  onRouteFound 
}: { 
  start: [number, number]; 
  end: [number, number];
  onRouteFound?: (distance: number, duration: number) => void;
}) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create new routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#3B82F6', weight: 5, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Hide the default instructions panel
      createMarker: () => null, // Don't create default markers
    }).addTo(map);

    // Listen for route found event
    routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const route = routes[0];
        const distance = route.summary.totalDistance / 1000; // Convert to km
        const duration = route.summary.totalTime / 60; // Convert to minutes
        if (onRouteFound) {
          onRouteFound(distance, duration);
        }
      }
    });

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end, onRouteFound]);

  return null;
}

export const OpenStreetMapView = ({ orders }: Props) => {
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([14.5995, 120.9842]); // Manila default
  const [selectedOrderForRoute, setSelectedOrderForRoute] = useState<OrderWithDistance | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Custom icons
  const riderIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" stroke="white" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    `),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  const createOrderIcon = (status: string) => {
    const color = status === 'accepted' ? '#3B82F6' : 
                  status === 'in_transit' ? '#EAB308' : '#10B981';
    
    return new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
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
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setRiderLocation(newLocation);
        setMapCenter([newLocation.latitude, newLocation.longitude]);
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

  // Open directions in the map
  const showDirections = (order: OrderWithDistance) => {
    if (!order.latitude || !order.longitude || !riderLocation) return;
    setSelectedOrderForRoute(order);
    setRouteInfo(null);
  };

  const clearRoute = () => {
    setSelectedOrderForRoute(null);
    setRouteInfo(null);
  };

  const handleRouteFound = (distance: number, duration: number) => {
    setRouteInfo({ distance, duration });
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
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={mapCenter} />

        {/* Routing */}
        {selectedOrderForRoute && riderLocation && selectedOrderForRoute.latitude && selectedOrderForRoute.longitude && (
          <RoutingMachine
            start={[riderLocation.latitude, riderLocation.longitude]}
            end={[selectedOrderForRoute.latitude, selectedOrderForRoute.longitude]}
            onRouteFound={handleRouteFound}
          />
        )}

        {/* Rider's current location marker */}
        {riderLocation && (
          <Marker
            position={[riderLocation.latitude, riderLocation.longitude]}
            icon={riderIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-sm">Your Location</p>
                <p className="text-xs text-gray-600">
                  {riderLocation.latitude.toFixed(6)}, {riderLocation.longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Customer location markers */}
        {ordersWithDistance.map((order) => (
          order.latitude && order.longitude && (
            <Marker
              key={order.id}
              position={[order.latitude, order.longitude]}
              icon={createOrderIcon(order.status)}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-sm mb-1">Order #{order.id}</h3>
                  <p className="text-xs text-gray-600 mb-1">{order.customer_name}</p>
                  <p className="text-xs text-gray-600 mb-1">{order.store_name}</p>
                  <p className="text-xs text-gray-500 mb-2">{order.delivery_address}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {order.items_count} item(s) - ₱{order.total_amount.toLocaleString()}
                  </p>
                  {order.distance !== null && (
                    <p className="text-xs font-semibold text-blue-600 mb-2">
                      📍 {order.distance.toFixed(2)} km away
                    </p>
                  )}
                  <button
                    onClick={() => showDirections(order)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Navigation size={12} />
                    Show Route
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <p className="text-xs font-semibold mb-2">Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Your Location / Accepted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">In Transit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Delivered</span>
          </div>
        </div>
      </div>

      {/* Order count badge */}
      <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg z-[1000]">
        <p className="text-xs font-semibold text-gray-700">
          {ordersWithDistance.length} {ordersWithDistance.length === 1 ? 'Order' : 'Orders'}
        </p>
      </div>

      {/* Route info panel */}
      {selectedOrderForRoute && (
        <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">
                Route to Order #{selectedOrderForRoute.id}
              </h3>
              <p className="text-xs text-gray-600">{selectedOrderForRoute.customer_name}</p>
            </div>
            <button
              onClick={clearRoute}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {routeInfo ? (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">Distance</p>
                <p className="text-sm font-bold text-blue-600">
                  {routeInfo.distance.toFixed(2)} km
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-xs text-gray-600">Est. Time</p>
                <p className="text-sm font-bold text-green-600">
                  {Math.round(routeInfo.duration)} min
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2 text-gray-500">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-xs">Calculating route...</span>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-3">
            💡 Follow the blue line on the map for turn-by-turn directions
          </p>
        </div>
      )}
    </div>
  );
};
