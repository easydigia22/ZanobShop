import React, { useEffect, useState } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'zanob_pwa_dismissed';

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

export const PwaInstallBanner: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;

    try {
      const dismissed = localStorage.getItem(DISMISSED_KEY);
      if (dismissed) return;
    } catch {
      return;
    }

    if (isIos()) {
      // Show iOS manual instructions after 3s
      const t = setTimeout(() => setShowIosGuide(true), 3000);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch { /* */ }
    setVisible(false);
    setShowIosGuide(false);
    setInstallPrompt(null);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') dismiss();
    else setVisible(false);
  };

  // Android / Chrome banner
  if (visible && installPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <div className="bg-white border border-champagne/40 rounded-2xl shadow-2xl p-4 flex items-start gap-3">
          <img src="/logo.png" alt="ZANOB" className="w-12 h-12 rounded-xl object-contain bg-ivory flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-cormorant font-medium text-noir text-base leading-snug">Installer ZANOB</p>
            <p className="text-muted text-xs mt-0.5 leading-relaxed">
              Ajoutez la boutique à votre écran d'accueil pour commander en un instant.
            </p>
            <button
              onClick={handleInstall}
              className="mt-3 w-full py-2.5 rounded-xl bg-noir text-ivory text-xs font-semibold flex items-center justify-center gap-2 hover:bg-noir-light transition"
            >
              <Download className="w-4 h-4" />
              Installer l'application
            </button>
          </div>
          <button onClick={dismiss} className="text-muted hover:text-noir flex-shrink-0 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari guide
  if (showIosGuide) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <div className="bg-white border border-champagne/40 rounded-2xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ZANOB" className="w-8 h-8 rounded-lg object-contain bg-ivory" />
              <p className="font-cormorant font-medium text-noir text-base">Installer ZANOB</p>
            </div>
            <button onClick={dismiss} className="text-muted hover:text-noir">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-muted text-xs mb-3 leading-relaxed">
            Ajoutez la boutique à votre écran d'accueil en 2 étapes :
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-ivory rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-champagne/20 flex items-center justify-center flex-shrink-0">
                <Share className="w-3.5 h-3.5 text-champagne" />
              </div>
              <p className="text-xs text-noir">
                Appuyez sur <span className="font-semibold">Partager</span>{' '}
                <span className="text-muted">(icône en bas de Safari)</span>
              </p>
            </div>
            <div className="flex items-center gap-3 bg-ivory rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-champagne/20 flex items-center justify-center flex-shrink-0">
                <Plus className="w-3.5 h-3.5 text-champagne" />
              </div>
              <p className="text-xs text-noir">
                Choisissez <span className="font-semibold">« Sur l'écran d'accueil »</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
