import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, UserCheck, MessageCircle, Mail, MapPin, RotateCcw } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { updateSettings, setUserRole, resetDemoData } from '../services/store';
import { UserRole } from '../types';

export const SettingsView: React.FC = () => {
  const { settings, user } = useStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
      return;
    }
    resetDemoData();
    window.location.reload();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-amber-400" />
            <span>Paramètres de la Boutique & Rôles</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configurez les détails de votre établissement, le canal WhatsApp et les accès utilisateurs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Store Settings Form */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
          <h3 className="font-serif font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
            <span>Profil & Coordonnées du Magasin</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nom de la Boutique *
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Devise Principale *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="MAD">MAD (Dirham Marocain)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Slogan / Tagline de la Marque
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Numéro WhatsApp Ventes (ex: 212661234567) *
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Téléphone Showroom</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Modèle de Message WhatsApp Automatique
              </label>
              <textarea
                rows={2}
                value={formData.whatsappMessageTemplate}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappMessageTemplate: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Adresse Showroom</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.lowStockAlertEmail}
                  onChange={(e) => setFormData({ ...formData, lowStockAlertEmail: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Recevoir les alertes par email lors du passage sous le seuil de stock faible</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-400 font-bold text-xs">
                  ✅ Paramètres enregistrés avec succès !
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Modifications</span>
              </button>
            </div>
          </form>
        </div>

        {/* Roles & Security Management */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4 text-xs">
            <h3 className="font-serif font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Gestion des Rôles & Sécurité</span>
            </h3>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400">Utilisateur Actif Connecté :</div>
              <div className="font-bold text-white text-sm">{user.name}</div>
              <div className="text-[11px] text-slate-500">{user.email}</div>
              <div className="pt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px]">
                  Rôle actuel : {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-slate-300 font-semibold">
                Changer le Rôle (Test d'Autorisation) :
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`w-full p-3 rounded-2xl border text-left transition ${
                    user.role === 'ADMIN'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">ADMIN (Administrateur)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tous les droits : CRUD complet, suppression définitive, accès aux paramètres sensibles.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('MANAGER')}
                  className={`w-full p-3 rounded-2xl border text-left transition ${
                    user.role === 'MANAGER'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">MANAGER (Gestionnaire)</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Gestion des stocks, entrées/sorties et création de contenu IA. Ne peut pas supprimer définitivement.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Reset Data */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-[11px] text-slate-500 mb-2">Zone dangereuse — efface toutes les données locales et recharge les données initiales.</p>
            <button
              type="button"
              onClick={handleReset}
              className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                resetConfirm
                  ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                  : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {resetConfirm ? '⚠️ Cliquez encore pour confirmer' : 'Réinitialiser les données de démo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
