import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ChatMessage } from '@/types/chat';
import axios from 'axios';

export function useChat(storeId: number, currentUserId: number) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatId, setChatId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initializeChat();
    }, [storeId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const initializeChat = async () => {
        try {
            const response = await axios.get(`/api/chats/${storeId}/create`);
            const chatData = response.data.chat;
            if (chatData) {
                setChatId(chatData.id);
                setMessages(chatData.messages || []);
            }
        } catch (error) {
            console.error('Failed to initialize chat:', error);
            toast.error('Failed to initialize chat');
        }
    };

    const sendMessage = async (message: string) => {
        if (!message.trim() || !chatId) return;

        setLoading(true);
        try {
            await axios.post(`/api/chats/${chatId}/messages`, { message });
            
            // Refresh messages
            const response = await axios.get(`/api/chats/${chatId}/messages`);
            if (response.data.messages) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        chatId,
        loading,
        messagesEndRef,
        sendMessage,
    };
}
