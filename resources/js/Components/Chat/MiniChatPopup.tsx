import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { ChatStore } from '@/types/chat';
import { Product } from '@/types/product';
import ChatHeader from './ChatHeader';
import ChatMinimized from './ChatMinimized';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface MiniChatPopupProps {
    store: ChatStore;
    currentUserId: number;
    onClose: () => void;
    attachedProduct?: Product | null;
}

export default function MiniChatPopup({ 
    store, 
    currentUserId, 
    onClose,
    attachedProduct = null
}: MiniChatPopupProps) {
    const [minimized, setMinimized] = useState(false);
    const [productAttachment, setProductAttachment] = useState<Product | null>(attachedProduct);
    const { messages, loading, messagesEndRef, sendMessage } = useChat(store.id, currentUserId);

    const handleSendMessage = (message: string, productId?: number) => {
        let finalMessage = message;
        
        if (productId && productAttachment) {
            // Format message with product as structured data
            const productData = {
                name: productAttachment.name,
                price: `₱${parseFloat(productAttachment.price).toFixed(2)}`,
                url: `${window.location.origin}/products/${productId}`,
                image: `/storage/products/${productAttachment.image}`,
            };
            
            const productTag = `[PRODUCT]${JSON.stringify(productData)}[/PRODUCT]`;
            finalMessage = message ? `${message}\n${productTag}` : productTag;
        }
        
        sendMessage(finalMessage);
        setProductAttachment(null);
    };

    if (minimized) {
        return <ChatMinimized store={store} onClick={() => setMinimized(false)} />;
    }

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-2xl z-50 flex flex-col"
            style={{ height: '500px' }}
        >
            <ChatHeader
                store={store}
                onMinimize={() => setMinimized(true)}
                onClose={onClose}
            />

            <ChatMessages
                messages={messages}
                currentUserId={currentUserId}
                storeName={store.name}
                messagesEndRef={messagesEndRef}
            />

            <ChatInput 
                onSend={handleSendMessage} 
                disabled={loading}
                attachedProduct={productAttachment}
                onRemoveProduct={() => setProductAttachment(null)}
            />
        </motion.div>
    );
}
