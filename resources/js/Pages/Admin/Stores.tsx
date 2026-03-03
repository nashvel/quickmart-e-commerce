import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  Search, 
  Plus, 
  Mail, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  Edit,
  Trash2,
  MapPin,
  Store as StoreIcon
} from 'lucide-react';

interface Store {
  id: number;
  name: string;
  description?: string;
  address?: string;
  store_type: string;
  is_active: boolean;
  owner: string;
  owner_email: string;
  created_at: string;
}

interface Props {
  stores: Store[];
}

interface StoreCardProps {
  store: Store;
  onDelete: (store: Store) => void;
}

const StoreCard = ({ store, onDelete }: StoreCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStoreTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'restaurant':
        return 'bg-orange-100 text-orange-800';
      case 'convenience_store':
        return 'bg-blue-100 text-blue-800';
      case 'grocery':
        return 'bg-green-100 text-green-800';
      case 'pharmacy':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <span className="text-2xl font-bold text-primary">
              {getInitials(store.name)}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {store.name}
            </h3>
            <p className="text-sm text-gray-500">
              {store.owner}
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <MoreVertical size={20} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Edit className="mr-3" size={16} />
                  Edit
                </button>
                <button 
                  onClick={() => {
                    onDelete(store);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-3" size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-600">
            <Mail className="mr-2" size={16} />
            <span>{store.owner_email}</span>
          </div>

          {store.address && (
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2" size={16} />
              <span className="truncate">{store.address}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStoreTypeColor(store.store_type)}`}>
              {store.store_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            {store.is_active ? (
              <span className="flex items-center text-green-500">
                <CheckCircle className="mr-1" size={16} />
                Active
              </span>
            ) : (
              <span className="flex items-center text-red-500">
                <XCircle className="mr-1" size={16} />
                Inactive
              </span>
            )}
          </div>

          {store.description && (
            <p className="text-gray-600 text-xs line-clamp-2">
              {store.description}
            </p>
          )}
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <p className="text-xs text-gray-500">
          Created: {store.created_at}
        </p>
      </div>
    </div>
  );
};

export default function AdminStores({ stores: initialStores }: Props) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleDelete = (store: Store) => {
    if (window.confirm(`Delete ${store.name}? This will permanently delete the store and all associated data.`)) {
      setStores(stores.filter(s => s.id !== store.id));
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || store.store_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout role="admin">
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-gray-50 min-h-screen">
        <div className="pt-4 sm:pt-6 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and monitor all store accounts.
              </p>
            </div>
            <button className="mt-4 sm:mt-0 flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
              <Plus className="mr-2" size={18} />
              Add New Store
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search by store, owner, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-300 shadow-sm"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            >
              <option value="all">All Types</option>
              <option value="restaurant">Restaurants</option>
              <option value="convenience_store">Convenience Stores</option>
              <option value="grocery">Grocery</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>

          {/* Stores Grid */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            {filteredStores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStores.map(store => (
                  <StoreCard key={store.id} store={store} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No stores found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
