import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Star } from 'lucide-react';
import { getProductImageUrl, ASSET_URLS } from '@/config/assets';

interface Review {
  id: number;
  customerName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductWithReviews {
  id: number;
  name: string;
  image: string;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

// Mock data
const mockProductReviews: ProductWithReviews[] = [
  {
    id: 1,
    name: 'Gaming Laptop',
    image: 'laptop.jpg',
    averageRating: 4.5,
    reviewCount: 3,
    reviews: [
      {
        id: 1,
        customerName: 'Juan Dela Cruz',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        comment: 'Excellent laptop! Very fast and great for gaming. The display is amazing and the build quality is top-notch.',
        date: '2024-03-15'
      },
      {
        id: 2,
        customerName: 'Maria Santos',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4,
        comment: 'Good performance but a bit heavy. Battery life could be better.',
        date: '2024-03-14'
      },
      {
        id: 3,
        customerName: 'Jose Garcia',
        avatar: 'https://i.pravatar.cc/150?img=3',
        rating: 4.5,
        comment: 'Great value for money. Runs all my games smoothly.',
        date: '2024-03-13'
      }
    ]
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    image: 'mouse.jpg',
    averageRating: 4.8,
    reviewCount: 5,
    reviews: [
      {
        id: 4,
        customerName: 'Ana Lopez',
        avatar: 'https://i.pravatar.cc/150?img=4',
        rating: 5,
        comment: 'Perfect mouse! Very comfortable and responsive. The battery lasts for weeks.',
        date: '2024-03-12'
      },
      {
        id: 5,
        customerName: 'Pedro Reyes',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 5,
        comment: 'Best mouse I\'ve ever used. Great for both work and gaming.',
        date: '2024-03-11'
      },
      {
        id: 6,
        customerName: 'Carlos Mendoza',
        avatar: 'https://i.pravatar.cc/150?img=6',
        rating: 4.5,
        comment: 'Very good mouse. Only minor issue is the scroll wheel is a bit stiff.',
        date: '2024-03-10'
      },
      {
        id: 7,
        customerName: 'Miguel Torres',
        avatar: 'https://i.pravatar.cc/150?img=7',
        rating: 5,
        comment: 'Excellent build quality and very comfortable to use for long hours.',
        date: '2024-03-09'
      },
      {
        id: 8,
        customerName: 'Sofia Ramos',
        avatar: 'https://i.pravatar.cc/150?img=8',
        rating: 4.5,
        comment: 'Great mouse! Works perfectly with my laptop.',
        date: '2024-03-08'
      }
    ]
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    image: 'keyboard.jpg',
    averageRating: 4.3,
    reviewCount: 2,
    reviews: [
      {
        id: 9,
        customerName: 'Luis Fernandez',
        avatar: 'https://i.pravatar.cc/150?img=9',
        rating: 4,
        comment: 'Good keyboard with nice RGB lighting. Keys feel great but a bit loud.',
        date: '2024-03-07'
      },
      {
        id: 10,
        customerName: 'Elena Cruz',
        avatar: 'https://i.pravatar.cc/150?img=10',
        rating: 4.5,
        comment: 'Love the tactile feedback! Perfect for typing and gaming.',
        date: '2024-03-06'
      }
    ]
  }
];

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} style={{ clipPath: 'inset(0 50% 0 0)' }} />
      );
    } else {
      stars.push(
        <Star key={i} className="text-gray-300" size={18} />
      );
    }
  }
  return <div className="flex gap-1">{stars}</div>;
};

export default function SellerReviews() {
  const [productReviews] = useState<ProductWithReviews[]>(mockProductReviews);
  const [expandedProducts, setExpandedProducts] = useState<number[]>([]);

  const toggleExpanded = (productId: number) => {
    setExpandedProducts(currentExpanded =>
      currentExpanded.includes(productId)
        ? currentExpanded.filter(id => id !== productId)
        : [...currentExpanded, productId]
    );
  };

  return (
    <DashboardLayout role="seller">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Product Reviews</h2>
        {productReviews.map(product => (
          product.reviews.length > 0 && (
            <div key={product.id} className="mb-10">
              <div className="flex items-center gap-5 mb-5 pb-5 border-b border-gray-200">
                <img 
                  src={getProductImageUrl(product.image)}
                  alt={product.name} 
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = ASSET_URLS.PLACEHOLDERS.PRODUCT;
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  {product.reviewCount > 0 && (
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <StarRating rating={product.averageRating} />
                      <strong className="text-gray-800">{product.averageRating.toFixed(1)}</strong>
                      <span>({product.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {(expandedProducts.includes(product.id) 
                  ? product.reviews 
                  : product.reviews.slice(0, 1)
                ).map(review => (
                  <div key={review.id} className="bg-white rounded-xl shadow-sm p-5 flex gap-5">
                    <img 
                      src={review.avatar}
                      alt={review.customerName} 
                      className="w-14 h-14 rounded-full" 
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-800">{review.customerName}</h4>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                      <span className="text-xs text-gray-400 mt-2 text-right block">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {product.reviews.length > 1 && (
                <button 
                  onClick={() => toggleExpanded(product.id)} 
                  className="mt-4 text-primary font-semibold hover:underline"
                >
                  {expandedProducts.includes(product.id) 
                    ? 'Show Less' 
                    : `View All ${product.reviews.length} Reviews`
                  }
                </button>
              )}
            </div>
          )
        ))}
        
        {productReviews.every(p => p.reviews.length === 0) && (
          <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your products haven't received any reviews yet.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
