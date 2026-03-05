import { useState } from 'react';
import ProductReviews from './ProductReviews';

interface Tab {
    id: string;
    label: string;
}

interface ProductTabsProps {
    description: string;
    productId: number;
}

export default function ProductTabs({ description, productId }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState('description');

    const tabs: Tab[] = [
        { id: 'description', label: 'Description' },
        { id: 'specifications', label: 'Specifications' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Tab Headers */}
            <div className="flex border-b mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-semibold transition-colors ${
                            activeTab === tab.id
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'description' && (
                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                    </div>
                )}
                {activeTab === 'specifications' && (
                    <div className="text-gray-700">
                        <p>Specifications coming soon...</p>
                    </div>
                )}
                {activeTab === 'reviews' && <ProductReviews productId={productId} />}
            </div>
        </div>
    );
}
