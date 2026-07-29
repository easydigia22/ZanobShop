import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Calendar,
  Save,
  Check,
  Send,
  Package,
  Layers,
  Wand2,
  FileText,
  Clock,
  Share2,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Product, PostStyle, PostPlatform } from '../types';
import { saveSocialPost } from '../services/store';

interface AiContentGeneratorViewProps {
  initialProduct?: Product | null;
  onNavigateToCalendar: () => void;
}

export const AiContentGeneratorView: React.FC<AiContentGeneratorViewProps> = ({
  initialProduct,
  onNavigateToCalendar,
}) => {
  const { products, categories, settings } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || products[0]?.id || ''
  );
  const [selectedStyle, setSelectedStyle] = useState<PostStyle>('Élégant');
  const [selectedPlatform, setSelectedPlatform] = useState<PostPlatform>('INSTAGRAM');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Output Generated State
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedCta, setGeneratedCta] = useState<string>('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
    }
  }, [initialProduct]);

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);

    const category = categories.find((c) => c.id === selectedProduct.categoryId);

    try {
      const response = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.name,
          categoryName: category?.name,
          description: selectedProduct.description,
          price: selectedProduct.price,
          promoPrice: selectedProduct.promoPrice,
          style: selectedStyle,
          platform: selectedPlatform,
          customNotes,
        }),
      });

      const data = await response.json();
      setGeneratedTitle(data.title || `Offre Exclusive : ${selectedProduct.name}`);
      setGeneratedContent(data.content || '');
      setGeneratedCta(data.cta || 'Commandez directement par WhatsApp !');
      setGeneratedHashtags(data.hashtags || ['#SmartBoutique', '#MarocFashion']);
      setGeneratedVariants(data.variants || []);
    } catch (err) {
      console.error('Erreur génération IA:', err);
      // Fallback preview
      setGeneratedTitle(`✨ Découvrez ${selectedProduct.name}`);
      setGeneratedContent(
        `Sublimez votre style avec notre ${selectedProduct.name}.\n\n${selectedProduct.description}\n\nUn savoir-faire artisanal unique pour des pièces d'exception.`
      );
      setGeneratedCta(`📲 Disponible immédiatement à ${selectedProduct.promoPrice || selectedProduct.price} ${settings.currency} sur WhatsApp !`);
      setGeneratedHashtags(['#SmartBoutique', '#FashionMaroc', '#CuirArtisanal']);
      setGeneratedVariants([
        `Nouveauté : ${selectedProduct.name}. Pièce limitée disponible dès maintenant.`,
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = (status: 'DRAFT' | 'SCHEDULED') => {
    if (!generatedContent) return;

    saveSocialPost({
      productId: selectedProduct?.id,
      productName: selectedProduct?.name,
      title: generatedTitle,
      content: `${generatedContent}\n\n${generatedCta}`,
      cta: generatedCta,
      hashtags: generatedHashtags,
      platform: selectedPlatform,
      status,
      scheduledFor: new Date(Date.now() + 86400000).toISOString(),
      image: selectedProduct?.mainImage || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      style: selectedStyle,
      variants: generatedVariants,
    });

    alert(
      status === 'SCHEDULED'
        ? 'Publication programmée avec succès dans le calendrier éditorial !'
        : 'Publication enregistrée comme Brouillon.'
    );
    onNavigateToCalendar();
  };

  const handleCopyText = () => {
    const fullText = `${generatedTitle}\n\n${generatedContent}\n\n${generatedCta}\n\n${generatedHashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Moteur IA Claude & Gemini 3.6 Flash
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            Générateur de Contenu Marketing IA
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transformez vos fiches produits en posts captivants pour Instagram, Facebook et TikTok.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
          <h3 className="font-serif font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Paramètres de Génération</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Product Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Sélectionner un Produit *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.promoPrice || p.price} {settings.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product Quick Info */}
            {selectedProduct && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
                <img
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="overflow-hidden">
                  <div className="font-bold text-white line-clamp-1">{selectedProduct.name}</div>
                  <div className="text-[11px] text-amber-400 font-semibold">
                    {selectedProduct.promoPrice || selectedProduct.price} {settings.currency}
                  </div>
                </div>
              </div>
            )}

            {/* Style Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Style / Tonalité de Communication *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Élégant', 'Promotionnel', 'Familial', 'Court', 'Storytelling'] as PostStyle[]).map(
                  (style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`p-2 rounded-xl border text-left transition ${
                        selectedStyle === style
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {style}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Platform Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Plateforme Cible *
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as PostPlatform)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="INSTAGRAM">Instagram</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="TIKTOK">TikTok</option>
                <option value="ALL">Toutes les plateformes</option>
              </select>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Consignes Spécifiques (Optionnel)
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="ex: Insister sur la livraison gratuite à Casablanca ou sur la série limitée de 5 exemplaires..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Génération par l’IA...' : 'Générer le Post avec IA'}</span>
            </button>
          </div>
        </div>

        {/* Output & Human Validation */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Aperçu & Validation Humaine</span>
              </h3>

              {generatedContent && (
                <button
                  onClick={handleCopyText}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              )}
            </div>

            {!generatedContent ? (
              <div className="py-20 text-center space-y-3 bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed">
                <Wand2 className="w-10 h-10 text-amber-500/40 mx-auto" />
                <div className="text-sm font-bold text-slate-300">Aucun post généré pour le moment</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Choisissez un produit et un style à gauche, puis cliquez sur "Générer le Post avec IA".
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Editable Title */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Titre de l’Accroche</label>
                  <input
                    type="text"
                    value={generatedTitle}
                    onChange={(e) => setGeneratedTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Editable Main Text */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Corps du Post</label>
                  <textarea
                    rows={6}
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed focus:outline-none focus:border-amber-500 font-mono text-xs"
                  />
                </div>

                {/* Call to action */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Appel à l'Action (CTA)</label>
                  <input
                    type="text"
                    value={generatedCta}
                    onChange={(e) => setGeneratedCta(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Hashtags Recommandés</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {generatedHashtags.map((tag, idx) => (
                      <span key={idx} className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md font-mono text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Variants Preview */}
                {generatedVariants.length > 0 && (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Variantes Proposées</label>
                    <div className="space-y-2">
                      {generatedVariants.map((variant, idx) => (
                        <div
                          key={idx}
                          onClick={() => setGeneratedContent(variant)}
                          className="p-2.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 cursor-pointer transition text-[11px]"
                        >
                          "{variant}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {generatedContent && (
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => handleSavePost('DRAFT')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer Brouillon</span>
              </button>

              <button
                onClick={() => handleSavePost('SCHEDULED')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Programmer la Publication</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
