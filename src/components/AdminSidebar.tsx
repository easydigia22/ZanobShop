import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ArrowDownUp,
  Sparkles,
  Share2,
  Calendar,
  Settings,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { lowStockProducts, outOfStockProducts, posts, pendingOrdersCount } = useStore();
  const alertCount = lowStockProducts.length + outOfStockProducts.length;
  const scheduledCount = posts.filter((p) => p.status === 'SCHEDULED').length;

  const navItems = [
    { id: ‘dashboard’, label: ‘Vue d’ensemble’, icon: LayoutDashboard },
    {
      id: ‘orders’,
      label: ‘Commandes’,
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: ‘bg-rose-500 text-white’,
    },
    { id: ‘products’, label: ‘Produits’, icon: Package },
    { id: 'categories', label: 'Catégories', icon: Layers },
    {
      id: 'inventory',
      label: 'Stock & Mouvements',
      icon: ArrowDownUp,
      badge: alertCount > 0 ? alertCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'ai-content', label: 'Générateur IA', icon: Sparkles, isHighlight: true },
    { id: 'social-media', label: 'Réseaux Sociaux', icon: Share2 },
    {
      id: 'calendar',
      label: 'Calendrier Éditorial',
      icon: Calendar,
      badge: scheduledCount > 0 ? scheduledCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            ADMINISTRATION
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : item.isHighlight
                    ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-slate-950'
                        : item.isHighlight
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stock Quick Status Card */}
      {alertCount > 0 && (
        <div
          onClick={() => onSelectTab('inventory')}
          className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl cursor-pointer hover:bg-rose-500/20 transition space-y-1"
        >
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Alertes Stock ({alertCount})</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {outOfStockProducts.length > 0 && `${outOfStockProducts.length} épuisé(s). `}
            {lowStockProducts.length > 0 && `${lowStockProducts.length} stock faible.`}
          </p>
        </div>
      )}
    </aside>
  );
};
