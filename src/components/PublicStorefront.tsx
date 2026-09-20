import React, { useState, useMemo } from 'react';
import { OrderForm } from './OrderForm';
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
  AlertTriangle,
  Send,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Product } from '../types';

export const PublicStorefront: React.FC = () => {
  const { products, categories, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customWhatsappMessage, setCustomWhatsappMessage] = useState<string>('');
  const [showWhatsappModal, setShowWhatsappModal] = useState<boolean>(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const activeProducts = useMemo(() => products.filter((p) => p.isActive), [products]);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeProducts, selectedCategory, searchQuery]);

  const featuredProducts = useMemo(() => activeProducts.filter((p) => p.isFeatured), [activeProducts]);

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
    <div className="bg-ivory text-noir min-h-screen font-jost">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-ivory-dark border-b border-ivory-dark">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-rose-poudre/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/30 text-champagne text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nouvelle Collection — Bijou Chic 2026</span>
              </div>

              {/* Headline */}
              <h1 className="font-cormorant font-light text-noir leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
                L'Élégance<br />
                Accessible &<br />
                <span className="text-champagne italic">Moderne</span>
              </h1>

              <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed font-light">
                {settings.tagline}. Bijoux chics portés du bureau au soir — qualité réelle, prix accessibles.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalogue"
                  className="px-6 py-3.5 rounded-xl bg-noir hover:bg-noir-light text-ivory font-medium text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explorer le catalogue</span>
                </a>
                <button
                  onClick={() => setShowWhatsappModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander par WhatsApp</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ivory-dark text-muted text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>Livraison 24/48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Paiement livraison</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>Qualité garantie</span>
                </div>
              </div>
            </div>

            {/* Featured product card */}
            {featuredProducts[0] && (
              <div className="lg:col-span-5">
                <div className="relative group bg-white border border-ivory-dark rounded-2xl p-4 shadow-lg hover:border-champagne/40 transition">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden relative bg-ivory">
                    <img
                      src={featuredProducts[0].mainImage}
                      alt={featuredProducts[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-champagne text-noir text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      Coup de Cœur
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 px-2">
                    <h3 className="font-cormorant font-medium text-xl text-noir">
                      {featuredProducts[0].name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-champagne">
                          {featuredProducts[0].promoPrice || featuredProducts[0].price} {settings.currency}
                        </span>
                        {featuredProducts[0].promoPrice && (
                          <span className="text-xs text-muted line-through">
                            {featuredProducts[0].price} {settings.currency}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => openProductDetail(featuredProducts[0])}
                        className="px-4 py-2 bg-ivory-dark hover:bg-rose-poudre text-noir text-xs font-medium rounded-xl transition border border-ivory-dark"
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

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-cormorant font-medium text-2xl text-noir">Nos Catégories</h2>
            <p className="text-muted text-sm mt-0.5">Parcourez nos collections sélectionnées</p>
          </div>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="text-xs font-medium text-champagne hover:text-champagne-light flex items-center gap-1"
          >
            Voir tout ({activeProducts.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setSelectedCategory('ALL')}
            className={`p-4 rounded-xl border cursor-pointer transition flex flex-col items-center text-center ${
              selectedCategory === 'ALL'
                ? 'bg-champagne/10 border-champagne text-champagne'
                : 'bg-white border-ivory-dark text-muted hover:border-champagne/40'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-ivory-dark flex items-center justify-center mb-2">
              <ShoppingBag className="w-6 h-6 text-champagne" />
            </div>
            <span className="font-medium text-sm text-noir">Tous les produits</span>
            <span className="text-xs text-muted mt-1">{activeProducts.length} articles</span>
          </div>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col items-center text-center group ${
                  isSelected
                    ? 'bg-champagne/10 border-champagne text-champagne'
                    : 'bg-white border-ivory-dark text-muted hover:border-champagne/40'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-ivory-dark">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <span className="font-medium text-sm text-noir line-clamp-1">{cat.name}</span>
                <span className="text-xs text-muted mt-1">{cat.productCount || 0} articles</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CATALOGUE ── */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & filter bar */}
        <div className="bg-white border border-ivory-dark p-4 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, SKU ou mot-clé..."
              className="w-full bg-ivory border border-ivory-dark rounded-xl pl-10 pr-4 py-2 text-sm text-noir focus:outline-none focus:border-champagne placeholder:text-muted"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs text-muted flex items-center gap-1 mr-2 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5" /> Filtres :
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === 'ALL'
                  ? 'bg-champagne text-noir font-semibold'
                  : 'bg-ivory-dark text-muted hover:text-noir'
              }`}
            >
              Tous
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === c.id
                    ? 'bg-champagne text-noir font-semibold'
                    : 'bg-ivory-dark text-muted hover:text-noir'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-ivory-dark">
            <ShoppingBag className="w-12 h-12 text-ivory-dark mx-auto mb-3" />
            <h3 className="text-lg font-cormorant font-medium text-noir mb-1">Aucun produit trouvé</h3>
            <p className="text-muted text-sm">Essayez de modifier votre recherche ou le filtre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const isLowStock = p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0;
              const isOutOfStock = p.stockQuantity === 0;

              return (
                <div
                  key={p.id}
                  className="bg-white border border-ivory-dark hover:border-champagne/40 rounded-2xl overflow-hidden transition flex flex-col group shadow-sm hover:shadow-md"
                >
                  {/* Image */}
                  <div className="aspect-square relative bg-ivory overflow-hidden cursor-pointer" onClick={() => openProductDetail(p)}>
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {p.promoPrice && (
                        <span className="bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">PROMO</span>
                      )}
                      {p.isNewArrival && (
                        <span className="bg-champagne text-noir text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">NOUVEAU</span>
                      )}
                      {isLowStock && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow border border-amber-200">
                          Plus que {p.stockQuantity} !
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="bg-ivory-dark text-muted text-[10px] font-semibold px-2 py-0.5 rounded-md shadow border border-ivory-dark">
                          ÉPUISÉ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-muted mb-1 tracking-wider">{p.sku}</div>
                      <h3
                        onClick={() => openProductDetail(p)}
                        className="font-cormorant font-medium text-lg text-noir hover:text-champagne cursor-pointer line-clamp-1 transition leading-tight"
                      >
                        {p.name}
                      </h3>
                      <p className="text-muted text-xs line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-3 border-t border-ivory-dark flex items-center justify-between gap-2">
                      <div>
                        <div className="text-lg font-semibold text-champagne">
                          {p.promoPrice || p.price} {settings.currency}
                        </div>
                        {p.promoPrice && (
                          <div className="text-xs text-muted line-through">{p.price} {settings.currency}</div>
                        )}
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOrderProduct(p); }}
                          disabled={isOutOfStock}
                          className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                            isOutOfStock
                              ? 'bg-ivory-dark text-muted cursor-not-allowed'
                              : 'bg-noir hover:bg-noir-light text-ivory'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Order</span>
                        </button>
                        <button
                          onClick={() => handleOpenWhatsapp(p)}
                          disabled={isOutOfStock}
                          className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                            isOutOfStock
                              ? 'bg-ivory-dark text-muted cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── PRODUCT DETAIL MODAL ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-noir/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-ivory-dark rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-ivory text-muted hover:text-noir border border-ivory-dark transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-ivory p-6 flex items-center justify-center">
                <img
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-96 object-contain rounded-xl"
                />
              </div>

              <div className="p-6 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-mono text-champagne uppercase tracking-wider">SKU: {selectedProduct.sku}</span>
                  <h2 className="font-cormorant font-medium text-2xl text-noir mt-1">{selectedProduct.name}</h2>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-semibold text-champagne">
                      {selectedProduct.promoPrice || selectedProduct.price} {settings.currency}
                    </span>
                    {selectedProduct.promoPrice && (
                      <span className="text-sm text-muted line-through">{selectedProduct.price} {settings.currency}</span>
                    )}
                  </div>

                  <div className="mt-3">
                    {selectedProduct.stockQuantity === 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Épuisé temporairement
                      </span>
                    ) : selectedProduct.stockQuantity <= selectedProduct.lowStockThreshold ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Stock très limité ({selectedProduct.stockQuantity} restants)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> En Stock ({selectedProduct.stockQuantity} disponibles)
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-ivory-dark text-muted text-sm leading-relaxed">
                    {selectedProduct.description}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-ivory-dark">
                  <button
                    onClick={() => handleOpenWhatsapp(selectedProduct)}
                    disabled={selectedProduct.stockQuantity === 0}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-ivory-dark disabled:text-muted text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Commander via WhatsApp</span>
                  </button>
                  <p className="text-center text-xs text-muted">
                    Livraison à domicile 24–48h • Paiement à la réception
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHATSAPP MODAL ── */}
      {showWhatsappModal && (
        <div className="fixed inset-0 z-50 bg-noir/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-ivory-dark rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-dark pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <MessageCircle className="w-5 h-5" />
                <span>Contact Direct WhatsApp</span>
              </div>
              <button onClick={() => setShowWhatsappModal(false)} className="text-muted hover:text-noir">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted">
              Tapez votre message ou utilisez ce modèle pour contacter notre équipe :
            </p>

            <textarea
              value={customWhatsappMessage || 'Bonjour ZANOUBSHOP, je souhaite avoir des renseignements.'}
              onChange={(e) => setCustomWhatsappMessage(e.target.value)}
              rows={4}
              className="w-full bg-ivory border border-ivory-dark rounded-xl p-3 text-xs text-noir focus:outline-none focus:border-champagne"
            />

            <button
              onClick={handleSendCustomWhatsapp}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Ouvrir dans WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="border-t border-ivory-dark bg-noir text-ivory py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cormorant font-medium text-xl text-ivory mb-2">{settings.storeName}</h3>
            <p className="text-xs leading-relaxed text-ivory/60">{settings.tagline}</p>
            <p className="text-xs text-ivory/30 mt-4">© 2026 {settings.storeName}. Tous droits réservés.</p>
          </div>

          <div>
            <h4 className="font-medium text-ivory text-sm mb-3 tracking-wide">Boutique Showroom</h4>
            <ul className="space-y-2 text-xs text-ivory/60">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-ivory text-sm mb-3 tracking-wide">Commandes & Service Client</h4>
            <p className="text-xs leading-relaxed text-ivory/60 mb-3">
              Notre équipe répond instantanément sur WhatsApp du lundi au samedi de 9h à 20h.
            </p>
            <div className="flex gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-ivory/10 hover:bg-ivory/20 rounded-lg text-ivory/70 hover:text-ivory transition text-xs"
              >
                Instagram
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-ivory/10 hover:bg-ivory/20 rounded-lg text-ivory/70 hover:text-ivory transition text-xs"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>

      {orderProduct && (
        <OrderForm
          product={orderProduct}
          currency={settings.currency}
          onClose={() => setOrderProduct(null)}
        />
      )}
    </div>
  );
};
