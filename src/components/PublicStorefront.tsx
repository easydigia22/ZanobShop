import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  X,
  Tag,
  AlertTriangle,
  Send,
  Heart,
  Share2,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Product, Category } from '../types';

export const PublicStorefront: React.FC = () => {
  const { products, categories, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customWhatsappMessage, setCustomWhatsappMessage] = useState<string>('');
  const [showWhatsappModal, setShowWhatsappModal] = useState<boolean>(false);

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.isActive);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      const matchesCategory =
        selectedCategory === 'ALL' || p.categoryId === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeProducts, selectedCategory, searchQuery]);

  const featuredProducts = useMemo(() => {
    return activeProducts.filter((p) => p.isFeatured);
  }, [activeProducts]);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    const defaultMsg = `${settings.whatsappMessageTemplate}\n\n- Produit : ${product.name}\n- Réf (SKU) : ${product.sku}\n- Prix : ${product.promoPrice || product.price} ${settings.currency}`;
    setCustomWhatsappMessage(defaultMsg);
  };

  const handleOpenWhatsapp = (product: Product) => {
    const msg = `${settings.whatsappMessageTemplate}\n\n*${product.name}*\nRef: ${product.sku}\nPrix: ${product.promoPrice || product.price} ${settings.currency}`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleSendCustomWhatsapp = () => {
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(customWhatsappMessage)}`;
    window.open(url, '_blank');
    setShowWhatsappModal(false);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Nouvelle Collection Artisanale & Tendance 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                L’Élégance Artisanale & <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                  Prêt-à-Porter Moderne
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                {settings.tagline}. Découvrez nos créations exclusives en pièces limitées : sacs en cuir véritable, caftans modernes et bijoux d’exception.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#catalogue"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explorer le catalogue</span>
                </a>

                <button
                  onClick={() => setShowWhatsappModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center gap-2 border border-emerald-500/30 shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander par WhatsApp</span>
                </button>
              </div>

              {/* Quick Info Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-slate-400 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Livraison 24/48h au Maroc</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Paiement à la livraison</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Qualité 100% Garantie</span>
                </div>
              </div>
            </div>

            {/* Featured Hero Product Card */}
            {featuredProducts[0] && (
              <div className="lg:col-span-5">
                <div className="relative group bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl transition hover:border-amber-500/40">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden relative bg-slate-950">
                    <img
                      src={featuredProducts[0].mainImage}
                      alt={featuredProducts[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      Coup de Cœur
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 px-2">
                    <h3 className="font-serif font-bold text-lg text-white">
                      {featuredProducts[0].name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-amber-400">
                          {featuredProducts[0].promoPrice || featuredProducts[0].price} {settings.currency}
                        </span>
                        {featuredProducts[0].promoPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            {featuredProducts[0].price} {settings.currency}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => openProductDetail(featuredProducts[0])}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold rounded-xl transition border border-slate-700"
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">Nos Catégories</h2>
            <p className="text-slate-400 text-sm">Parcourez nos collections artisanales sélectionnées</p>
          </div>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Voir tout ({activeProducts.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setSelectedCategory('ALL')}
            className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center text-center ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-2">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
            </div>
            <span className="font-semibold text-sm">Tous les produits</span>
            <span className="text-xs text-slate-400 mt-1">{activeProducts.length} articles</span>
          </div>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center text-center group ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-slate-800 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <span className="font-semibold text-sm line-clamp-1">{cat.name}</span>
                <span className="text-xs text-slate-400 mt-1">
                  {cat.productCount || 0} articles
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Product Catalogue */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Header */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, SKU ou mot-clé..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" /> Filtres:
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              Tous
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Aucun produit trouvé</h3>
            <p className="text-slate-400 text-sm">Essayez de modifier votre recherche ou le filtre sélectionné.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isLowStock = p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0;
              const isOutOfStock = p.stockQuantity === 0;

              return (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition flex flex-col group shadow-lg"
                >
                  {/* Image Container */}
                  <div className="aspect-square relative bg-slate-950 overflow-hidden cursor-pointer" onClick={() => openProductDetail(p)}>
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {p.promoPrice && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          PROMO
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          NOUVEAU
                        </span>
                      )}
                      {isLowStock && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                          Plus que {p.stockQuantity} !
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow border border-slate-700">
                          ÉPUISÉ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 mb-1">{p.sku}</div>
                      <h3
                        onClick={() => openProductDetail(p)}
                        className="font-serif font-semibold text-slate-100 hover:text-amber-400 cursor-pointer line-clamp-1 transition"
                      >
                        {p.name}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-amber-400">
                          {p.promoPrice || p.price} {settings.currency}
                        </div>
                        {p.promoPrice && (
                          <div className="text-xs text-slate-500 line-through">
                            {p.price} {settings.currency}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenWhatsapp(p)}
                        disabled={isOutOfStock}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          isOutOfStock
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Commander</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-300 hover:text-white border border-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gallery Image */}
              <div className="bg-slate-950 p-6 flex items-center justify-center relative">
                <img
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-96 object-contain rounded-xl"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                    SKU: {selectedProduct.sku}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    {selectedProduct.name}
                  </h2>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-extrabold text-amber-400">
                      {selectedProduct.promoPrice || selectedProduct.price} {settings.currency}
                    </span>
                    {selectedProduct.promoPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {selectedProduct.price} {settings.currency}
                      </span>
                    )}
                  </div>

                  {/* Availability Badge */}
                  <div className="mt-3">
                    {selectedProduct.stockQuantity === 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Épuisé temporairement
                      </span>
                    ) : selectedProduct.stockQuantity <= selectedProduct.lowStockThreshold ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Stock très limité ({selectedProduct.stockQuantity} restants)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> En Stock ({selectedProduct.stockQuantity} disponibles)
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 text-slate-300 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </div>
                </div>

                {/* Direct WhatsApp Call to Action */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenWhatsapp(selectedProduct)}
                    disabled={selectedProduct.stockQuantity === 0}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Commander via WhatsApp</span>
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Livraison à domicile sous 24 à 48 heures • Paiement en espèces à la réception
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Quick Modal */}
      {showWhatsappModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <MessageCircle className="w-5 h-5" />
                <span>Contact Direct WhatsApp</span>
              </div>
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Tapez votre message ou sélectionnez un modèle pour contacter directement notre équipe :
            </p>

            <textarea
              value={customWhatsappMessage || 'Bonjour ZANOUBSHOP, je souhaite avoir des renseignements.'}
              onChange={(e) => setCustomWhatsappMessage(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleSendCustomWhatsapp}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Ouvrir dans WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">{settings.storeName}</h3>
            <p className="text-xs leading-relaxed">{settings.tagline}</p>
            <p className="text-xs text-slate-500 mt-4">
              © 2026 {settings.storeName}. Tous droits réservés.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Boutique Showroom</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Commandes & Service Client</h4>
            <p className="text-xs leading-relaxed mb-3">
              Notre équipe répond instantanément sur WhatsApp du lundi au samedi de 9h à 20h.
            </p>
            <div className="flex gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
              >
                Instagram
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
