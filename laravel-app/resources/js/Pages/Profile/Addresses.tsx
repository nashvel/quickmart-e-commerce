import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { MapPin, Plus, Edit, Trash2, Home, Building, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddAddressModal from '@/Pages/Checkout/components/AddAddressModal';

interface Address {
    id: number;
    type: 'home' | 'work' | 'other';
    name: string;
    phone?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
}

export default function ProfileAddresses() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/addresses');
            console.log('API Response:', response.data); // Debug log
            
            // Handle different possible response structures
            let addressData = [];
            if (response.data.data && Array.isArray(response.data.data)) {
                addressData = response.data.data;
            } else if (response.data.addresses && Array.isArray(response.data.addresses)) {
                addressData = response.data.addresses;
            } else if (Array.isArray(response.data)) {
                addressData = response.data;
            }
            
            setAddresses(addressData);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            toast.error('Failed to load addresses');
            setAddresses([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (addressId: number) => {
        if (!confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            await axios.delete(`/api/addresses/${addressId}`);
            toast.success('Address deleted successfully');
            fetchAddresses(); // Refresh the list
        } catch (error) {
            console.error('Failed to delete address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (addressId: number) => {
        try {
            await axios.put(`/api/addresses/${addressId}`, { is_default: true });
            toast.success('Default address updated');
            fetchAddresses(); // Refresh the list
        } catch (error) {
            console.error('Failed to set default address:', error);
            toast.error('Failed to update default address');
        }
    };

    const handleAddressAdded = (newAddress: Address) => {
        fetchAddresses(); // Refresh the list
        setShowAddModal(false);
    };
    const getAddressIcon = (type: string) => {
        switch (type) {
            case 'home':
                return Home;
            case 'work':
                return Building;
            default:
                return MapPin;
        }
    };

    const getAddressTypeColor = (type: string) => {
        switch (type) {
            case 'home':
                return 'bg-green-100 text-green-800';
            case 'work':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="My Addresses" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
                                <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
                            </div>
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Address
                            </button>
                        </div>
                    </div>

                    {/* Addresses List */}
                    {loading ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading addresses...</p>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
                            <p className="text-gray-600 mb-6">Add your first delivery address to get started</p>
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Address
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.map((address) => {
                                const IconComponent = getAddressIcon(address.type);
                                return (
                                    <div key={address.id} className="bg-white rounded-lg shadow-sm p-6 relative">
                                        {address.is_default && (
                                            <div className="absolute top-4 right-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                                                    Default
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <IconComponent className="h-5 w-5 text-gray-600" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900">{address.name}</h3>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getAddressTypeColor(address.type)}`}>
                                                        {address.type}
                                                    </span>
                                                </div>
                                                
                                                <div className="text-gray-600 space-y-1">
                                                    <p>{address.address_line_1}</p>
                                                    {address.address_line_2 && <p>{address.address_line_2}</p>}
                                                    <p>{address.city}, {address.province} {address.postal_code}</p>
                                                    {address.phone && (
                                                        <div className="flex items-center space-x-1 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            <span>{address.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center space-x-4 mt-4">
                                                    <button 
                                                        onClick={() => {/* TODO: Add edit functionality */}}
                                                        className="inline-flex items-center text-sm text-primary hover:text-primary-dark"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(address.id)}
                                                        className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </button>
                                                    {!address.is_default && (
                                                        <button 
                                                            onClick={() => handleSetDefault(address.id)}
                                                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
                                                        >
                                                            Set as Default
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

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

            {/* Add Address Modal */}
            <AddAddressModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAddressAdded={handleAddressAdded}
            />
        </AppLayout>
    );
}