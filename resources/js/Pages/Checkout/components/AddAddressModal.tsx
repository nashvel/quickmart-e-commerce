import { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddressAdded: (address: Address) => void;
}

export default function AddAddressModal({ isOpen, onClose, onAddressAdded }: AddAddressModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        province: '',
        postal_code: '',
        type: 'home' as 'home' | 'work' | 'other',
        latitude: null as number | null,
        longitude: null as number | null,
    });
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFirstAddress, setIsFirstAddress] = useState(false);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '',
                phone: '',
                address_line_1: '',
                address_line_2: '',
                city: '',
                province: '',
                postal_code: '',
                type: 'home',
                latitude: null,
                longitude: null,
            });
            setIsFirstAddress(false);
            setLocationError('');
        }
    }, [isOpen]);

    // Check if this is the user's first address when modal opens
    useEffect(() => {
        if (isOpen) {
            checkIfFirstAddress();
        }
    }, [isOpen]);

    const checkIfFirstAddress = async () => {
        try {
            const response = await axios.get('/api/addresses', {
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            const addressCount = response.data.data?.length || 0;
            const isFirst = addressCount === 0;
            setIsFirstAddress(isFirst);
            
            // Auto-fill name if it's the first address
            if (isFirst) {
                setFormData(prev => ({
                    ...prev,
                    name: 'Address 1',
                }));
            }
        } catch (error) {
            console.error('Failed to check address count:', error);
            // Default to first address if we can't check
            setIsFirstAddress(true);
            setFormData(prev => ({
                ...prev,
                name: 'Address 1',
            }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));
                setIsGettingLocation(false);
                
                // Reverse geocoding to get address details
                reverseGeocode(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setLocationError('Unable to retrieve your location. Please enter address manually.');
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            // Try multiple geocoding services for better postal code accuracy
            
            // First try: BigDataCloud (free, good for postal codes)
            try {
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                const data = await response.json();
                
                if (data) {
                    setFormData(prev => ({
                        ...prev,
                        address_line_1: data.locality || data.localityInfo?.administrative?.[3]?.name || '',
                        city: data.city || data.localityInfo?.administrative?.[2]?.name || '',
                        province: data.principalSubdivision || data.localityInfo?.administrative?.[1]?.name || '',
                        postal_code: data.postcode || '',
                    }));
                    
                    // If we got a postal code, we're done
                    if (data.postcode) {
                        return;
                    }
                }
            } catch (error) {
                console.log('BigDataCloud failed, trying alternative...');
            }

            // Second try: Nominatim (OpenStreetMap) - good backup
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
                const data = await response.json();
                
                if (data && data.address) {
                    const addr = data.address;
                    setFormData(prev => ({
                        ...prev,
                        address_line_1: prev.address_line_1 || addr.road || addr.street || addr.pedestrian || '',
                        city: prev.city || addr.city || addr.town || addr.village || addr.municipality || '',
                        province: prev.province || addr.state || addr.province || '',
                        postal_code: prev.postal_code || addr.postcode || '',
                    }));
                    
                    // If we still don't have postal code, try one more service
                    if (!prev.postal_code && !addr.postcode) {
                        // Third try: Geocode.xyz (another free service)
                        try {
                            const response3 = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
                            const data3 = await response3.json();
                            
                            if (data3 && data3.postal) {
                                setFormData(prev => ({
                                    ...prev,
                                    postal_code: prev.postal_code || data3.postal || '',
                                }));
                            }
                        } catch (error) {
                            console.log('Geocode.xyz failed');
                        }
                    }
                    
                    // Special handling for Philippines - try to get more accurate postal code
                    if (data.address.country_code === 'ph' && !prev.postal_code && !addr.postcode) {
                        try {
                            // Try another service specifically good for Philippines
                            const response4 = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=demo&language=en&pretty=1`);
                            const data4 = await response4.json();
                            
                            if (data4.results && data4.results[0] && data4.results[0].components.postcode) {
                                setFormData(prev => ({
                                    ...prev,
                                    postal_code: prev.postal_code || data4.results[0].components.postcode || '',
                                }));
                            }
                        } catch (error) {
                            console.log('OpenCage failed');
                        }
                    }
                }
            } catch (error) {
                console.log('Nominatim failed');
            }

        } catch (error) {
            console.error('All reverse geocoding services failed:', error);
            setLocationError('Location found but unable to get address details. Please fill manually.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/addresses', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                const newAddress = response.data.address;
                onAddressAdded(newAddress);
                onClose();
                
                // Show success toast
                toast.success('Address added successfully!', {
                    duration: 3000,
                    position: 'top-right',
                });
            }
        } catch (error: any) {
            console.error('Failed to add address:', error);
            
            // Show error toast with specific message
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                toast.error(errorMessages.join(', '), {
                    duration: 4000,
                    position: 'top-right',
                });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message, {
                    duration: 4000,
                    position: 'top-right',
                });
            } else {
                toast.error('Failed to add address. Please try again.', {
                    duration: 4000,
                    position: 'top-right',
                });
            }
            
            setLocationError('Failed to add address. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* GPS Location Button */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">Use Current Location</span>
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={isGettingLocation}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isGettingLocation ? (
                                    <>
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        Getting Location...
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="w-3 h-3 mr-1" />
                                        Get GPS Location
                                    </>
                                )}
                            </button>
                        </div>
                        {formData.latitude && formData.longitude && (
                            <div className="text-xs space-y-1">
                                <p className="text-green-600">
                                    ✓ Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                </p>
                                {formData.postal_code && (
                                    <p className="text-blue-600">
                                        ✓ Postal code auto-filled: {formData.postal_code}
                                    </p>
                                )}
                                {formData.city && (
                                    <p className="text-blue-600">
                                        ✓ Address details auto-filled
                                    </p>
                                )}
                                {!formData.postal_code && formData.city && (
                                    <p className="text-yellow-600">
                                        ⚠ Please enter postal code manually
                                    </p>
                                )}
                            </div>
                        )}
                        {locationError && (
                            <p className="text-xs text-red-600">{locationError}</p>
                        )}
                    </div>

                    {/* Address Form Fields */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Address Name</label>
                            {isFirstAddress && formData.name === 'Address 1' && (
                                <span className="text-xs text-blue-600">✓ Auto-filled</span>
                            )}
                        </div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Home, Office, Address 1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {isFirstAddress && formData.name === 'Address 1' && (
                            <p className="text-xs text-gray-500 mt-1">
                                This is your first address. You can change the name if you'd like.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g., +63 912 345 6789"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Optional. Used for delivery coordination.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                            type="text"
                            name="address_line_1"
                            value={formData.address_line_1}
                            onChange={handleInputChange}
                            placeholder="House number, street name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                        <input
                            type="text"
                            name="address_line_2"
                            value={formData.address_line_2}
                            onChange={handleInputChange}
                            placeholder="Apartment, suite, unit, building, floor, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleInputChange}
                                placeholder="Province"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleInputChange}
                            placeholder="Postal Code"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 border border-transparent text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}