import React, { useState } from 'react';
import { Lock, X, KeyRound } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
    } else {
      setError(false);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[80] flex items-center justify-center p-4 transition-all">
      <div className="bg-card-dark border border-border-dark rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform scale-100 transition-transform">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-background-dark" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Admin Access</h2>
              <p className="text-slate-500 text-sm mt-1">Masukkan password untuk melanjutkan</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-500 hover:text-white p-1 hover:bg-border-dark rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 bg-background-dark text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-border-dark'
                  }`}
                  placeholder="Password Admin"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-pulse">
                  Password salah. Coba "admin123"
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-background-dark bg-primary hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>
        <div className="bg-background-dark px-8 py-4 border-t border-border-dark flex justify-between items-center text-xs text-slate-500">
          <span>BangunHub Secured</span>
          <span className="flex items-center"><Lock className="w-3 h-3 mr-1"/> Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;