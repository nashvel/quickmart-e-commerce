import { motion } from 'framer-motion';
import { ChatStore } from '@/types/chat';

interface ChatMinimizedProps {
    store: ChatStore;
    onClick: () => void;
}

export default function ChatMinimized({ store, onClick }: ChatMinimizedProps) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
        >
            <button
                onClick={onClick}
                className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label={`Open chat with ${store.name}`}
            >
                {store.logo_url ? (
                    <img
                        src={store.logo_url}
                        alt={store.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <span className="text-white font-semibold text-lg">{store.name.charAt(0)}</span>
                )}
            </button>
        </motion.div>
    );
}
