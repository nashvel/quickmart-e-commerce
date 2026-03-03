import { MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutProgressProps {
    isAddressComplete: boolean;
    isShippingComplete: boolean;
    isPaymentComplete: boolean;
}

export default function CheckoutProgress({ 
    isAddressComplete, 
    isShippingComplete, 
    isPaymentComplete 
}: CheckoutProgressProps) {
    return (
        <div className="flex items-center space-x-6">
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    isAddressComplete 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-blue-500'
                }`}>
                    {isAddressComplete ? 
                        <CheckCircle className="text-white w-4 h-4" /> : 
                        <MapPin className="text-white w-4 h-4" />
                    }
                </div>
                <span className={`text-sm font-medium ${
                    isAddressComplete ? 'text-purple-600' : 'text-blue-600'
                }`}>
                    Address
                </span>
            </div>
            
            <div className={`h-0.5 w-8 ${
                isAddressComplete ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-300'
            }`}></div>
            
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    isShippingComplete 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-blue-500'
                }`}>
                    {isShippingComplete ? 
                        <CheckCircle className="text-white w-4 h-4" /> : 
                        <Truck className="text-white w-4 h-4" />
                    }
                </div>
                <span className={`text-sm font-medium ${
                    isShippingComplete ? 'text-purple-600' : 'text-blue-600'
                }`}>
                    Shipping
                </span>
            </div>
            
            <div className={`h-0.5 w-8 ${
                isShippingComplete ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-300'
            }`}></div>
            
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    isPaymentComplete 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-blue-500'
                }`}>
                    {isPaymentComplete ? 
                        <CheckCircle className="text-white w-4 h-4" /> : 
                        <CreditCard className="text-white w-4 h-4" />
                    }
                </div>
                <span className={`text-sm font-medium ${
                    isPaymentComplete ? 'text-purple-600' : 'text-blue-600'
                }`}>
                    Payment
                </span>
            </div>
        </div>
    );
}