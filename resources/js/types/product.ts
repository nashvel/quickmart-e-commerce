export interface ProductVariant {
    id: number;
    sku: string;
    price: string;
    original_price?: string;
    stock: number;
    image?: string;
    image_url?: string;
    attributes?: {
        Color?: string;
        Size?: string;
    };
}

export interface ProductStore {
    id: number;
    name: string;
    logo_url?: string;
    owner?: {
        id: number;
    };
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    original_price?: string;
    stock: number;
    image: string;
    rating: number;
    review_count: number;
    product_type: 'simple' | 'variable';
    variants: ProductVariant[];
    store?: ProductStore;
    store_id?: number;
    parent_category_name?: string;
    category_name?: string;
}
