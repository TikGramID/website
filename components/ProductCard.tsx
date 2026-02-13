import React from 'react';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative bg-card-dark border border-border-dark p-6 rounded-xl hover:border-primary transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 border border-border-dark">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
            {product.category}
          </span>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500">
            Berat: {product.weightKg}kg • Satuan: {product.unit}
          </p>
          
          <div className="flex items-center gap-2 pt-2">
            {isOutOfStock ? (
               <div className="flex items-center gap-1 text-red-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">Stok Habis</span>
               </div>
            ) : isLowStock ? (
               <div className="flex items-center gap-1 text-orange-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">Stok Menipis: {product.stock}</span>
               </div>
            ) : (
                <div className="flex items-center gap-1 text-green-500">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs">Stok Tersedia: {product.stock}</span>
                </div>
            )}
            
            {product.weightKg > 50 && (
               <div className="hidden sm:flex items-center gap-1 text-slate-500 ml-3">
                  <Truck className="w-3 h-3" />
                  <span className="text-xs">Cargo</span>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Harga Satuan</span>
          <span className="text-2xl font-black text-primary">
            Rp {product.price.toLocaleString('id-ID')}
            <span className="text-sm font-normal text-slate-400 ml-1">/{product.unit}</span>
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
            isOutOfStock 
              ? 'bg-border-dark text-slate-500 cursor-not-allowed'
              : 'bg-primary hover:bg-yellow-400 text-background-dark shadow-lg shadow-primary/20'
          }`}
        >
          {isOutOfStock ? 'Habis' : 'Pilih Material'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;