import React from 'react';
import { Order } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { OrderActions } from './OrderActions';
import { OrderDetails } from './OrderDetails';

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  updatingOrderId: number | null;
  showAssignButton?: boolean;
  onAccept: (orderId: number) => void;
  onDecline: (orderId: number) => void;
  onAssignRider?: (order: Order) => void;
  onToggleDetails: (orderId: number) => void;
  onGetDirections: (order: Order) => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  order,
  isExpanded,
  updatingOrderId,
  showAssignButton = false,
  onAccept,
  onDecline,
  onAssignRider,
  onToggleDetails,
  onGetDirections
}) => {
  const customerName = `${order.first_name} ${order.last_name}`;

  return (
    <React.Fragment>
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
          <OrderActions
            order={order}
            isExpanded={isExpanded}
            updatingOrderId={updatingOrderId}
            showAssignButton={showAssignButton}
            onAccept={onAccept}
            onDecline={onDecline}
            onAssignRider={onAssignRider}
            onToggleDetails={onToggleDetails}
          />
        </td>
      </tr>
      {isExpanded && (
        <OrderDetails order={order} onGetDirections={onGetDirections} />
      )}
    </React.Fragment>
  );
};
