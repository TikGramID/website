import React from 'react';
import { ShoppingCart, LayoutDashboard, Store, Hammer, Menu } from 'lucide-react';

interface NavbarProps {
  currentView: 'STORE' | 'ADMIN';
  setView: (view: 'STORE' | 'ADMIN') => void;
  cartCount: number;
  toggleCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, cartCount, toggleCart }) => {
  return (
    <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('STORE')}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Hammer className="h-6 w-6 text-background-dark fill-current" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight hidden md:block text-white">
            BANGUN<span className="text-primary">HUB</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex bg-card-dark border border-border-dark rounded-full p-1">
              <button
                onClick={() => setView('STORE')}
                className={`flex items-center px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  currentView === 'STORE' ? 'bg-primary text-background-dark shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4 mr-2" />
                Store
              </button>
              <button
                onClick={() => setView('ADMIN')}
                className={`flex items-center px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  currentView === 'ADMIN' ? 'bg-primary text-background-dark shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin
              </button>
            </div>

          <h2 className="hidden lg:block text-sm font-bold uppercase tracking-widest text-slate-500">
            Premium Materials
          </h2>
          
          <button 
            onClick={toggleCart}
            className="relative p-2 hover:bg-card-dark rounded-lg transition-colors group"
          >
            <ShoppingCart className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-background-dark bg-primary rounded-full transform translate-x-1/4 -translate-y-1/4">
                {cartCount}
              </span>
            )}
          </button>

          <button className="md:hidden p-2 hover:bg-card-dark rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;