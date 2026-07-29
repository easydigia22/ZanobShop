import React from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';

interface DashboardViewProps {
  onSelectTab: (tab: string) => void;
  onOpenNewProductModal: () => void;
  onOpenStockModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTab,
  onOpenNewProductModal,
  onOpenStockModal,
}) => {
  const {
    products,
    categories,
    movements,
    posts,
    settings,
    lowStockProducts,
    outOfStockProducts,
    totalInventoryValue,
  } = useStore();

  const totalAlerts = lowStockProducts.length + outOfStockProducts.length;
  const recentMovements = movements.slice(0, 5);
  const recentPosts = posts.slice(0, 4);

  // Category stock value breakdown
  const categoryValues = categories.map((cat) => {
    const catProducts = products.filter((p) => p.categoryId === cat.id);
    const value = catProducts.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);
    return { name: cat.name, value, count: catProducts.length };
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Tableau de Bord — {settings.storeName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez vos stocks, créez du contenu marketing IA et suivez l’activité en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewProductModal}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>

          <button
            onClick={() => onSelectTab('ai-content')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Générer Post IA</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div
          onClick={() => onSelectTab('products')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Total Produits</span>
            <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-amber-500/20 text-amber-400 transition">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{products.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {products.filter((p) => p.isActive).length} actifs sur la boutique
          </p>
        </div>

        {/* Stock Valuation */}
        <div
          onClick={() => onSelectTab('inventory')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Valeur Totale du Stock</span>
            <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 text-emerald-400 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {totalInventoryValue.toLocaleString()} {settings.currency}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Valeur marchande estimée</p>
        </div>

        {/* Stock Alerts */}
        <div
          onClick={() => onSelectTab('inventory')}
          className={`bg-slate-900 border p-5 rounded-2xl cursor-pointer transition shadow-lg group ${
            totalAlerts > 0 ? 'border-rose-500/40 bg-rose-500/5' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Alertes Stock</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400">{totalAlerts}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {outOfStockProducts.length} épuisé(s), {lowStockProducts.length} sous le seuil
          </p>
        </div>

        {/* Social Posts Scheduled */}
        <div
          onClick={() => onSelectTab('calendar')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Posts Programmés</span>
            <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-amber-500/20 text-amber-400 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {posts.filter((p) => p.status === 'SCHEDULED').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {posts.filter((p) => p.status === 'PUBLISHED').length} publiés au total
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Progress Bar Chart */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              Répartition de la Valeur de Stock par Catégorie
            </h3>
            <span className="text-xs text-amber-400 font-mono">{settings.currency}</span>
          </div>

          <div className="space-y-4 pt-2">
            {categoryValues.map((cat, idx) => {
              const percentage =
                totalInventoryValue > 0 ? Math.round((cat.value / totalInventoryValue) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-medium">{cat.name} ({cat.count} prods)</span>
                    <span className="text-amber-400 font-bold">
                      {cat.value.toLocaleString()} {settings.currency} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">Mouvements Récents</h3>
            <button
              onClick={() => onSelectTab('inventory')}
              className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
            >
              Historique complet <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {recentMovements.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl font-bold flex items-center justify-center ${
                      m.type === 'ENTRÉE'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : m.type === 'SORTIE'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {m.type === 'ENTRÉE' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">{m.productName}</div>
                    <div className="text-[11px] text-slate-400">{m.reason} • Par {m.userName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-bold ${
                      m.type === 'ENTRÉE'
                        ? 'text-emerald-400'
                        : m.type === 'SORTIE'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {m.type === 'ENTRÉE' ? '+' : m.type === 'SORTIE' ? '-' : ''}
                    {m.quantity}
                  </span>
                  <div className="text-[10px] text-slate-500">
                    {new Date(m.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Posts Overview */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-white text-base">
              Activités & Publications Réseaux Sociaux
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('calendar')}
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            Calendrier complet <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recentPosts.map((p) => (
            <div
              key={p.id}
              className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold uppercase">
                    {p.platform}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                      p.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : p.status === 'SCHEDULED'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <img src={p.image} alt={p.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <h4 className="font-bold text-xs text-white line-clamp-1">{p.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {p.content}
                </p>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                <span>{p.createdBy}</span>
                <span>{new Date(p.scheduledFor).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
