import React, { useState, useMemo } from 'react';
import { OrderForm } from './OrderForm';
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

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="bg-ivory text-noir min-h-screen font-jost">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory to-ivory-dark border-b border-ivory-dark">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-rose-poudre/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/30 text-champagne text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tr.heroBadge}</span>
              </div>

              {/* Headline */}
              <h1 className="font-cormorant font-light text-noir leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
                {tr.heroHeadline1}<br />
                {tr.heroHeadline2}<br />
                <span className="text-champagne italic">{tr.heroHeadline3}</span>
              </h1>

              <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed font-light">
                {settings.tagline}{tr.heroTaglineSuffix}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalogue"
                  className="px-6 py-3.5 rounded-xl bg-noir hover:bg-noir-light text-ivory font-medium text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{tr.exploreCta}</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ivory-dark text-muted text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>{tr.trust1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{tr.trust2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>{tr.trust3}</span>
                </div>
              </div>
            </div>

            {/* Featured product card */}
            {featuredProducts[0] && (
              <div>
                <div className="relative group bg-white border border-ivory-dark rounded-2xl p-5 shadow-lg hover:border-champagne/40 transition">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden relative bg-ivory">
                    <img
                      src={featuredProducts[0].mainImage}
                      alt={featuredProducts[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-champagne text-noir text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      {tr.featured}
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
                        {tr.viewDetails}
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
      <section className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-cormorant font-medium text-2xl text-noir">{tr.categoriesTitle}</h2>
            <p className="text-muted text-sm mt-0.5">{tr.categoriesSubtitle}</p>
          </div>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="text-xs font-medium text-champagne hover:text-champagne-light flex items-center gap-1"
          >
            {tr.viewAll} ({activeProducts.length}) <ChevronRight className="w-3.5 h-3.5" />
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
            <span className="font-medium text-sm text-noir">{tr.allProducts}</span>
            <span className="text-xs text-muted mt-1">{tr.items(activeProducts.length)}</span>
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
                <span className="text-xs text-muted mt-1">{tr.items(cat.productCount || 0)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CATALOGUE ── */}
      <section id="catalogue" className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8">
        {/* Search & filter bar */}
        <div className="bg-white border border-ivory-dark p-4 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr.searchPlaceholder}
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
              <Filter className="w-3.5 h-3.5" /> {tr.filtersLabel}
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === 'ALL'
                  ? 'bg-champagne text-noir font-semibold'
                  : 'bg-ivory-dark text-muted hover:text-noir'
              }`}
            >
              {tr.filterAll}
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
            <h3 className="text-lg font-cormorant font-medium text-noir mb-1">{tr.emptyTitle}</h3>
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
                        <span className="bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">{tr.badgePromo}</span>
                      )}
                      {p.isNewArrival && (
                        <span className="bg-champagne text-noir text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">{tr.badgeNew}</span>
                      )}
                      {isLowStock && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow border border-amber-200">
                          {tr.badgeLowStock(p.stockQuantity)}
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="bg-ivory-dark text-muted text-[10px] font-semibold px-2 py-0.5 rounded-md shadow border border-ivory-dark">
                          {tr.badgeOutOfStock}
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
                          <span>{tr.orderBtn}</span>
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
                        <AlertTriangle className="w-3.5 h-3.5" /> {tr.stockOut}
                      </span>
                    ) : selectedProduct.stockQuantity <= selectedProduct.lowStockThreshold ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {tr.stockLow(selectedProduct.stockQuantity)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {tr.stockIn(selectedProduct.stockQuantity)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-ivory-dark text-muted text-sm leading-relaxed">
                    {selectedProduct.description}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-ivory-dark">
                  <button
                    onClick={() => { setOrderProduct(selectedProduct); setSelectedProduct(null); }}
                    disabled={selectedProduct.stockQuantity === 0}
                    className="w-full py-3.5 rounded-xl bg-noir hover:bg-noir-light disabled:bg-ivory-dark disabled:text-muted text-ivory font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{tr.orderBtn}</span>
                  </button>
                  <p className="text-center text-xs text-muted">
                    {tr.deliveryNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="border-t border-ivory-dark bg-noir text-ivory py-12 mt-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cormorant font-medium text-xl text-ivory mb-2">{settings.storeName}</h3>
            <p className="text-xs leading-relaxed text-ivory/60">{settings.tagline}</p>
            <p className="text-xs text-ivory/30 mt-4">© 2026 {settings.storeName}. {tr.footerRights}</p>
          </div>

          <div>
            <h4 className="font-medium text-ivory text-sm mb-3 tracking-wide">{tr.footerShowroom}</h4>
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
            <h4 className="font-medium text-ivory text-sm mb-3 tracking-wide">{tr.footerOrders}</h4>
            <p className="text-xs leading-relaxed text-ivory/60 mb-3">
              {tr.footerTeam}
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
          lang={lang}
          onClose={() => setOrderProduct(null)}
        />
      )}
    </div>
  );
};
