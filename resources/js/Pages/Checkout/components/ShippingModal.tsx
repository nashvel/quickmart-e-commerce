import { Truck, Store } from 'lucide-react';

interface ShippingModalProps {
    selectedOption: 'door_to_door' | 'pickup';
    onSelect: (option: 'door_to_door' | 'pickup') => void;
    onClose: () => void;
}

export default function ShippingModal({ selectedOption, onSelect, onClose }: ShippingModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Select Shipping Option</h3>
                <div className="space-y-3">
                    <button
                        onClick={() => { onSelect('door_to_door'); onClose(); }}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                            selectedOption === 'door_to_door'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <Truck className="text-blue-600 w-5 h-5 mr-3" />
                            <div>
                                <p className="font-semibold text-gray-800">Door-to-door Delivery</p>
                                <p className="text-sm text-gray-600">Delivered to your address</p>
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => { onSelect('pickup'); onClose(); }}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                            selectedOption === 'pickup'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <Store className="text-blue-600 w-5 h-5 mr-3" />
                            <div>
                                <p className="font-semibold text-gray-800">Pick-up at Store</p>
                                <p className="text-sm text-gray-600">Pick up from store location</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}