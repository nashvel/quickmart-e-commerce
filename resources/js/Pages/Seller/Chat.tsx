import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Send, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface Chat {
  id: number;
  customer_id: number;
  store_id: number;
  customer_name: string;
  store_name: string;
  last_message_at: string;
  unread_count: number;
}

interface Props {
  chats: Chat[];
  stores: any[];
}

export default function SellerChat({ chats: initialChats }: Props) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = (window as any).Laravel?.user?.id;

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async (chatId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/seller/chats/${chatId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await axios.post(`/api/seller/chats/${selectedChat.id}/messages`, {
        message: newMessage.trim()
      });

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
        setNewMessage('');
        
        // Update chat's last message time
        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id 
            ? { ...chat, last_message_at: new Date().toISOString() }
            : chat
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const parseMessage = (messageText: string) => {
    // Check if message contains product data
    const productMatch = messageText.match(/\[PRODUCT\](.*?)\[\/PRODUCT\]/s);
    if (productMatch) {
      try {
        const productData = JSON.parse(productMatch[1]);
        const textBefore = messageText.substring(0, productMatch.index);
        const textAfter = messageText.substring(productMatch.index! + productMatch[0].length);
        
        return {
          hasProduct: true,
          productData,
          textBefore: textBefore.trim(),
          textAfter: textAfter.trim()
        };
      } catch (e) {
        return { hasProduct: false, text: messageText };
      }
    }
    return { hasProduct: false, text: messageText };
  };

  return (
    <DashboardLayout role="seller">
      <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Contact List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No chats found' : 'No messages yet'}
              </div>
            ) : (
              filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 flex items-center gap-3 cursor-pointer border-b border-gray-100 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-primary/10' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {getInitials(chat.customer_name)}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">
                        {chat.customer_name}
                      </span>
                      {chat.unread_count > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 font-medium">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(chat.last_message_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div className="w-2/3 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  {getInitials(selectedChat.customer_name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedChat.customer_name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedChat.store_name}</p>
                </div>
              </div>

              {/* Message Area */}
              <div className="flex-grow p-6 overflow-y-auto bg-gray-100">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map(msg => {
                    const parsed = parseMessage(msg.message);
                    const isSender = msg.sender_id === currentUserId;
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex items-end gap-3 my-3 ${
                          isSender ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {!isSender && (
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {getInitials(msg.sender.first_name + ' ' + msg.sender.last_name)}
                          </div>
                        )}
                        <div 
                          className={`px-4 py-2 rounded-2xl max-w-lg ${
                            isSender 
                              ? 'bg-primary text-white rounded-br-none' 
                              : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {parsed.hasProduct ? (
                            <>
                              {parsed.textBefore && <p className="mb-2">{parsed.textBefore}</p>}
                              <div className="bg-white/10 rounded-lg p-3 my-2">
                                <div className="flex gap-3">
                                  <img 
                                    src={parsed.productData.image} 
                                    alt={parsed.productData.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm">{parsed.productData.name}</p>
                                    <p className="text-sm opacity-90">₱{parsed.productData.price}</p>
                                    <p className="text-xs opacity-75">{parsed.productData.stock} in stock</p>
                                  </div>
                                </div>
                              </div>
                              {parsed.textAfter && <p className="mt-2">{parsed.textAfter}</p>}
                            </>
                          ) : (
                            <p>{parsed.text}</p>
                          )}
                          <div className={`text-xs text-right mt-1 ${isSender ? 'opacity-70' : 'text-gray-500'}`}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messageEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full pr-14 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Send size={40} className="text-gray-400" />
              </div>
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a customer to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
