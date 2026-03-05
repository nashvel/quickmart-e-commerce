import { X } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductAttachmentProps {
    product: Product;
    onRemove: () => void;
}

export default function ProductAttachment({ product, onRemove }: ProductAttachmentProps) {
    const price = product.price ? parseFloat(product.price) : 0;
    const stock = product.stock || 0;
    
    return (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-2">
            <div className="flex items-start gap-3">
                <img
                    src={`/storage/products/${product.image}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                    <p className="text-primary-600 font-bold text-sm">
                        ₱{!isNaN(price) ? price.toFixed(2) : '0.00'}
                    </p>
                    {stock > 0 ? (
                        <p className="text-xs text-green-600">In Stock ({stock})</p>
                    ) : (
                        <p className="text-xs text-red-600">Out of Stock</p>
                    )}
                </div>
                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
                    aria-label="Remove product attachment"
                >
                    <X size={16} className="text-gray-600" />
                </button>
            </div>
        </div>
    );
}
