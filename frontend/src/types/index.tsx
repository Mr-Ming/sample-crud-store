export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  marketing_blurb?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
} 