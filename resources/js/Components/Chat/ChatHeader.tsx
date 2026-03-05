import { X, Minimize2 } from 'lucide-react';
import { ChatStore } from '@/types/chat';

interface ChatHeaderProps {
    store: ChatStore;
    onMinimize: () => void;
    onClose: () => void;
}

export default function ChatHeader({ store, onMinimize, onClose }: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
                {store.logo_url ? (
                    <img
                        src={store.logo_url}
                        alt={store.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">{store.name.charAt(0)}</span>
                    </div>
                )}
                <span className="font-semibold truncate">{store.name}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <button
                    onClick={onMinimize}
                    className="p-1.5 hover:bg-blue-700 rounded-full transition-colors"
                    aria-label="Minimize chat"
                >
                    <Minimize2 size={16} />
                </button>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-blue-700 rounded-full transition-colors"
                    aria-label="Close chat"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
