import React from 'react';
import { X, Trash2, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}) => {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalWeight = cart.reduce((acc, item) => acc + (item.weightKg * item.quantity), 0);

  const shippingCost = totalWeight > 0 ? Math.ceil(totalWeight / 50) * 50000 : 0; 

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-card-dark border-l border-border-dark z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border-dark flex items-center justify-between bg-background-dark">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Keranjang Belanja
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-card-dark rounded-lg text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                <Truck className="w-16 h-16 mb-4 opacity-20" />
                <p>Keranjang masih kosong</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-background-dark border border-border-dark rounded-xl">
                  <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-border-dark">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-primary font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-slate-500 mt-1">Berat: {(item.weightKg * item.quantity).toFixed(1)} kg</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-card-dark border border-border-dark rounded-lg">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-3 py-1 text-slate-400 hover:text-white hover:bg-border-dark rounded-l-lg transition-colors"
                        >-</button>
                        <span className="px-2 text-sm font-medium w-8 text-center text-slate-200">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-3 py-1 text-slate-400 hover:text-white hover:bg-border-dark rounded-r-lg transition-colors"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-background-dark border-t border-border-dark">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal ({totalItems} item)</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Estimasi Ongkir ({totalWeight.toFixed(1)} kg)</span>
                  <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-border-dark pt-4 flex justify-between font-extrabold text-lg text-primary">
                  <span>Total</span>
                  <span>Rp {(totalPrice + shippingCost).toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <button 
                onClick={onCheckout}
                className="w-full bg-primary hover:bg-yellow-500 text-background-dark py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-primary/20"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proses Pembayaran</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;