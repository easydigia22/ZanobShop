import React, { useState } from 'react';
import {
  ArrowDownUp,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  X,
  Search,
  Filter,
  Package,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { MovementType } from '../types';
import { addInventoryMovement } from '../services/store';

interface InventoryViewProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  isOpenModal,
  onCloseModal,
}) => {
  const { products, movements, lowStockProducts, outOfStockProducts, user } = useStore();
  const [showModal, setShowModal] = useState(isOpenModal);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [movementType, setMovementType] = useState<MovementType>('ENTRÉE');
  const [reason, setReason] = useState<string>('Réapprovisionnement fournisseur');
  const [notes, setNotes] = useState<string>('');

  const handleOpenAdd = () => {
    if (products.length > 0) {
      setSelectedProductId(products[0].id);
    }
    setQuantity(1);
    setMovementType('ENTRÉE');
    setReason('Livraison atelier / arrivage');
    setNotes('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find((p) => p.id === selectedProductId);
    if (!targetProduct) return;

    addInventoryMovement({
      productId: targetProduct.id,
      productName: targetProduct.name,
      productSku: targetProduct.sku,
      quantity: Number(quantity),
      type: movementType,
      reason,
      userId: user.id,
      userName: user.name,
      notes,
    });

    setShowModal(false);
    onCloseModal();
  };

  const filteredMovements = movements.filter((m) => {
    const matchesType = filterType === 'ALL' || m.type === filterType;
    const matchesSearch =
      (m.productName || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.reason || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.userName || '').toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <ArrowDownUp className="w-6 h-6 text-amber-400" />
            <span>Gestion des Stocks & Mouvements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enregistrez les entrées, sorties et ajustements avec traçabilité complète.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer Mouvement</span>
        </button>
      </div>

      {/* Stock Alerts Banner */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span>Alertes Niveaux de Stock Critiques</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Out of stock */}
            {outOfStockProducts.length > 0 && (
              <div className="bg-slate-950/80 border border-rose-500/20 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Produits Épuisés ({outOfStockProducts.length})
                </div>
                <div className="space-y-1">
                  {outOfStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-xs text-slate-200 py-1 border-b border-slate-800/60 last:border-0"
                    >
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded">
                        Rupture
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Low stock */}
            {lowStockProducts.length > 0 && (
              <div className="bg-slate-950/80 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Stock Faible ({lowStockProducts.length})
                </div>
                <div className="space-y-1">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-xs text-slate-200 py-1 border-b border-slate-800/60 last:border-0"
                    >
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                        {p.stockQuantity} / seuil: {p.lowStockThreshold}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Movement Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par produit, motif, utilisateur..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Tous les types</option>
            <option value="ENTRÉE">Entrées (+)</option>
            <option value="SORTIE">Sorties (-)</option>
            <option value="AJUSTEMENT">Ajustements (=)</option>
          </select>
        </div>
      </div>

      {/* Movement Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Quantité</th>
                <th className="py-3.5 px-4">Motif</th>
                <th className="py-3.5 px-4">Opérateur</th>
                <th className="py-3.5 px-4">Remarques</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-850 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {new Date(m.date).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 ${
                        m.type === 'ENTRÉE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : m.type === 'SORTIE'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {m.type === 'ENTRÉE' ? (
                        <ArrowDownLeft className="w-3 h-3" />
                      ) : m.type === 'SORTIE' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{m.productName}</td>
                  <td className="py-3.5 px-4 font-extrabold text-sm">
                    {m.type === 'ENTRÉE' ? '+' : m.type === 'SORTIE' ? '-' : ''}
                    {m.quantity}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{m.reason}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-400">{m.userName}</td>
                  <td className="py-3.5 px-4 text-slate-500 italic">{m.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Modal */}
      {(showModal || isOpenModal) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">
                Enregistrer un Mouvement de Stock
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  onCloseModal();
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Produit Concerné *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock actuel: {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Type de Mouvement *
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as MovementType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ENTRÉE">ENTRÉE (+)</option>
                    <option value="SORTIE">SORTIE (-)</option>
                    <option value="AJUSTEMENT">AJUSTEMENT (=)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantité *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Raison / Justification *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="ex: Livraison atelier, Vente WhatsApp, Perte..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Notes Complémentaires (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ex: Référence facture #9481"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    onCloseModal();
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow"
                >
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
