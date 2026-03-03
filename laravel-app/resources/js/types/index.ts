export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar?: string;
    is_verified: boolean;
    is_blacklisted: boolean;
    role: 'customer' | 'client' | 'rider' | 'admin';
    store?: Store;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: 'customer' | 'client' | 'rider' | 'admin';
    display_name: string;
}

export interface Store {
    id: number;
    client_id: number;
    name: string;
    description?: string;
    address: string;
    logo?: string;
    cover_photo?: string;
    phone_number?: string;
    delivery_fee: number;
    store_type: 'convenience' | 'restaurant';
    is_active: boolean;
    latitude?: number;
    longitude?: number;
}

export interface Product {
    id: number;
    store_id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
    is_active: boolean;
    is_approved: boolean;
    product_type?: string;
    sales_count: number;
    store: Store;
    category: Category;
    variants?: ProductVariant[];
    addons?: AddOn[];
}

export interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    name: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
}

export interface Category {
    id: number;
    name: string;
    icon?: string;
    parent_id?: number;
    children?: Category[];
}

export interface CartItem {
    id: number;
    cartItemId: number;
    user_id: number;
    product_id: number;
    variant_id?: number;
    quantity: number;
    price: number;
    total_price: number;
    name: string;
    image?: string;
    variant_details?: any;
    product: Product;
    variant?: ProductVariant;
    addons?: CartItemAddon[];
    addOns?: any[];
}

export interface CartItemAddon {
    id: number;
    cart_item_id: number;
    addon_id: number;
    addon_variant_id?: number;
    quantity: number;
    price: number;
    addon: AddOn;
}

export interface AddOn {
    id: number;
    store_id: number;
    category_id: number;
    name: string;
    price: number;
    image?: string;
    is_active: boolean;
    variants?: AddOnVariant[];
}

export interface AddOnVariant {
    id: number;
    addon_id: number;
    name: string;
    price: number;
}

export interface Order {
    id: number;
    customer_id: number;
    store_id: number;
    rider_id?: number;
    total_amount: number;
    delivery_fee: number;
    status: OrderStatus;
    delivery_address_id: number;
    payment_method: string;
    notes?: string;
    customer: User;
    store: Store;
    rider?: User;
    items: OrderItem[];
    address: Address;
    created_at: string;
    updated_at: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'in_transit' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    total_price: number;
    product: Product;
    addons?: OrderItemAddon[];
}

export interface OrderItemAddon {
    id: number;
    order_item_id: number;
    addon_id: number;
    addon_variant_id?: number;
    quantity: number;
    price: number;
    addon: AddOn;
}

export interface Address {
    id: number;
    user_id: number;
    full_name: string;
    phone: string;
    line1: string;
    city: string;
    province?: string;
    zip_code: string;
    latitude?: number;
    longitude?: number;
    is_default: boolean;
}

export interface Chat {
    id: number;
    store_id: number;
    customer_id: number;
    order_id?: number;
    store: Store;
    customer: User;
    last_message?: ChatMessage;
    created_at: string;
}

export interface ChatMessage {
    id: number;
    chat_id: number;
    sender_id: number;
    message: string;
    image?: string;
    is_deleted: boolean;
    sender: User;
    created_at: string;
}

export interface Notification {
    id: number;
    user_id: number;
    message: string;
    link?: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

export interface Promotion {
    id: number;
    title: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    start_date: string;
    end_date: string;
    image?: string;
    is_active: boolean;
}

export interface PageProps<T = Record<string, unknown>> {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
    [key: string]: any;
}

export interface Chat {
    id: number;
    store_id: number;
    customer_id: number;
    order_id?: number;
    store: Store;
    customer: User;
    last_message?: ChatMessage;
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: number;
    chat_id: number;
    sender_id: number;
    message: string;
    is_deleted: boolean;
    sender: User;
    media?: ChatMessageMedia[];
    created_at: string;
}

export interface ChatMessageMedia {
    id: number;
    media_type: 'image' | 'video' | 'audio' | 'file';
    media_url: string;
    thumbnail_url?: string;
}

export interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    status: 'locked' | 'in-progress' | 'unlocked';
    progress: number;
    current: number;
    goal: number;
}

export interface RiderAchievement {
    id: number;
    rider_id: number;
    achievement_id: number;
    progress: number;
    unlocked_at?: string;
}
