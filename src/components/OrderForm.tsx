import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { addOrder } from '../services/store';
import { Product } from '../types';
import { Lang, t } from '../i18n';

interface OrderFormProps {
  product: Product;
  currency: string;
  lang: Lang;
  onClose: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ product, currency, lang, onClose }) => {
  const tr = t[lang];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [consent, setConsent] = useState(false);

  const unitPrice = product.promoPrice ?? product.price;
  const total = unitPrice * quantity;
  const maxQty = Math.min(product.stockQuantity, 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || submitting) return;
    setSubmitting(true);
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
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">{tr.orderFormTitle}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">{tr.orderSuccess}</h3>
            <p className="text-slate-400 text-sm">
              {tr.orderSuccessMsg(orderNumber)}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
            >
              {tr.close}
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
                <label className="block text-xs text-slate-400 mb-1">{tr.fullName}</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tr.namePlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{tr.phone}</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{tr.city}</label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={tr.cityPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">{tr.address}</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={tr.addressPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">{tr.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={tr.notesPlaceholder}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Consent — Loi 09-08 */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 flex-shrink-0 accent-amber-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-[11px] leading-snug text-slate-400 group-hover:text-slate-300 transition">
                {tr.consentText}
              </span>
            </label>

            {/* Total + Submit */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs text-slate-400">{tr.total}</p>
                <p className="text-xl font-bold text-amber-400">{total.toFixed(2)} {currency}</p>
              </div>
              <button
                type="submit"
                disabled={!consent || submitting}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? tr.submitting : tr.confirm}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
