import React from 'react';
import { Share2, CheckCircle2, XCircle, RefreshCw, Instagram, Facebook, Video } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { toggleAccountConnection } from '../services/store';

export const SocialMediaView: React.FC = () => {
  const { accounts, posts } = useStore();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return <Instagram className="w-6 h-6 text-pink-400" />;
      case 'FACEBOOK':
        return <Facebook className="w-6 h-6 text-blue-400" />;
      case 'TIKTOK':
        return <Video className="w-6 h-6 text-cyan-400" />;
      default:
        return <Share2 className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-amber-400" />
            <span>Comptes Réseaux Sociaux & Meta Graph API</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connectez vos comptes professionnels Instagram, Facebook et TikTok pour automatiser vos publications.
          </p>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const publishedCount = posts.filter(
            (p) =>
              (p.platform === acc.platform || p.platform === 'ALL') &&
              p.status === 'PUBLISHED'
          ).length;

          return (
            <div
              key={acc.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    {getPlatformIcon(acc.platform)}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      acc.isConnected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {acc.isConnected ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> CONNECTED
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> DISCONNECTED
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{acc.accountName}</h3>
                  <div className="text-xs font-mono text-amber-400">{acc.handle}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800 text-slate-400">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500">Abonnés</span>
                    <span className="font-bold text-white text-sm">
                      {acc.followersCount ? acc.followersCount.toLocaleString() : '0'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-500">
                      Posts Publiés
                    </span>
                    <span className="font-bold text-amber-400 text-sm">{publishedCount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => toggleAccountConnection(acc.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    acc.isConnected
                      ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{acc.isConnected ? 'Déconnecter le Compte' : 'Connecter avec Meta OAuth'}</span>
                </button>

                {acc.isConnected && (
                  <p className="text-[10px] text-slate-500 text-center">
                    Dernière synchro: {new Date(acc.lastSync).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
