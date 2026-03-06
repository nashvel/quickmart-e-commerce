import React from 'react';
import { Check, X, ChevronDown, ChevronUp, Loader2, UserPlus } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderActionsProps {
  order: Order;
  isExpanded: boolean;
  updatingOrderId: number | null;
  showAssignButton?: boolean;
  onAccept: (orderId: number) => void;
  onDecline: (orderId: number) => void;
  onAssignRider?: (order: Order) => void;
  onToggleDetails: (orderId: number) => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  order,
  isExpanded,
  updatingOrderId,
  showAssignButton = false,
  onAccept,
  onDecline,
  onAssignRider,
  onToggleDetails
}) => {
  if (order.status === 'pending') {
    return (
      <div className="flex items-center gap-2">
        {updatingOrderId === order.id ? (
          <Loader2 className="animate-spin text-gray-500" size={20} />
        ) : (
          <>
            <button
              onClick={() => onAccept(order.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Accept Order"
            >
              <Check size={20} />
            </button>
            <button
              onClick={() => onDecline(order.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Decline Order"
            >
              <X size={20} />
            </button>
          </>
        )}
        <button
          onClick={() => onToggleDetails(order.id)}
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
    );
  }

  if (showAssignButton && onAssignRider) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAssignRider(order)}
          className="flex items-center gap-1 px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          title="Assign Rider"
        >
          <UserPlus size={16} />
          Assign Rider
        </button>
        <button
          onClick={() => onToggleDetails(order.id)}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
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
    );
  }

  return (
    <button
      onClick={() => onToggleDetails(order.id)}
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
  );
};
