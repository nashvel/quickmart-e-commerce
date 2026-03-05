import React from 'react';
import { Check, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Order } from '@/types/order';

interface OrderActionsProps {
  order: Order;
  isExpanded: boolean;
  updatingOrderId: number | null;
  onAccept: (orderId: number) => void;
  onDecline: (orderId: number) => void;
  onToggleDetails: (orderId: number) => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  order,
  isExpanded,
  updatingOrderId,
  onAccept,
  onDecline,
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
