import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ShoppingBag, X, MapPin } from 'lucide-react';
import { Product } from '../types';
import { Lang } from '../i18n';

interface ToastData {
  id: number;
  name: string;
  initial: string;
  city: string;
  product: Product;
  minsAgo: number;
  color: string;
}

interface SocialProofToastProps {
  products: Product[];
  lang: Lang;
  /** ms between toasts — default random 3–5 min */
  intervalMs?: number;
}

const FR_NAMES = [
  'Fatima', 'Aicha', 'Khadija', 'Meryem', 'Zineb',
  'Nadia', 'Sara', 'Samira', 'Houda', 'Laila',
  'Soukaina', 'Hafsa', 'Rania', 'Imane', 'Ghita',
  'Kawtar', 'Yousra', 'Sanaa', 'Nour', 'Lina',
];

const EN_NAMES = [
  'Sophie', 'Emma', 'Leila', 'Sara', 'Maya',
  'Nadia', 'Yasmine', 'Amina', 'Rania', 'Lina',
  'Chloe', 'Ines', 'Hana', 'Dina', 'Nora',
];

const CITIES_FR = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
  'Agadir', 'Oujda', 'Meknès', 'Tétouan', 'El Jadida',
  'Kénitra', 'Safi', 'Mohammedia', 'Settat', 'Beni Mellal',
];

const CITIES_EN = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier',
  'Agadir', 'Oujda', 'Meknes', 'Tetouan', 'London',
  'Paris', 'Madrid', 'Brussels', 'Montreal', 'Dubai',
];

const AVATAR_COLORS = [
  '#c4a774', '#b89560', '#d4b98a', '#a07840',
  '#c8956c', '#9e7b5a', '#d4a574', '#b8875a',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildToast(products: Product[], lang: Lang, id: number): ToastData | null {
  const activeProducts = products.filter(p => p.isActive && p.stockQuantity > 0);
  if (activeProducts.length === 0) return null;

  const names = lang === 'fr' ? FR_NAMES : EN_NAMES;
  const cities = lang === 'fr' ? CITIES_FR : CITIES_EN;
  const firstName = pickRandom(names);
  const lastName = pickRandom(['B','C','D','E','H','K','L','M','N','R','S','T','Z']);
  const city = pickRandom(cities);
  const product = pickRandom(activeProducts);
  const minsAgo = Math.floor(Math.random() * 28) + 2; // 2–30 min ago

  return {
    id,
    name: `${firstName} ${lastName}.`,
    initial: firstName[0],
    city,
    product,
    minsAgo,
    color: pickRandom(AVATAR_COLORS),
  };
}

export const SocialProofToast: React.FC<SocialProofToastProps> = ({
  products,
  lang,
  intervalMs,
}) => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const counterRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const nextTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const showNext = useCallback(() => {
    if (products.filter(p => p.isActive).length === 0) return;
    const data = buildToast(products, lang, ++counterRef.current);
    if (!data) return;
    setToast(data);
    setDismissed(false);
    // Small delay so CSS transition plays
    setTimeout(() => setVisible(true), 50);
    // Auto-hide after 6 seconds
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setToast(null), 400); // wait for slide-out
    }, 6000);
  }, [products, lang]);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
    clearTimeout(hideTimerRef.current);
    setTimeout(() => setToast(null), 400);
  };

  useEffect(() => {
    // First toast after 12 seconds
    const firstDelay = 12_000;
    nextTimerRef.current = setTimeout(() => {
      showNext();
      // Then every 3–5 min (or custom intervalMs)
      const interval = intervalMs ?? (Math.random() * 120_000 + 180_000); // 3–5 min
      const repeater = () => {
        nextTimerRef.current = setTimeout(() => {
          showNext();
          repeater();
        }, intervalMs ?? (Math.random() * 120_000 + 180_000));
      };
      repeater();
    }, firstDelay);

    return () => {
      clearTimeout(nextTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!toast || dismissed) return null;

  const label = lang === 'fr'
    ? `vient de commander`
    : `just ordered`;

  const timeLabel = lang === 'fr'
    ? `il y a ${toast.minsAgo} min · ${toast.city}`
    : `${toast.minsAgo} min ago · ${toast.city}`;

  return (
    <div
      className="fixed bottom-5 left-5 z-[60] max-w-[320px] w-full"
      style={{
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-ivory-dark/60 overflow-hidden">
        {/* Progress bar */}
        <div className="h-0.5 bg-ivory-dark overflow-hidden">
          <div
            className="h-full bg-champagne origin-left"
            style={{
              animation: visible ? 'shrink 6s linear forwards' : 'none',
            }}
          />
        </div>

        <div className="flex items-center gap-3 p-3.5">
          {/* Product image */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-ivory border border-ivory-dark">
              <img
                src={toast.product.mainImage}
                alt={toast.product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Shopping bag icon overlay */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-champagne flex items-center justify-center shadow-sm border border-white">
              <ShoppingBag className="w-2.5 h-2.5 text-noir" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            {/* Avatar + name */}
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: toast.color }}
              >
                {toast.initial}
              </span>
              <p className="text-xs font-bold text-noir truncate">{toast.name}</p>
            </div>
            {/* Action */}
            <p className="text-[11px] text-muted leading-tight">
              {label}{' '}
              <span className="font-semibold text-noir truncate">«&nbsp;{toast.product.name}&nbsp;»</span>
            </p>
            {/* Time + city */}
            <p className="text-[10px] text-muted/70 flex items-center gap-1 mt-1">
              <MapPin className="w-2.5 h-2.5 text-champagne flex-shrink-0" />
              {timeLabel}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={dismiss}
            className="flex-shrink-0 p-1 text-muted hover:text-noir rounded-lg hover:bg-ivory-dark transition self-start"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};
