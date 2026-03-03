import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CreditCard, Plus, Edit, Trash2, Shield, Star } from 'lucide-react';

interface PaymentMethod {
    id: number;
    type: 'card' | 'paypal' | 'bank';
    brand: string;
    last_four: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
    name: string;
}

interface Props {
    paymentMethods?: PaymentMethod[];
}

export default function ProfilePaymentMethods({ paymentMethods = [] }: Props) {
    const getCardIcon = (brand: string) => {
        // In a real app, you'd have actual card brand icons
        return CreditCard;
    };

    const getCardColor = (brand: string) => {
        switch (brand.toLowerCase()) {
            case 'visa':
                return 'bg-blue-500';
            case 'mastercard':
                return 'bg-red-500';
            case 'amex':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatCardNumber = (lastFour: string) => {
        return `•••• •••• •••• ${lastFour}`;
    };

    return (
        <AppLayout>
            <Head title="Payment Methods" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
                                <p className="text-gray-600 mt-1">Manage your payment cards and methods</p>
                            </div>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Payment Method
                            </button>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <div className="flex items-start space-x-3">
                            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-blue-900">Your payment information is secure</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    We use industry-standard encryption to protect your payment details. Your card information is never stored on our servers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods List */}
                    {paymentMethods.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods yet</h3>
                            <p className="text-gray-600 mb-6">Add a payment method to make checkout faster and easier</p>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Payment Method
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paymentMethods.map((method) => {
                                const IconComponent = getCardIcon(method.brand);
                                return (
                                    <div key={method.id} className="bg-white rounded-lg shadow-sm p-6 relative">
                                        {method.is_default && (
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Default
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex-shrink-0 p-3 rounded-lg ${getCardColor(method.brand)}`}>
                                                <IconComponent className="h-6 w-6 text-white" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                                                        {method.brand} {method.type === 'card' ? 'Card' : method.type}
                                                    </h3>
                                                </div>
                                                
                                                <div className="text-gray-600 space-y-1">
                                                    <p className="font-mono text-sm">{formatCardNumber(method.last_four)}</p>
                                                    <p className="text-sm">
                                                        Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                                                    </p>
                                                    <p className="text-sm">{method.name}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </button>
                                                <button className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {!method.is_default && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <button className="text-sm text-primary hover:text-primary-dark">
                                                    Set as default payment method
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Accepted Payment Methods */}
                    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Accepted Payment Methods</h3>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <CreditCard className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-700">Visa</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <CreditCard className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-700">Mastercard</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <CreditCard className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-700">American Express</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <CreditCard className="h-5 w-5 text-gray-600" />
                                <span className="text-sm text-gray-700">PayPal</span>
                            </div>
                        </div>
                    </div>

                    {/* Back to Profile */}
                    <div className="mt-8">
                        <Link
                            href="/profile"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Profile
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}