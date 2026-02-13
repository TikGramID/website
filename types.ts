export interface Product {
  id: string;
  name: string;
  category: 'Semen' | 'Besi' | 'Cat' | 'Bata' | 'Kayu' | 'Lainnya';
  price: number;
  stock: number;
  unit: string;
  weightKg: number;
  image: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string; // Denormalized for easier display
  type: 'IN' | 'OUT';
  quantity: number;
  totalPrice: number;
  timestamp: string; // ISO String
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DailyStat {
  date: string;
  revenue: number;
}

export interface MonthlyStat {
  month: string;
  revenue: number;
}