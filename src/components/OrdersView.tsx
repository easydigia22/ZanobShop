import React, { useState } from 'react';
import {
  ShoppingBag,
  Phone,
  MapPin,
  ChevronRight,
  X,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Clock,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { updateOrderStatus, deleteOrder } from '../services/store';
import { Order, OrderStatus } from '../types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  EN_ATTENTE: {
    label: 'En attente',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  "CONFIRMÉE": {
    label: 'Confirmee',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  EN_LIVRAISON: {
    label: 'En livraison',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  "LIVRÉE": {
    label: 'Livree',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: <PackageCheck className="w-3.5 h-3.5" />,
  },
  "ANNULÉE": {
    label: 'Annulee',
    color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const STATUS_FLOW: OrderStatus[] = ['EN_ATTENTE', 'CONFIRMÉE', 'EN_LIVRAISON', 'LIVRÉE'];

export const OrdersView: React.FC = () => {
  const { orders, settings } = useStore();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const countByStatus = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleDelete = (orderId: string) => {
    if (!confirm('Supprimer cette commande ?')) return;
    deleteOrder(orderId);
    if (selectedOrder?.id === orderId) setSelectedOrder(null);
  };

  const openWhatsApp = (phone: string, orderNumber: string) => {
    const msg = `Bonjour, concernant votre commande ${orderNumber} passee sur ZANOUBSHOP.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx !== -1 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            Commandes
          </h1>
          <p className="text-sm text-slate-400 mt-1">{orders.length} commande(s) au total</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            filterStatus === 'ALL'
              ? 'bg-amber-500 text-slate-950 border-amber-500'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          Toutes ({orders.length})
        </button>
        {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filterStatus === s
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {STATUS_CONFIG[s].icon}
            {STATUS_CONFIG[s].label} ({countByStatus(s)})
          </button>
        ))}
      </div>

      {/* Main Layout: Table + Detail Panel */}
      <div className="flex gap-4">
        {/* Table */}
        <div className={`flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden ${selectedOrder ? 'hidden md:block' : ''}`}>
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Aucune commande</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">N</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Client</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden sm:table-cell">Ville</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold">Total</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer transition ${selectedOrder?.id === order.id ? 'bg-slate-800/60' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-4 py-3 font-mono text-amber-400 font-semibold">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-white">{order.customer.name}</td>
                      <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{order.customer.city}</td>
                      <td className="px-4 py-3 text-right text-white font-semibold">{order.total.toFixed(2)} {settings.currency}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-semibold ${sc.color}`}>
                          {sc.icon}{sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selectedOrder && (
          <div className="w-full md:w-96 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden flex-shrink-0">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="font-mono text-amber-400 font-bold text-sm">{selectedOrder.orderNumber}</span>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-slate-800 rounded-lg transition">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Client Info */}
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Client</p>
                <p className="text-white font-semibold">{selectedOrder.customer.name}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" />{selectedOrder.customer.phone}
                </p>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{selectedOrder.customer.city} — {selectedOrder.customer.address}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Articles</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-800/60 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-white text-xs font-medium">{item.productName}</p>
                      <p className="text-slate-400 text-[10px]">Qte : {item.quantity} x {item.unitPrice} {settings.currency}</p>
                    </div>
                    <p className="text-amber-400 font-semibold text-xs">{(item.quantity * item.unitPrice).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between px-3 pt-1">
                  <span className="text-slate-400 text-xs">Total</span>
                  <span className="text-white font-bold">{selectedOrder.total.toFixed(2)} {settings.currency}</span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Statut</p>
                <div className="grid grid-cols-1 gap-1">
                  {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((s) => {
                    const sc = STATUS_CONFIG[s];
                    const isActive = selectedOrder.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedOrder.id, s)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                          isActive ? sc.color : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {sc.icon}{sc.label}
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Notes</p>
                  <p className="text-slate-300 text-xs bg-slate-800/60 rounded-xl px-3 py-2">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => openWhatsApp(selectedOrder.customer.phone, selectedOrder.orderNumber)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              {nextStatus(selectedOrder.status) && (
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, nextStatus(selectedOrder.status)!)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition"
                >
                  Avancer
                </button>
              )}
              <button
                onClick={() => handleDelete(selectedOrder.id)}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
