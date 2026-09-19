import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { addOrder } from '../services/store';
import { Product } from '../types';

interface OrderFormProps {
  product: Product;
  currency: string;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ product, currency, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const unitPrice = product.promoPrice ?? product.price;
  const total = unitPrice * quantity;
  const maxQty = Math.min(product.stockQuantity, 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = addOrder({
      customer: { name, phone, city, address },
      items: [{
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity,
        unitPrice,
      }],
      total,
      status: 'EN_ATTENTE',
      notes: notes || undefined,
    });
    setOrderNumber(order.orderNumber);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">Passer une commande</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Commande recue !</h3>
            <p className="text-slate-400 text-sm">
              Votre commande{' '}
              <span className="text-amber-400 font-mono font-bold">{orderNumber}</span>{' '}
              a bien ete enregistree. Nous vous contacterons sous peu.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Product Summary */}
            <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3">
              <img
                src={product.mainImage}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                <p className="text-amber-400 text-xs font-bold">{unitPrice} {currency}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-bold transition"
                >
                  -
                </button>
                <span className="text-white font-bold w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-bold transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customer Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Nom complet *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Telephone *</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Ville *</label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Casablanca"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Adresse *</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rue, quartier..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Taille, couleur, instructions de livraison..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Total + Submit */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs text-slate-400">Total</p>
                <p className="text-xl font-bold text-amber-400">{total.toFixed(2)} {currency}</p>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
              >
                Confirmer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
