import React, { useRef, useState } from 'react';
import { Settings as SettingsIcon, Save, MessageCircle, Upload, ImageOff, CheckCircle2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { updateSettings } from '../services/store';

export const SettingsView: React.FC = () => {
  const { settings } = useStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(settings.logoUrl || '/logo.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setLogoPreview(dataUrl);
      setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const inputCls =
    'w-full bg-ivory border border-ivory-dark rounded-xl px-3 py-2.5 text-noir text-sm focus:outline-none focus:border-champagne transition';
  const labelCls = 'block text-noir/70 text-xs font-medium mb-1.5';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-champagne/15 flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-champagne" />
        </div>
        <div>
          <h1 className="font-cormorant font-medium text-xl text-noir">Paramètres de la Boutique</h1>
          <p className="text-xs text-muted mt-0.5">Identité, coordonnées et configuration du magasin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Logo upload */}
        <div className="bg-white border border-ivory-dark rounded-2xl p-5">
          <h3 className="font-medium text-sm text-noir mb-4">Logo de la Boutique</h3>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl border-2 border-ivory-dark bg-ivory flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-contain p-1"
                  onError={() => setLogoPreview('')}
                />
              ) : (
                <ImageOff className="w-8 h-8 text-muted/40" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted leading-relaxed mb-3">
                Format recommandé : PNG transparent, minimum 200×200 px.<br />
                Ce logo apparaît dans la navbar et sur l'icône de l'application.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl border border-champagne/50 text-champagne text-xs font-medium flex items-center gap-2 hover:bg-champagne/10 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                Importer un logo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Identité */}
        <div className="bg-white border border-ivory-dark rounded-2xl p-5 space-y-4">
          <h3 className="font-medium text-sm text-noir border-b border-ivory-dark pb-3">Identité & Devise</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nom de la Boutique *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Devise Principale *</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className={inputCls}
              >
                <option value="MAD">MAD (Dirham Marocain)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Slogan / Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className={inputCls}
              placeholder="Ex : Le bijou chic, moderne et accessible"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-ivory-dark rounded-2xl p-5 space-y-4">
          <h3 className="font-medium text-sm text-noir border-b border-ivory-dark pb-3">Coordonnées</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Numéro WhatsApp (ex: 212661234567) *</label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className={`${inputCls} pl-9 font-mono`}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Téléphone Showroom</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Adresse Showroom</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Modèle de Message WhatsApp</label>
            <textarea
              rows={2}
              value={formData.whatsappMessageTemplate}
              onChange={(e) => setFormData({ ...formData, whatsappMessageTemplate: e.target.value })}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white border border-ivory-dark rounded-2xl p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.lowStockAlertEmail}
              onChange={(e) => setFormData({ ...formData, lowStockAlertEmail: e.target.checked })}
              className="mt-0.5 rounded border-ivory-dark accent-champagne"
            />
            <div>
              <span className="text-sm font-medium text-noir">Alertes stock faible par email</span>
              <p className="text-xs text-muted mt-0.5">Recevoir une notification quand un produit passe sous le seuil d'alerte.</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Paramètres enregistrés
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 bg-noir hover:bg-noir-light text-ivory font-semibold text-sm rounded-xl shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
