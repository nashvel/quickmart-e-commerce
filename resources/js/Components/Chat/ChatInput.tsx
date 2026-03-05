import { useState } from 'react';
import { Send } from 'lucide-react';
import { Product } from '@/types/product';
import ProductAttachment from './ProductAttachment';

interface ChatInputProps {
    onSend: (message: string, productId?: number) => void;
    disabled?: boolean;
    attachedProduct?: Product | null;
    onRemoveProduct?: () => void;
}

export default function ChatInput({ 
    onSend, 
    disabled = false,
    attachedProduct = null,
    onRemoveProduct
}: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() || attachedProduct) {
            onSend(message, attachedProduct?.id);
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-3 border-t bg-white rounded-b-lg">
            {attachedProduct && onRemoveProduct && (
                <ProductAttachment 
                    product={attachedProduct} 
                    onRemove={onRemoveProduct}
                />
            )}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={attachedProduct ? "Add a message (optional)..." : "Type a message..."}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={disabled}
                />
                <button
                    onClick={handleSend}
                    disabled={disabled || (!message.trim() && !attachedProduct)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
