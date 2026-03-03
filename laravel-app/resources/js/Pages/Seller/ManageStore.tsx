import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  Save, 
  Edit, 
  X, 
  Store as StoreIcon, 
  Clock, 
  MapPin 
} from 'lucide-react';

interface StoreData {
  id: number;
  storeName: string;
  logo: string | null;
  openingTime: string;
  closingTime: string;
  contactNumber: string;
  paymentMethods: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  store_type: string;
}

// Mock data
const mockStoreData: StoreData = {
  id: 1,
  storeName: 'Tech Haven Store',
  logo: null,
  openingTime: '09:00',
  closingTime: '21:00',
  contactNumber: '+63 912 345 6789',
  paymentMethods: 'Cash, GCash, PayMaya, Credit Card',
  address: '123 Main Street, Quezon City, Metro Manila',
  latitude: 14.6760,
  longitude: 121.0437,
  description: 'Your one-stop shop for all tech needs. We offer a wide range of electronics, computers, and accessories at competitive prices.',
  store_type: 'electronics'
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
    {children}
  </div>
);

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const CardHeader = ({ icon, title }: CardHeaderProps) => (
  <div className="flex items-center mb-4">
    <div className="bg-primary/10 p-3 rounded-full mr-4">{icon}</div>
    <h2 className="text-xl font-bold text-gray-700">{title}</h2>
  </div>
);

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

const FormGroup = ({ label, children }: FormGroupProps) => (
  <div className="mb-4">
    <label className="block text-gray-600 font-semibold mb-2">{label}</label>
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => (
  <input 
    {...props} 
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow disabled:bg-gray-100 disabled:cursor-not-allowed" 
  />
);

export default function ManageStore() {
  const [storeData, setStoreData] = useState<StoreData>(mockStoreData);
  const [initialStoreData] = useState<StoreData>(mockStoreData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setStoreData(prev => ({ ...prev, logo: url }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setStoreData(initialStoreData);
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: API call to save store data
    setIsEditing(false);
    console.log('Saving store data:', storeData);
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const words = name.split(' ').filter(Boolean);
    if (words.length > 1) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <DashboardLayout role="seller">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Manage Store</h1>
          {isEditing ? (
            <div className="flex gap-4">
              <button 
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={handleEdit}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit size={18} />
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <Card>
            <CardHeader icon={<StoreIcon size={24} />} title="Store Details" />
            <FormGroup label="Store Name">
              <Input 
                type="text" 
                name="storeName" 
                value={storeData.storeName} 
                onChange={handleInputChange} 
                disabled={!isEditing} 
              />
            </FormGroup>
            <FormGroup label="Store Type">
              <Input 
                type="text" 
                name="storeType" 
                value={storeData.store_type.charAt(0).toUpperCase() + storeData.store_type.slice(1)} 
                disabled 
              />
            </FormGroup>
            <FormGroup label="Store Logo">
              <div className="flex items-center gap-4">
                {storeData.logo ? (
                  <img 
                    src={storeData.logo}
                    alt="Store Logo" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-100" 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-100">
                    {getInitials(storeData.storeName)}
                  </div>
                )}
                {isEditing && (
                  <>
                    <label 
                      htmlFor="logo-upload" 
                      className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Change Logo
                    </label>
                    <input 
                      id="logo-upload" 
                      name="logo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange}
                      className="hidden" 
                    />
                  </>
                )}
              </div>
            </FormGroup>
          </Card>

          <Card>
            <CardHeader icon={<Clock size={24} />} title="Operating Hours" />
            <FormGroup label="Opening & Closing Time">
              <div className="flex gap-4">
                <Input 
                  type="time" 
                  name="openingTime" 
                  value={storeData.openingTime} 
                  onChange={handleInputChange} 
                  disabled={!isEditing} 
                />
                <Input 
                  type="time" 
                  name="closingTime" 
                  value={storeData.closingTime} 
                  onChange={handleInputChange} 
                  disabled={!isEditing} 
                />
              </div>
            </FormGroup>
          </Card>

          <Card>
            <CardHeader icon={<MapPin size={24} />} title="Location & Contact" />
            <FormGroup label="Contact Number">
              <Input 
                type="tel" 
                name="contactNumber" 
                value={storeData.contactNumber} 
                onChange={handleInputChange} 
                disabled={!isEditing} 
              />
            </FormGroup>
            <FormGroup label="Payment Methods">
              <Input 
                type="text" 
                name="paymentMethods" 
                value={storeData.paymentMethods} 
                onChange={handleInputChange} 
                disabled={!isEditing} 
                placeholder="e.g., Visa, Mastercard, PayPal" 
              />
            </FormGroup>
            <FormGroup label="Address">
              <div className="flex items-center gap-2">
                <Input 
                  type="text" 
                  name="address" 
                  value={storeData.address} 
                  onChange={handleInputChange} 
                  disabled={!isEditing} 
                />
                {isEditing && (
                  <button 
                    type="button" 
                    className="bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <MapPin size={18} />
                  </button>
                )}
              </div>
            </FormGroup>
          </Card>

          <div className="lg:col-span-2 xl:col-span-3">
            <Card>
              <CardHeader icon={<StoreIcon size={24} />} title="Store Description" />
              <FormGroup label="Store Description">
                <textarea
                  name="description"
                  value={storeData.description || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={4}
                  placeholder="Tell us about your store..."
                />
              </FormGroup>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
