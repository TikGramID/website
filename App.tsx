import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import AdminView from './components/AdminView';
import LoginModal from './components/LoginModal';
import { INITIAL_PRODUCTS, GENERATE_MOCK_TRANSACTIONS } from './constants';
import { Product, CartItem, Transaction } from './types';
import { ShoppingBasket, Package } from 'lucide-react';

const App: React.FC = () => {
  // --- Global State ---
  const [currentView, setCurrentView] = useState<'STORE' | 'ADMIN'>('STORE');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // "Database" States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize Mock Data once
  useEffect(() => {
    setTransactions(GENERATE_MOCK_TRANSACTIONS());
  }, []);

  // --- Handlers ---

  const handleViewChange = (view: 'STORE' | 'ADMIN') => {
    if (view === 'ADMIN' && !isAdminLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleLogin = (password: string) => {
    // Hardcoded password for demonstration
    if (password === 'admin123') {
      setIsAdminLoggedIn(true);
      setIsLoginModalOpen(false);
      setCurrentView('ADMIN');
      return true;
    }
    return false;
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
            alert("Maaf, stok tidak mencukupi untuk menambah item ini.");
            return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Optional: Auto open cart on add? Let's keep it closed to match the "Selection" flow
    // setIsCartOpen(true); 
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        // Check stock limit when increasing
        const product = products.find(p => p.id === id);
        if (delta > 0 && product && item.quantity >= product.stock) {
            return item; // Max stock reached
        }
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 1. Create Transactions
    const newTransactions: Transaction[] = cart.map(item => ({
      id: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: item.id,
      productName: item.name,
      type: 'OUT',
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
      timestamp: new Date().toISOString()
    }));

    // 2. Update Inventory
    setProducts(prev => prev.map(prod => {
      const cartItem = cart.find(c => c.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    }));

    // 3. Update Transaction Log
    setTransactions(prev => [...prev, ...newTransactions]);

    // 4. Reset Cart
    setCart([]);
    setIsCartOpen(false);
    alert('Transaksi Berhasil! Stok telah diperbarui.');
  };

  const handleRestock = (productId: string, amount: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + amount } : p));
    const newTransaction: Transaction = {
      id: `RESTOCK-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type: 'IN',
      quantity: amount,
      totalPrice: -(product.price * 0.7 * amount),
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display selection:bg-primary selection:text-background-dark">
      <Navbar 
        currentView={currentView} 
        setView={handleViewChange} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'STORE' ? (
          <>
            {/* Stepper */}
            <div className="mb-12">
              <div className="flex items-center justify-between max-w-3xl mx-auto relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-dark -translate-y-1/2 z-0"></div>
                <div className="absolute top-1/2 left-0 w-1/4 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-primary text-background-dark rounded-full flex items-center justify-center font-bold ring-4 ring-background-dark shadow-lg shadow-primary/20">1</div>
                  <span className="text-xs font-bold text-primary">Material</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-card-dark text-slate-500 rounded-full flex items-center justify-center font-bold ring-4 ring-background-dark border border-border-dark">2</div>
                  <span className="text-xs font-medium text-slate-500">Spesifikasi</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-card-dark text-slate-500 rounded-full flex items-center justify-center font-bold ring-4 ring-background-dark border border-border-dark">3</div>
                  <span className="text-xs font-medium text-slate-500">Pengiriman</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-card-dark text-slate-500 rounded-full flex items-center justify-center font-bold ring-4 ring-background-dark border border-border-dark">4</div>
                  <span className="text-xs font-medium text-slate-500">Konfirmasi</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Filters */}
              <aside className="hidden lg:block lg:col-span-3 space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Kategori</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-bold border border-primary/20 transition-all">Semua Material</button>
                    <button className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-card-dark text-slate-400 hover:text-white transition-colors">Semen & Cor</button>
                    <button className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-card-dark text-slate-400 hover:text-white transition-colors">Besi & Baja</button>
                    <button className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-card-dark text-slate-400 hover:text-white transition-colors">Dinding & Lantai</button>
                    <button className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-card-dark text-slate-400 hover:text-white transition-colors">Cat & Finishing</button>
                  </div>
                </div>
                <div className="p-6 bg-card-dark rounded-xl border border-border-dark">
                  <h3 className="text-sm font-bold mb-4 text-slate-200">Info Layanan</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Pengiriman tersedia untuk area Jabodetabek. Gratis ongkir untuk pembelian di atas 5 ton.
                  </p>
                </div>
              </aside>

              {/* Product Catalog */}
              <div className="lg:col-span-9 space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 text-sm">Menampilkan <span className="text-white font-bold">{products.length}</span> Material Premium</p>
                    <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Urutkan:</span>
                    <select className="bg-card-dark border-border-dark text-slate-300 text-xs rounded-lg focus:ring-primary focus:border-primary p-2">
                        <option>Terbaru</option>
                        <option>Harga Tertinggi</option>
                        <option>Harga Terendah</option>
                    </select>
                    </div>
                </div>

                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
            
            {/* Right Summary Sidebar (Desktop 2XL only) */}
            <div className="fixed right-8 top-32 w-80 hidden 2xl:block animate-fade-in-up">
              <div className="bg-card-dark rounded-xl border border-border-dark overflow-hidden shadow-2xl">
                <div className="p-6 bg-primary text-background-dark">
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <ShoppingBasket className="w-6 h-6" />
                    Keranjang
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="flex items-center justify-center py-10 flex-col gap-4 text-slate-600">
                      <Package className="w-12 h-12 opacity-20" />
                      <p className="text-sm text-center">Keranjang masih kosong.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-slate-300 truncate w-32">{item.name}</span>
                                <span className="text-primary">x{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                  )}
                  
                  <div className="border-t border-border-dark pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm text-slate-400">Subtotal</span>
                      <span className="text-xl font-bold text-primary">Rp {cartTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${
                            cart.length > 0 
                            ? 'bg-slate-100 text-background-dark hover:bg-white' 
                            : 'bg-border-dark text-slate-500 cursor-not-allowed'
                        }`}
                        disabled={cart.length === 0}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full lg:hidden bg-card-dark/90 backdrop-blur-lg border-t border-border-dark p-4 z-40">
                <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">
                <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Estimasi</span>
                <span className="text-lg font-black text-primary">Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="bg-primary/20 text-primary px-8 py-3 rounded-xl font-bold border border-primary/30 flex items-center gap-2 hover:bg-primary/30"
                >
                    Selanjutnya
                </button>
                </div>
            </div>
          </>
        ) : (
          <div className="lg:max-w-7xl mx-auto">
             <AdminView 
                products={products}
                transactions={transactions}
                onRestock={handleRestock}
            />
          </div>
        )}
      </main>

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;