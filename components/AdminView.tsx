import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  Users, DollarSign, AlertCircle, ArrowUpRight, Package, RefreshCw 
} from 'lucide-react';
import { Product, Transaction } from '../types';

interface AdminViewProps {
  products: Product[];
  transactions: Transaction[];
  onRestock: (productId: string, amount: number) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ products, transactions, onRestock }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'INVENTORY'>('DASHBOARD');
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(0);

  // --- Analytics Logic ---
  const today = new Date().toISOString().split('T')[0];
  
  const dailyStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    // Initialize
    last7Days.forEach(day => stats[day] = 0);

    // Aggregate
    transactions.forEach(t => {
      const day = t.timestamp.split('T')[0];
      if (stats[day] !== undefined && t.type === 'OUT') {
        stats[day] += t.totalPrice;
      }
    });

    return last7Days.map(day => ({
      name: new Date(day).toLocaleDateString('id-ID', { weekday: 'short' }),
      omzet: stats[day]
    }));
  }, [transactions]);

  const monthlyStats = useMemo(() => {
    // Simplified monthly aggregation
    const stats: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'OUT') {
        const month = t.timestamp.substring(0, 7); // YYYY-MM
        stats[month] = (stats[month] || 0) + t.totalPrice;
      }
    });
    return Object.keys(stats).sort().map(key => ({
      name: key,
      total: stats[key]
    }));
  }, [transactions]);

  const todaysRevenue = transactions
    .filter(t => t.timestamp.startsWith(today) && t.type === 'OUT')
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const todaysTransactions = transactions
    .filter(t => t.timestamp.startsWith(today) && t.type === 'OUT')
    .length;

  // --- Handlers ---
  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockId && restockAmount > 0) {
      onRestock(restockId, restockAmount);
      setRestockId(null);
      setRestockAmount(0);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Tab Switcher */}
      <div className="flex space-x-4 border-b border-border-dark">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`py-3 px-4 font-bold text-sm transition-colors relative ${
            activeTab === 'DASHBOARD' 
              ? 'text-primary' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Dashboard & Omzet
          {activeTab === 'DASHBOARD' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
        </button>
        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`py-3 px-4 font-bold text-sm transition-colors relative ${
            activeTab === 'INVENTORY' 
              ? 'text-primary' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Inventory & Mutasi
          {activeTab === 'INVENTORY' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
        </button>
      </div>

      {activeTab === 'DASHBOARD' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card-dark p-6 rounded-xl border border-border-dark flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Omzet Hari Ini</p>
                <p className="text-2xl font-extrabold text-slate-100 mt-1">Rp {todaysRevenue.toLocaleString('id-ID')}</p>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+12.5% vs kemarin</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="bg-card-dark p-6 rounded-xl border border-border-dark flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Transaksi</p>
                <p className="text-2xl font-extrabold text-slate-100 mt-1">{todaysTransactions}</p>
                 <div className="flex items-center mt-2 text-sm text-slate-400">
                  <span>Hari ini</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-card-dark p-6 rounded-xl border border-border-dark flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Produk Menipis</p>
                <p className="text-2xl font-extrabold text-slate-100 mt-1">{products.filter(p => p.stock < 10).length}</p>
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>Perlu Restock</span>
                </div>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Package className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Revenue Bar Chart */}
            <div className="bg-card-dark p-6 rounded-xl border border-border-dark">
              <h3 className="text-lg font-bold text-slate-100 mb-6">Omzet 7 Hari Terakhir</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d35" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Omzet']}
                      contentStyle={{ backgroundColor: '#16161d', borderRadius: '8px', border: '1px solid #2d2d35', color: '#f8f8f5' }}
                      cursor={{fill: 'rgba(231, 176, 8, 0.1)'}}
                    />
                    <Bar dataKey="omzet" fill="#e7b008" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="bg-card-dark p-6 rounded-xl border border-border-dark">
              <h3 className="text-lg font-bold text-slate-100 mb-6">Tren Bulanan</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d35" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                    <Tooltip 
                       formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Omzet']}
                       contentStyle={{ backgroundColor: '#16161d', borderRadius: '8px', border: '1px solid #2d2d35', color: '#f8f8f5' }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#f8f8f5" strokeWidth={3} dot={{r: 4, fill: '#e7b008'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Table */}
          <div className="bg-card-dark rounded-xl border border-border-dark overflow-hidden">
             <div className="p-6 border-b border-border-dark flex justify-between items-center bg-background-dark">
                <h3 className="text-lg font-bold text-slate-100">Stok Gudang</h3>
                {restockId ? (
                   <form onSubmit={handleRestockSubmit} className="flex gap-2 items-center animate-fade-in">
                      <span className="text-sm font-medium text-slate-300">Restock {products.find(p => p.id === restockId)?.name}:</span>
                      <input 
                        type="number" 
                        min="1"
                        className="border border-border-dark bg-card-dark text-white rounded px-2 py-1 w-20 text-sm focus:border-primary focus:outline-none"
                        placeholder="Qty"
                        value={restockAmount || ''}
                        onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                        autoFocus
                      />
                      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-500">Simpan</button>
                      <button type="button" onClick={() => setRestockId(null)} className="bg-slate-700 text-slate-300 px-3 py-1 rounded text-sm hover:bg-slate-600">Batal</button>
                   </form>
                ) : (
                  <span className="text-sm text-slate-500 italic">Klik tombol refresh pada baris untuk restock</span>
                )}
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-card-dark text-slate-500 uppercase text-xs font-semibold border-b border-border-dark">
                   <tr>
                     <th className="px-6 py-4">Produk</th>
                     <th className="px-6 py-4">Kategori</th>
                     <th className="px-6 py-4 text-right">Harga Satuan</th>
                     <th className="px-6 py-4 text-center">Stok</th>
                     <th className="px-6 py-4 text-center">Aksi</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border-dark">
                   {products.map((product) => (
                     <tr key={product.id} className="hover:bg-background-dark/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded bg-gray-800 border border-border-dark overflow-hidden">
                             <img src={product.image} alt="" className="w-full h-full object-cover opacity-80" />
                           </div>
                           <span className="font-medium text-slate-200">{product.name}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className="px-2 py-1 rounded-full text-xs font-bold tracking-wider bg-slate-800 text-slate-300">
                           {product.category}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right font-medium text-primary">
                         Rp {product.price.toLocaleString('id-ID')}
                       </td>
                       <td className="px-6 py-4 text-center">
                         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                           ${product.stock < 10 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                           {product.stock} {product.unit}
                         </div>
                       </td>
                       <td className="px-6 py-4 text-center">
                         <button 
                            onClick={() => setRestockId(product.id)}
                            className="text-slate-400 hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                            title="Restock Barang"
                         >
                            <RefreshCw className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Recent Mutations Log */}
          <div className="bg-card-dark rounded-xl border border-border-dark overflow-hidden">
             <div className="p-6 border-b border-border-dark bg-background-dark">
                <h3 className="text-lg font-bold text-slate-100">Log Mutasi Terakhir</h3>
             </div>
             <div className="overflow-x-auto max-h-96 custom-scrollbar">
               <table className="w-full text-left">
                 <thead className="bg-card-dark text-slate-500 uppercase text-xs font-semibold sticky top-0 border-b border-border-dark">
                   <tr>
                     <th className="px-6 py-3">Waktu</th>
                     <th className="px-6 py-3">Tipe</th>
                     <th className="px-6 py-3">Produk</th>
                     <th className="px-6 py-3 text-right">Jumlah</th>
                     <th className="px-6 py-3 text-right">Nilai</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border-dark">
                   {transactions.slice().reverse().slice(0, 20).map((trx) => (
                     <tr key={trx.id} className="hover:bg-background-dark/50 text-sm">
                       <td className="px-6 py-3 text-slate-500">
                         {new Date(trx.timestamp).toLocaleDateString()} {new Date(trx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </td>
                       <td className="px-6 py-3">
                         <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                           trx.type === 'IN' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                         }`}>
                           {trx.type === 'IN' ? 'RESTOCK' : 'TERJUAL'}
                         </span>
                       </td>
                       <td className="px-6 py-3 text-slate-300 font-medium">{trx.productName}</td>
                       <td className="px-6 py-3 text-right text-slate-400">{trx.quantity}</td>
                       <td className="px-6 py-3 text-right font-mono text-slate-400">
                         {trx.type === 'OUT' ? '+' : '-'}Rp {Math.abs(trx.totalPrice).toLocaleString('id-ID')}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;