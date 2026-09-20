import React from 'react';
import {
  Store,
  LayoutDashboard,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { resetDemoData } from '../services/store';

interface NavbarProps {
  currentView: 'public' | 'admin';
  onNavigate: (view: 'public' | 'admin') => void;
  adminTab: string;
  onSelectAdminTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
}) => {
  const { settings, lowStockProducts, outOfStockProducts } = useStore();
  const totalAlerts = lowStockProducts.length + outOfStockProducts.length;

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-ivory-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('public')}>
            <img
              src="/logo.png"
              alt="ZanobShop"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-muted tracking-wide">{settings.tagline}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-white p-1 rounded-xl flex items-center border border-ivory-dark">
              <button
                onClick={() => onNavigate('public')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'public'
                    ? 'bg-champagne text-noir font-semibold shadow-sm'
                    : 'text-muted hover:text-noir'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Site Boutique</span>
              </button>

              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                  currentView === 'admin'
                    ? 'bg-noir text-ivory font-semibold'
                    : 'text-muted hover:text-noir'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Admin</span>
                {totalAlerts > 0 && (
                  <span className="ml-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full animate-pulse">
                    {totalAlerts}
                  </span>
                )}
              </button>
            </div>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Bonjour ZANOUBSHOP !')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                if (confirm('Voulez-vous réinitialiser les données de démonstration ?')) {
                  resetDemoData();
                }
              }}
              title="Réinitialiser la démo"
              className="p-2 text-muted hover:text-noir hover:bg-ivory-dark rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
