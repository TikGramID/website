import { Product, Transaction } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'P001',
    name: 'Semen Tiga Roda 50kg',
    category: 'Semen',
    price: 65000,
    stock: 150,
    unit: 'sak',
    weightKg: 50,
    image: 'https://picsum.photos/id/201/300/300'
  },
  {
    id: 'P002',
    name: 'Cat Tembok Dulux 25kg',
    category: 'Cat',
    price: 1250000,
    stock: 8, // Low stock simulation
    unit: 'pail',
    weightKg: 25,
    image: 'https://picsum.photos/id/202/300/300'
  },
  {
    id: 'P003',
    name: 'Besi Beton 10mm Full',
    category: 'Besi',
    price: 78000,
    stock: 500,
    unit: 'btg',
    weightKg: 7.4,
    image: 'https://picsum.photos/id/203/300/300'
  },
  {
    id: 'P004',
    name: 'Bata Merah Jumbo',
    category: 'Bata',
    price: 850,
    stock: 5000,
    unit: 'pcs',
    weightKg: 1.5,
    image: 'https://picsum.photos/id/204/300/300'
  },
  {
    id: 'P005',
    name: 'Pasir Muntilan 1 Rit',
    category: 'Lainnya',
    price: 1800000,
    stock: 5,
    unit: 'rit',
    weightKg: 1500,
    image: 'https://picsum.photos/id/206/300/300'
  },
  {
    id: 'P006',
    name: 'Keramik Lantai 40x40 Putih',
    category: 'Lainnya',
    price: 65000,
    stock: 200,
    unit: 'dus',
    weightKg: 15,
    image: 'https://picsum.photos/id/208/300/300'
  }
];

// Helper to generate mock transactions for the last 30 days
export const GENERATE_MOCK_TRANSACTIONS = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const product = INITIAL_PRODUCTS[Math.floor(Math.random() * INITIAL_PRODUCTS.length)];
    const qty = Math.floor(Math.random() * 10) + 1;
    const type = Math.random() > 0.3 ? 'OUT' : 'IN'; // More sales than restocks
    
    transactions.push({
      id: `TRX-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      type: type,
      quantity: qty,
      totalPrice: type === 'OUT' ? product.price * qty : -(product.price * 0.7 * qty), // Cost is 70% of price
      timestamp: date.toISOString()
    });
  }
  
  // Sort by date ascending
  return transactions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};