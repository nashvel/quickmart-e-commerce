import { useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

interface ProductReviewsProps {
    productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews] = useState<Review[]>([
        {
            id: 1,
            user: 'John Doe',
            rating: 5,
            comment: 'Great product! Highly recommended.',
            date: '2024-01-15',
        },
        {
            id: 2,
            user: 'Jane Smith',
            rating: 4,
            comment: 'Good quality, fast delivery.',
            date: '2024-01-10',
        },
    ]);

    return (
        <div className="space-y-6">
            {reviews.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-semibold">
                                        {review.user.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{review.user}</p>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={
                                                    i < review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-700 ml-13">{review.comment}</p>
                    </div>
                ))
            )}
        </div>
    );
}
