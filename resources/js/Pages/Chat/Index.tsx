import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Chat, ChatMessage, PageProps } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ChatIndex({ auth }: PageProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchChats = async () => {
        try {
            const response = await axios.get('/api/chats');
            setChats(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch chats:', error);
        }
    };

    const fetchMessages = async (chatId: number) => {
        try {
            const response = await axios.get(`/api/chats/${chatId}/messages`);
            setMessages(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        setLoading(true);
        try {
            await axios.post(`/api/chats/${selectedChat.id}/messages`, {
                message: newMessage,
            });
            setNewMessage('');
            await fetchMessages(selectedChat.id);
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AppLayout>
            <Head title="Messages" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
                            {/* Chat List */}
                            <div className="border-r overflow-y-auto">
                                {chats.length === 0 ? (
                                    <div className="p-4 text-center text-gray-600">
                                        No conversations yet
                                    </div>
                                ) : (
                                    chats.map((chat) => (
                                        <div
                                            key={chat.id}
                                            onClick={() => setSelectedChat(chat)}
                                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                                selectedChat?.id === chat.id ? 'bg-primary-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                                                    {chat.store.logo ? (
                                                        <img
                                                            src={chat.store.logo}
                                                            alt={chat.store.name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-600 font-semibold">
                                                            {chat.store.name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">
                                                        {chat.store.name}
                                                    </p>
                                                    {chat.last_message && (
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {chat.last_message.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Messages Area */}
                            <div className="md:col-span-2 flex flex-col">
                                {selectedChat ? (
                                    <>
                                        {/* Chat Header */}
                                        <div className="p-4 border-b">
                                            <h2 className="font-semibold text-lg">
                                                {selectedChat.store.name}
                                            </h2>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${
                                                        message.sender_id === auth.user?.id
                                                            ? 'justify-end'
                                                            : 'justify-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                            message.sender_id === auth.user?.id
                                                                ? 'bg-primary-600 text-white'
                                                                : 'bg-gray-200 text-gray-900'
                                                        }`}
                                                    >
                                                        <p>{message.message}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${
                                                                message.sender_id === auth.user?.id
                                                                    ? 'text-primary-100'
                                                                    : 'text-gray-600'
                                                            }`}
                                                        >
                                                            {new Date(message.created_at).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Message Input */}
                                        <div className="p-4 border-t">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                    placeholder="Type a message..."
                                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                                <button
                                                    onClick={sendMessage}
                                                    disabled={loading || !newMessage.trim()}
                                                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500">
                                        Select a conversation to start messaging
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
