import { CreditCard, CheckCircle, ChevronRight } from 'lucide-react';

interface PaymentSectionProps {
    paymentMethod: 'cod' | 'online';
    isPaymentComplete: boolean;
    onPaymentModalOpen: () => void;
}

export default function PaymentSection({
    paymentMethod,
    isPaymentComplete,
    onPaymentModalOpen
}: PaymentSectionProps) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-300 animate-fadeIn ${
            isPaymentComplete ? 'border-purple-300 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400'
        }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <CreditCard className={`w-5 h-5 mr-3 ${isPaymentComplete ? 'text-purple-600' : 'text-blue-600'}`} />
                    <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
                </div>
                {isPaymentComplete && <CheckCircle className="text-purple-600 w-5 h-5" />}
            </div>
            <button 
                type="button" 
                onClick={onPaymentModalOpen} 
                className="w-full p-5 border-2 border-gray-200 rounded-xl text-left hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group hover:shadow-md transform hover:-translate-y-0.5"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <CreditCard className="text-blue-600 w-5 h-5 mr-3" />
                        <div>
                            <span className="text-base font-semibold text-gray-700 block">
                                {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Click to change payment method</p>
                        </div>
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:translate-x-1 w-5 h-5" />
                </div>
            </button>
        </div>
    );
}