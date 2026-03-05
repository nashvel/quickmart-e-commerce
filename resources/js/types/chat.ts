export interface ChatMessage {
    id: number;
    message: string;
    sender_id: number;
    created_at: string;
    is_read: boolean;
}

export interface ChatStore {
    id: number;
    name: string;
    logo_url?: string;
}

export interface Chat {
    id: number;
    customer_id: number;
    store_id: number;
    store: ChatStore;
    messages: ChatMessage[];
    last_message?: ChatMessage;
    last_message_at: string;
}

export interface ChatResponse {
    data: Chat;
}

export interface ChatsResponse {
    data: Chat[];
}

export interface MessagesResponse {
    data: ChatMessage[];
}
