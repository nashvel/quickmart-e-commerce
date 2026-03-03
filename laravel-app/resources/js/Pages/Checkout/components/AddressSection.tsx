import { MapPin, CheckCircle } from 'lucide-react';

interface Address {
    id: number;
    name?: string;
    address_line: string;
    address_line_1?: string;
    address_line_2?: string;
    city: string;
    province: string;
    postal_code?: string;
    type?: 'home' | 'work' | 'other';
    latitude?: number;
    longitude?: number;
}

interface AddressSectionProps {
    addresses: Address[];
    deliveryAddress: Address | null;
    isAddressComplete: boolean;
    onAddressSelect: (address: Address) => void;
    onAddAddressClick: () => void;
}

export default function AddressSection({
    addresses,
    deliveryAddress,
    isAddressComplete,
    onAddressSelect,
    onAddAddressClick
}: AddressSectionProps) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all duration-300 ${
            isAddressComplete ? 'border-purple-300 bg-blue-50/50' : 'border-gray-200 hover:border-blue-400'
        }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <MapPin className={`w-5 h-5 mr-3 ${isAddressComplete ? 'text-purple-600' : 'text-blue-600'}`} />
                    <h3 className="text-xl font-bold text-gray-800">Delivery Address</h3>
                </div>
                {isAddressComplete && <CheckCircle className="text-purple-600 w-5 h-5" />}
            </div>
            
            {addresses.length > 0 ? (
                <div className="space-y-2">
                    {addresses.map((address) => (
                        <button
                            key={address.id}
                            type="button"
                            onClick={() => onAddressSelect(address)}
                            className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                                deliveryAddress?.id === address.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                            }`}
                        >
                            <p className="font-medium text-gray-800">
                                {address.name || 'Address'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {address.address_line_1 || address.address_line}
                            </p>
                            <p className="text-sm text-gray-600">{address.city}, {address.province}</p>
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={onAddAddressClick}
                        className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl text-center transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                        <div className="flex items-center justify-center space-x-2 text-blue-600">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium">Add New Address</span>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No addresses found. Please add an address.</p>
                    <button
                        type="button"
                        onClick={onAddAddressClick}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <MapPin className="w-5 h-5 mr-2" />
                        Add Your First Address
                    </button>
                </div>
            )}
        </div>
    );
}