import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Mock data
const mockPromotions: Promotion[] = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get 20% off on all electronics',
    discount_percentage: 20,
    start_date: '2024-03-01',
    end_date: '2024-03-31',
    is_active: true
  },
  {
    id: 2,
    title: 'Flash Sale',
    description: '50% off on selected items',
    discount_percentage: 50,
    start_date: '2024-03-15',
    end_date: '2024-03-16',
    is_active: true
  },
  {
    id: 3,
    title: 'Weekend Special',
    description: '15% off on all orders',
    discount_percentage: 15,
    start_date: '2024-02-01',
    end_date: '2024-02-28',
    is_active: false
  },
];

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, is_active: !p.is_active } : p
    ));
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout role="admin">
      <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-gray-50 min-h-screen">
        <div className="pt-4 sm:pt-6 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promotion Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Create and manage promotional campaigns.
              </p>
            </div>
            <button 
              onClick={handleAddNew}
              className="mt-4 sm:mt-0 flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
            >
              <Plus className="mr-2" size={18} />
              Add New Promotion
            </button>
          </div>

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <div 
                key={promotion.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Tag className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {promotion.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {promotion.discount_percentage}% OFF
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(promotion.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        promotion.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          promotion.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {promotion.description}
                  </p>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>Start: {new Date(promotion.start_date).toLocaleDateString()}</p>
                    <p>End: {new Date(promotion.end_date).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(promotion)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {promotions.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-16 text-center">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No promotions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first promotion.
              </p>
              <button
                onClick={handleAddNew}
                className="mt-6 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <Plus className="mr-2" size={18} />
                Add Promotion
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    defaultValue={editingPromotion?.title}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Summer Sale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    defaultValue={editingPromotion?.description}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the promotion..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    defaultValue={editingPromotion?.discount_percentage}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 20"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      defaultValue={editingPromotion?.start_date}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      defaultValue={editingPromotion?.end_date}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
                  >
                    {editingPromotion ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
