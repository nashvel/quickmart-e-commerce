import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
  Send, 
  Search, 
  Image as ImageIcon, 
  Video, 
  X 
} from 'lucide-react';

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  media?: Array<{
    id: number;
    media_type: 'image' | 'video';
    media_url: string;
  }>;
}

interface Chat {
  id: number;
  other_user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  last_message?: {
    message?: string;
    media_type?: string;
  };
}

// Mock data
const mockChats: Chat[] = [
  {
    id: 1,
    other_user: {
      id: 101,
      first_name: 'Juan',
      last_name: 'Dela Cruz',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    last_message: {
      message: 'Is this product still available?'
    }
  },
  {
    id: 2,
    other_user: {
      id: 102,
      first_name: 'Maria',
      last_name: 'Santos',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    last_message: {
      message: 'When will my order arrive?'
    }
  },
  {
    id: 3,
    other_user: {
      id: 103,
      first_name: 'Jose',
      last_name: 'Garcia',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    last_message: {
      message: 'Thank you for the fast delivery!'
    }
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 101,
    text: 'Hi! Is this product still available?',
    timestamp: '2024-03-15T10:30:00'
  },
  {
    id: 2,
    senderId: 1, // seller
    text: 'Yes, it is! We have 5 units in stock.',
    timestamp: '2024-03-15T10:31:00'
  },
  {
    id: 3,
    senderId: 101,
    text: 'Great! Can you ship to Quezon City?',
    timestamp: '2024-03-15T10:32:00'
  },
  {
    id: 4,
    senderId: 1, // seller
    text: 'Yes, we deliver to Quezon City. Shipping fee is ₱50.',
    timestamp: '2024-03-15T10:33:00'
  },
];

const CURRENT_USER_ID = 1; // seller ID

export default function SellerChat() {
  const [chats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      // Load messages for selected chat
      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now(),
      senderId: CURRENT_USER_ID,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const renderLastMessage = (lastMessage?: Chat['last_message']) => {
    if (!lastMessage) {
      return 'No messages yet';
    }
    if (lastMessage.message) {
      return lastMessage.message;
    }
    if (lastMessage.media_type) {
      const isImage = lastMessage.media_type.startsWith('image');
      return (
        <span className="flex items-center gap-1">
          {isImage ? <ImageIcon size={14} /> : <Video size={14} />}
          {isImage ? 'Image' : 'Video'}
        </span>
      );
    }
    return '...';
  };

  const filteredChats = chats.filter(chat => {
    const fullName = `${chat.other_user.first_name} ${chat.other_user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <DashboardLayout role="seller">
      <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Contact List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 flex items-center gap-4 cursor-pointer rounded-lg transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-primary/10' : 'hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  {chat.other_user.avatar ? (
                    <img 
                      src={chat.other_user.avatar}
                      alt={`${chat.other_user.first_name} ${chat.other_user.last_name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                      {getInitials(chat.other_user.first_name, chat.other_user.last_name)}
                    </div>
                  )}
                </div>
                <div className="flex-grow overflow-hidden">
                  <span className="font-semibold text-gray-800">
                    {`${chat.other_user.first_name} ${chat.other_user.last_name}`}
                  </span>
                  <p className="text-sm text-gray-500 truncate">
                    {renderLastMessage(chat.last_message)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="w-2/3 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-gray-50">
                {selectedChat.other_user.avatar ? (
                  <img 
                    src={selectedChat.other_user.avatar}
                    alt={`${selectedChat.other_user.first_name} ${selectedChat.other_user.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                    {getInitials(selectedChat.other_user.first_name, selectedChat.other_user.last_name)}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-800">
                  {`${selectedChat.other_user.first_name} ${selectedChat.other_user.last_name}`}
                </h3>
              </div>

              {/* Message Area */}
              <div className="flex-grow p-6 overflow-y-auto bg-gray-100">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex items-end gap-3 my-2 ${
                      msg.senderId === CURRENT_USER_ID ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.senderId !== CURRENT_USER_ID && selectedChat.other_user.avatar && (
                      <img 
                        src={selectedChat.other_user.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {msg.senderId !== CURRENT_USER_ID && !selectedChat.other_user.avatar && (
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {getInitials(selectedChat.other_user.first_name, selectedChat.other_user.last_name)}
                      </div>
                    )}
                    <div 
                      className={`px-4 py-2 rounded-2xl max-w-lg ${
                        msg.senderId === CURRENT_USER_ID 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text && <p>{msg.text}</p>}
                      {msg.media && msg.media.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                          {msg.media.map(mediaItem => (
                            <div key={mediaItem.id}>
                              {mediaItem.media_type === 'image' ? (
                                <img 
                                  src={mediaItem.media_url}
                                  alt="attachment" 
                                  className="rounded-md max-w-full" 
                                />
                              ) : (
                                <video 
                                  src={mediaItem.media_url}
                                  controls 
                                  className="rounded-md max-w-full" 
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-right mt-1 opacity-70">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
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
                    className="w-full pr-28 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button className="p-2 text-gray-500 hover:text-primary">
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-primary">
                      <Video size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:bg-gray-400"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
