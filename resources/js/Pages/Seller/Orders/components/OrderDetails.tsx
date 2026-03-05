import React from 'react';
import { MapPin } from 'lucide-react';
import { Order } from '@/types/order';
import { getProductImageUrl, ASSET_URLS } from '@/config/assets';

interface OrderDetailsProps {
  order: Order;
  onGetDirections: (order: Order) => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onGetDirections }) => {
  return (
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
                    src={getProductImageUrl(item.product_image)}
                    alt={item.product_name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = ASSET_URLS.PLACEHOLDERS.PRODUCT;
                    }}
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
                onClick={() => onGetDirections(order)}
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
  );
};
