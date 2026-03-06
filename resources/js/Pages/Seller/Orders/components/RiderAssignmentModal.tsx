import { useState } from 'react';
import { X, User, Mail } from 'lucide-react';
import { Order, Rider } from '@/types/order';

interface RiderAssignmentModalProps {
  order: Order;
  riders: Rider[];
  isOpen: boolean;
  onClose: () => void;
  onAssign: (orderId: number, riderId: number) => Promise<void>;
}

export const RiderAssignmentModal = ({
  order,
  riders,
  isOpen,
  onClose,
  onAssign
}: RiderAssignmentModalProps) => {
  const [selectedRiderId, setSelectedRiderId] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedRiderId) return;

    setIsAssigning(true);
    try {
      await onAssign(order.id, selectedRiderId);
      onClose();
    } catch (error) {
      console.error('Failed to assign rider:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Assign Rider to Order #{order.id}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Order Summary */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <span className="ml-2 font-medium">{order.first_name} {order.last_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="ml-2 font-medium">₱{Number(order.total_amount).toFixed(2)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="ml-2 font-medium">
                    {order.line1}, {order.city}, {order.province}
                  </span>
                </div>
              </div>
            </div>

            {/* Rider Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Select a Rider</h3>
              {riders.length > 0 ? (
                <div className="space-y-3">
                  {riders.map((rider) => (
                    <label
                      key={rider.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRiderId === rider.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rider"
                        value={rider.id}
                        checked={selectedRiderId === rider.id}
                        onChange={() => setSelectedRiderId(rider.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center gap-2">
                          <User size={18} className="text-gray-600" />
                          <span className="font-semibold text-gray-900">
                            {rider.first_name} {rider.last_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{rider.email}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No riders available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isAssigning}
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedRiderId || isAssigning}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigning ? 'Assigning...' : 'Assign Rider'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
