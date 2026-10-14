export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  old_price?: number;
  discount?: number;
  description: string;
  sizes: string[];
  colors: string[];
  image_url: string;
  thumbnails: string[];
  is_featured: boolean;
  is_new: boolean;
  stock: number;
  outfit_layer_type?: 'jacket' | 'shirt' | 'pants' | 'shoes' | 'accessory';
  created_at?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image_url: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  map_link?: string;
  notes?: string;
  items: CartItem[];
  total_amount: number;
  status: 'Yangi' | 'Tasdiqlandi' | 'Tayyorlanmoqda' | 'Yetkazilmoqda' | 'Bajarildi' | 'Bekor qilindi';
  telegram_sent: number;
  created_at: string;
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  newOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  canceledOrders: number;
  totalSales: number;
}
