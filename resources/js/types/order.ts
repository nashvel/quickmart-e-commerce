export interface OrderItem {
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled' | 'rejected';
  delivery_full_name: string;
  delivery_phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  rider_id?: number | null;
  rider_first_name?: string | null;
  rider_last_name?: string | null;
  items: OrderItem[];
}

export interface Rider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}
