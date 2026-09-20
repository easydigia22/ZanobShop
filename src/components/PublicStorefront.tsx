import React, { useState, useMemo } from 'react';
import { OrderForm } from './OrderForm';
import { SocialProofToast } from './SocialProofToast';
import {
  Search,
  Filter,
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
  Star,
  Truck,
  BadgeCheck,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Product } from '../types';
import { Lang, t } from '../i18n';

interface PublicStorefrontProps {
  lang: Lang;
}

export const PublicStorefront: React.FC<PublicStorefrontProps> = ({ lang }) => {
  const tr = t[lang];
  const { products, categories, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  return (
    <div className="bg-ivory text-noir min-h-screen font-jost">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #ede8df 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-champagne/8 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-poudre/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,167,116,0.06),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ── LEFT CONTENT ── */}
            <div className="space-y-7">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne/15 border border-champagne/40 text-champagne text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tr.heroBadge}</span>
              </div>

              {/* Headline — 2 lines */}
              <div className="space-y-1">
                <h1
                  className="font-cormorant font-semibold text-noir leading-[1] tracking-tight block"
                  style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
                >
                  {tr.heroHeadline1}
                </h1>
                <h1
                  className="font-cormorant font-light leading-[1] tracking-tight block"
                  style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
                >
                  {tr.heroHeadline2}{' '}
                  <span className="text-champagne italic font-medium">{tr.heroHeadline3}</span>
                </h1>
              </div>

              {/* Tagline */}
              <p className="text-muted text-base sm:text-lg max-w-md leading-relaxed font-light">
                {settings.tagline}{tr.heroTaglineSuffix}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#catalogue"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-noir hover:bg-noir/85 text-ivory font-semibold text-sm transition-all duration-200 shadow-lg shadow-noir/20 hover:shadow-xl hover:shadow-noir/25 hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {tr.exploreCta}
                </a>
                <a
                  href="#categories"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-ivory-dark text-noir font-medium text-sm border border-ivory-dark transition-all duration-200 shadow-sm hover:-translate-y-0.5"
                >
                  {tr.categoriesTitle}
                  <ChevronRight className="w-4 h-4 text-champagne" />
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted font-medium">
                  <span className="w-7 h-7 rounded-full bg-champagne/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-3.5 h-3.5 text-champagne" />
                  </span>
                  {tr.trust1}
                </div>
                <span className="w-px h-4 bg-ivory-dark" />
                <div className="flex items-center gap-2 text-xs text-muted font-medium">
                  <span className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </span>
                  {tr.trust2}
                </div>
                <span className="w-px h-4 bg-ivory-dark" />
                <div className="flex items-center gap-2 text-xs text-muted font-medium">
                  <span className="w-7 h-7 rounded-full bg-champagne/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
                  </span>
                  {tr.trust3}
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  {['#c4a774','#d4b98a','#b89560','#e8d5b0'].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-ivory flex items-center justify-center text-[9px] font-bold text-ivory" style={{ background: c }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-champagne text-champagne" />)}
                  </div>
                  <p className="text-[10px] text-muted mt-0.5">+200 clientes satisfaites</p>
                </div>
              </div>
            </div>

            {/* ── FEATURED PRODUCT CARD ── */}
            {featuredProducts[0] && (
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-4 rounded-3xl bg-champagne/8 blur-xl pointer-events-none" />
                <div className="relative group bg-white rounded-3xl overflow-hidden shadow-2xl border border-ivory-dark/60 hover:border-champagne/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_64px_-12px_rgba(196,167,116,0.25)]">
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <img
                      src={featuredProducts[0].mainImage}
                      alt={featuredProducts[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
                    {/* Featured badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-champagne text-noir text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      <Star className="w-3 h-3 fill-noir" />
                      {tr.featured}
                    </div>
                    {/* Bottom overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-cormorant font-semibold text-2xl text-ivory leading-tight mb-2">
                        {featuredProducts[0].name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-champagne">
                            {featuredProducts[0].promoPrice || featuredProducts[0].price} {settings.currency}
                          </span>
                          {featuredProducts[0].promoPrice && (
                            <span className="text-xs text-ivory/60 line-through">
                              {featuredProducts[0].price} {settings.currency}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedProduct(featuredProducts[0])}
                          className="px-4 py-2 bg-ivory/10 hover:bg-ivory/25 backdrop-blur-sm text-ivory text-xs font-semibold rounded-xl border border-ivory/20 transition"
                        >
                          {tr.viewDetails}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════ */}
      <section id="categories" className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-14">

        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-champagne text-xs font-semibold tracking-widest uppercase mb-1">{lang === 'fr' ? 'Parcourir' : 'Browse'}</p>
            <h2 className="font-cormorant font-semibold text-3xl text-noir">{tr.categoriesTitle}</h2>
          </div>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-champagne hover:text-noir transition"
          >
            {tr.viewAll} ({activeProducts.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* All */}
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`relative rounded-2xl overflow-hidden group aspect-square border-2 transition-all duration-200 ${
              selectedCategory === 'ALL'
                ? 'border-champagne shadow-lg shadow-champagne/20'
                : 'border-ivory-dark hover:border-champagne/50'
            }`}
          >
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition ${
              selectedCategory === 'ALL' ? 'bg-champagne/10' : 'bg-white hover:bg-ivory-dark/50'
            }`}>
              <ShoppingBag className={`w-7 h-7 transition ${selectedCategory === 'ALL' ? 'text-champagne' : 'text-muted'}`} />
              <span className="text-xs font-semibold text-noir">{tr.allProducts}</span>
              <span className="text-[10px] text-muted">{tr.items(activeProducts.length)}</span>
            </div>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative rounded-2xl overflow-hidden group aspect-square border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-champagne shadow-lg shadow-champagne/20'
                    : 'border-ivory-dark hover:border-champagne/50'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 flex flex-col items-end justify-end p-3 transition ${
                  isSelected ? 'bg-noir/50' : 'bg-noir/30 group-hover:bg-noir/45'
                }`}>
                  <span className="text-xs font-bold text-ivory leading-tight text-right">{cat.name}</span>
                  <span className="text-[10px] text-ivory/70">{tr.items(cat.productCount || 0)}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-champagne flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-noir" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATALOGUE
      ══════════════════════════════════════════ */}
      <section id="catalogue" className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-16">

        {/* Section header */}
        <div className="mb-6">
          <p className="text-champagne text-xs font-semibold tracking-widest uppercase mb-1">{lang === 'fr' ? 'Notre sélection' : 'Our selection'}</p>
          <h2 className="font-cormorant font-semibold text-3xl text-noir">{lang === 'fr' ? 'Catalogue' : 'Catalogue'}</h2>
        </div>

        {/* Search & filter bar */}
        <div className="bg-white border border-ivory-dark p-3 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-3 shadow-sm">
          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr.searchPlaceholder}
              className="w-full bg-ivory border border-ivory-dark rounded-xl pl-10 pr-10 py-2.5 text-sm text-noir focus:outline-none focus:border-champagne placeholder:text-muted transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-noir">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-px h-6 bg-ivory-dark hidden md:block" />

          <div className="flex items-center gap-2 overflow-x-auto w-full pb-0">
            <span className="text-xs text-muted flex items-center gap-1 whitespace-nowrap flex-shrink-0">
              <Filter className="w-3.5 h-3.5" /> {tr.filtersLabel}
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-champagne text-noir shadow-sm'
                  : 'bg-ivory-dark text-muted hover:text-noir hover:bg-ivory-dark'
              }`}
            >
              {tr.filterAll}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-champagne text-noir shadow-sm'
                    : 'bg-ivory-dark text-muted hover:text-noir'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        {filteredProducts.length > 0 && (
          <p className="text-xs text-muted mb-4 font-medium">{tr.items(filteredProducts.length)}</p>
        )}

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-ivory-dark">
            <ShoppingBag className="w-14 h-14 text-ivory-dark mx-auto mb-4" />
            <h3 className="text-xl font-cormorant font-semibold text-noir mb-2">{tr.emptyTitle}</h3>
            <p className="text-muted text-sm">{tr.emptySubtitle}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const isLowStock = p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0;
              const isOutOfStock = p.stockQuantity === 0;

              return (
                <div
                  key={p.id}
                  className="bg-white border border-ivory-dark hover:border-champagne/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group shadow-sm hover:shadow-xl hover:shadow-champagne/10 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden cursor-pointer"
                    style={{ aspectRatio: '1/1' }}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/10 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm text-noir text-xs font-semibold px-3 py-1.5 rounded-xl border border-ivory-dark shadow-md translate-y-2 group-hover:translate-y-0">
                        {tr.viewDetails}
                      </span>
                    </div>
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      {p.promoPrice && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow">{tr.badgePromo}</span>
                      )}
                      {p.isNewArrival && (
                        <span className="bg-champagne text-noir text-[10px] font-bold px-2 py-0.5 rounded-lg shadow">{tr.badgeNew}</span>
                      )}
                      {isLowStock && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow border border-amber-200">
                          {tr.badgeLowStock(p.stockQuantity)}
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow">
                          {tr.badgeOutOfStock}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3
                        onClick={() => setSelectedProduct(p)}
                        className="font-cormorant font-semibold text-lg text-noir hover:text-champagne cursor-pointer line-clamp-1 transition leading-tight"
                      >
                        {p.name}
                      </h3>
                      <p className="text-muted text-xs line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-ivory-dark">
                      <div>
                        <div className="text-base font-bold text-champagne">
                          {p.promoPrice || p.price} {settings.currency}
                        </div>
                        {p.promoPrice && (
                          <div className="text-[10px] text-muted line-through">{p.price} {settings.currency}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOrderProduct(p); }}
                        disabled={isOutOfStock}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isOutOfStock
                            ? 'bg-ivory-dark text-muted cursor-not-allowed'
                            : 'bg-noir hover:bg-noir/85 text-ivory shadow-sm hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {tr.orderBtn}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          PRODUCT DETAIL MODAL
      ══════════════════════════════════════════ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-noir/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 border border-ivory-dark/50">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-ivory hover:bg-ivory-dark text-muted hover:text-noir border border-ivory-dark transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-ivory p-6 flex items-center justify-center min-h-72">
                <img
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-96 object-contain rounded-2xl"
                />
              </div>

              <div className="p-7 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-champagne uppercase tracking-widest">SKU: {selectedProduct.sku}</span>
                    <h2 className="font-cormorant font-semibold text-3xl text-noir mt-1 leading-tight">{selectedProduct.name}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-champagne">
                      {selectedProduct.promoPrice || selectedProduct.price} {settings.currency}
                    </span>
                    {selectedProduct.promoPrice && (
                      <span className="text-sm text-muted line-through">{selectedProduct.price} {settings.currency}</span>
                    )}
                  </div>

                  <div>
                    {selectedProduct.stockQuantity === 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-semibold bg-rose-50 px-3 py-1.5 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5" /> {tr.stockOut}
                      </span>
                    ) : selectedProduct.stockQuantity <= selectedProduct.lowStockThreshold ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5" /> {tr.stockLow(selectedProduct.stockQuantity)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {tr.stockIn(selectedProduct.stockQuantity)}
                      </span>
                    )}
                  </div>

                  <p className="text-muted text-sm leading-relaxed border-t border-ivory-dark pt-4">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setOrderProduct(selectedProduct); setSelectedProduct(null); }}
                    disabled={selectedProduct.stockQuantity === 0}
                    className="w-full py-4 rounded-2xl bg-noir hover:bg-noir/85 disabled:bg-ivory-dark disabled:text-muted text-ivory font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-noir/20 hover:shadow-xl hover:shadow-noir/25 hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {tr.orderBtn}
                  </button>
                  <p className="text-center text-xs text-muted">{tr.deliveryNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-noir text-ivory mt-8">
        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="space-y-4">
              <div>
                <h3 className="font-cormorant font-semibold text-2xl text-ivory">{settings.storeName}</h3>
                <p className="text-xs text-champagne mt-0.5 font-medium">{settings.tagline}</p>
              </div>
              <p className="text-xs leading-relaxed text-ivory/50 max-w-xs">
                {lang === 'fr'
                  ? 'Bijoux chics et accessibles pour toutes les occasions. Livraison rapide au Maroc.'
                  : 'Chic and affordable jewelry for every occasion. Fast delivery across Morocco.'}
              </p>
              <p className="text-[10px] text-ivory/25">© 2026 {settings.storeName}. {tr.footerRights}</p>
              <p className="text-[10px] text-ivory/20 mt-1 leading-snug max-w-xs">{tr.footerPrivacy}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-ivory text-sm tracking-wide">{tr.footerShowroom}</h4>
              <ul className="space-y-3 text-xs text-ivory/55">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-champagne flex-shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>{settings.phone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>{settings.email}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-ivory text-sm tracking-wide">{tr.footerOrders}</h4>
              <p className="text-xs leading-relaxed text-ivory/55">{tr.footerTeam}</p>
              <div className="flex gap-2">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-ivory/8 hover:bg-ivory/15 rounded-xl text-ivory/70 hover:text-ivory transition text-xs font-medium border border-ivory/10"
                >
                  Instagram
                </a>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-ivory/8 hover:bg-ivory/15 rounded-xl text-ivory/70 hover:text-ivory transition text-xs font-medium border border-ivory/10"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {orderProduct && (
        <OrderForm
          product={orderProduct}
          currency={settings.currency}
          lang={lang}
          onClose={() => setOrderProduct(null)}
        />
      )}

      {/* ── SOCIAL PROOF TOASTS ── */}
      <SocialProofToast products={products} lang={lang} />
    </div>
  );
};
