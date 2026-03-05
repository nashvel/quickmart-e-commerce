import { ChatMessage } from '@/types/chat';

interface ChatMessagesProps {
    messages: ChatMessage[];
    currentUserId: number;
    storeName: string;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

interface ProductInfo {
    name: string;
    price: string;
    url: string;
    image: string;
}

function parseProductInfo(message: string): { text: string; product: ProductInfo | null } {
    const productMatch = message.match(/\[PRODUCT\](.*?)\[\/PRODUCT\]/s);
    
    if (productMatch) {
        try {
            const productData = JSON.parse(productMatch[1]);
            const text = message.replace(/\[PRODUCT\].*?\[\/PRODUCT\]/s, '').trim();
            return { text, product: productData };
        } catch (e) {
            return { text: message, product: null };
        }
    }
    
    return { text: message, product: null };
}

function ProductCard({ product }: { product: ProductInfo }) {
    return (
        <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors bg-white"
        >
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover"
            />
            <div className="p-2">
                <p className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</p>
                <p className="text-blue-600 font-bold text-sm mt-1">{product.price}</p>
            </div>
        </a>
    );
}

export default function ChatMessages({
    messages,
    currentUserId,
    storeName,
    messagesEndRef,
}: ChatMessagesProps) {
    if (messages.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="text-center text-gray-500 text-sm mt-8">
                    Start a conversation with {storeName}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => {
                const { text, product } = parseProductInfo(message.message);
                const isOwn = message.sender_id === currentUserId;

                return (
                    <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                            {product && (
                                <div className="mb-1 w-48">
                                    <ProductCard product={product} />
                                </div>
                            )}
                            {text && (
                                <div
                                    className={`px-3 py-2 rounded-lg ${
                                        isOwn
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-900 border border-gray-200'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
                                </div>
                            )}
                            <p
                                className={`text-xs mt-1 ${
                                    isOwn ? 'text-gray-500' : 'text-gray-500'
                                }`}
                            >
                                {new Date(message.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
