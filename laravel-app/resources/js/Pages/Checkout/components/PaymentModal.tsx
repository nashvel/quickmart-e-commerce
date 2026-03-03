import { CreditCard } from 'lucide-react';

interface PaymentModalProps {
    selectedOption: 'cod' | 'online';
    onSelect: (option: 'cod' | 'online') => void;
    onClose: () => void;
}

export default function PaymentModal({ selectedOption, onSelect, onClose }: PaymentModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                    <button
                        onClick={() => { onSelect('cod'); onClose(); }}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                            selectedOption === 'cod'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <CreditCard className="text-blue-600 w-5 h-5 mr-3" />
                            <div>
                                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                                <p className="text-sm text-gray-600">Pay when you receive</p>
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => { onSelect('online'); onClose(); }}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                            selectedOption === 'online'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}
                    >
                        <div className="flex items-center">
                            <CreditCard className="text-blue-600 w-5 h-5 mr-3" />
                            <div>
                                <p className="font-semibold text-gray-800">Online Payment</p>
                                <p className="text-sm text-gray-600">Pay now securely</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}