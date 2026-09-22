import React, { useState, useMemo } from 'react';
import { OrderForm } from './OrderForm';
import { SocialProofToast } from './SocialProofToast';
import {
  Search, Heart, ShoppingBag, CheckCircle2, Clock,
  MapPin, Phone, Mail, ChevronRight, X, AlertTriangle,
  Star, Truck, CreditCard, RefreshCw, User, Menu, Diamond,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Product } from '../types';
import { Lang, t } from '../i18n';

interface PublicStorefrontProps {
  lang: Lang;
  onNavigate: (view: 'public' | 'admin') => void;
  onSetLang: (l: Lang) => void;
}

export const PublicStorefront: React.FC<PublicStorefrontProps> = ({ lang, onNavigate, onSetLang }) => {
  const tr = t[lang];
  const { products, categories, settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const activeProducts = useMemo(() => products.filter((p) => p.isActive), [products]);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeProducts, selectedCategory, searchQuery]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const HERO_FALLBACK = '/hero-woman.jpg';
  const heroImage = settings.heroImageUrl || HERO_FALLBACK;

  // Strip French articles and return the meaningful noun/phrase
  const displayName = (name: string) =>
    name.replace(/^(le |la |les |l'|l')/i, '').replace(/^\w/, (c) => c.toUpperCase());

  const navLinks = [
    { label: lang === 'fr' ? 'Accueil' : 'Home', href: '#', catId: '' },
    { label: lang === 'fr' ? 'Boutique' : 'Shop', href: '#catalogue', catId: '' },
    ...categories.slice(0, 4).map((c) => ({ label: displayName(c.name), href: '#catalogue', catId: c.id })),
    { label: 'Contact', href: '#contact', catId: '' },
  ];

  const catSubtitle = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('collier') || n.includes('chaîne')) return lang === 'fr' ? 'ÉLÉGANTS' : 'ELEGANT';
    if (n.includes('bague') || n.includes('ring')) return lang === 'fr' ? 'INTEMPORELLES' : 'TIMELESS';
    if (n.includes('bracelet')) return lang === 'fr' ? 'RAFFINÉS' : 'REFINED';
    if (n.includes('boucle') || n.includes('créole') || n.includes('perle')) return lang === 'fr' ? 'TENDANCES' : 'TRENDING';
    return lang === 'fr' ? 'COLLECTION' : 'COLLECTION';
  };

  return (
    <div style={{ background: 'var(--zanob-bg)', color: 'var(--zanob-text)' }} className="min-h-screen font-jost">

      {/* ══════════════════ TOP BAR ══════════════════ */}
      <div style={{ borderBottom: '1px solid var(--zanob-surface)' }} className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
              <Truck className="w-3.5 h-3.5" style={{ color: 'var(--zanob-gold)' }} />
              {lang === 'fr' ? 'Livraison partout au Maroc' : 'Delivery across Morocco'}
            </span>
            <span className="hidden sm:flex items-center gap-1.5" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
              <CreditCard className="w-3.5 h-3.5" style={{ color: 'var(--zanob-gold)' }} />
              {lang === 'fr' ? 'Paiement à la livraison' : 'Pay on delivery'}
            </span>
            <span className="hidden md:flex items-center gap-1.5" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
              <RefreshCw className="w-3.5 h-3.5" style={{ color: 'var(--zanob-gold)' }} />
              {lang === 'fr' ? 'Échange sous 3 jours' : 'Exchange within 3 days'}
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 italic" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
            {lang === 'fr' ? 'Des bijoux pour chaque histoire' : 'Jewelry for every story'}
            <Heart className="w-3 h-3" style={{ color: 'var(--zanob-gold)' }} />
          </span>
        </div>
      </div>

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <header className="sticky top-0 z-50 bg-white/96 backdrop-blur-md" style={{ borderBottom: '1px solid var(--zanob-surface)', boxShadow: '0 1px 12px rgba(43,34,29,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <a href="#" className="flex-shrink-0 flex flex-col leading-none">
              <span className="font-cormorant font-semibold text-xl tracking-[0.15em] uppercase" style={{ color: 'var(--zanob-text)' }}>
                {settings.storeName || 'ZANOBSHOP.MA'}
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase font-medium mt-0.5" style={{ color: 'var(--zanob-gold)' }}>
                {settings.tagline || 'Bijoux qui font sens'}
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={() => link.catId && setSelectedCategory(link.catId)}
                  className="relative px-4 py-2 text-[13px] font-medium transition-colors group"
                  style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"
                    style={{ background: 'var(--zanob-gold)' }}
                  />
                </a>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg transition"
                style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}
              >
                <Search style={{ width: 19, height: 19 }} />
              </button>

              <div className="hidden sm:flex items-center text-[11px] font-semibold rounded-lg p-0.5 mx-1" style={{ background: 'var(--zanob-bg)' }}>
                {(['fr', 'en'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => onSetLang(l)}
                    className="px-2 py-1 rounded-md transition uppercase"
                    style={lang === l
                      ? { background: 'var(--zanob-gold)', color: '#fff' }
                      : { color: 'var(--zanob-text-muted)' } as React.CSSProperties}
                  >{l}</button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('admin')}
                className="p-2 rounded-lg transition"
                style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}
                title="Espace admin"
              >
                <User style={{ width: 19, height: 19 }} />
              </button>

              <button
                className="relative p-2 rounded-lg transition"
                style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}
              >
                <ShoppingBag style={{ width: 19, height: 19 }} />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 text-white text-[8px] font-bold rounded-full flex items-center justify-center" style={{ background: 'var(--zanob-gold)' }}>0</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition"
                style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}
              >
                <Menu style={{ width: 19, height: 19 }} />
              </button>
            </div>
          </div>

          {/* Expandable search */}
          {searchOpen && (
            <div className="pb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--zanob-gold)' }} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tr.searchPlaceholder}
                  className="w-full rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none transition"
                  style={{ background: 'var(--zanob-bg)', border: '1px solid var(--zanob-surface)' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 pt-2 space-y-1" style={{ borderTop: '1px solid var(--zanob-surface)' }}>
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={() => { link.catId && setSelectedCategory(link.catId); setMobileMenuOpen(false); }}
                  className="block px-3 py-2 text-sm font-medium rounded-lg transition"
                  style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}
                >{link.label}</a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'var(--zanob-bg)', minHeight: 560 }}>

        {/* Full-bleed woman photo — right side (visible dès md) */}
        <div className="absolute top-0 right-0 h-full hidden md:block" style={{ width: '62%' }}>
          <img
            src={heroImage}
            alt="ZANOBSHOP"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = HERO_FALLBACK; }}
          />
          {/* Left fade */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, var(--zanob-bg) 0%, rgba(243,238,234,0.5) 15%, transparent 35%)' }}
          />
        </div>

        {/* Mobile hero background image */}
        <div className="absolute inset-0 md:hidden" style={{ opacity: 0.12 }}>
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = HERO_FALLBACK; }}
          />
        </div>

        {/* Script text — floating over photo */}
        <div className="absolute top-12 right-5 z-10 text-right hidden xl:block pointer-events-none">
          <p className="font-cormorant italic leading-tight" style={{ fontSize: '1.65rem', color: 'rgba(178,138,105,0.6)' }}>
            {lang === 'fr' ? 'La beauté' : 'The beauty'}<br />
            {lang === 'fr' ? 'au naturel' : 'au naturel'}
          </p>
          <div className="mt-3 space-y-0.5">
            <p className="text-[9px] tracking-[0.3em] font-semibold uppercase" style={{ color: 'rgba(43,34,29,0.4)' }}>ZANOBSHOP.MA</p>
            <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(43,34,29,0.25)' }}>Maroc</p>
            <div className="flex justify-end mt-1">
              <Diamond style={{ width: 11, height: 11, color: 'rgba(178,138,105,0.45)' }} />
            </div>
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(43,34,29,0.12)' }}>
              <p className="text-[9px] tracking-[0.25em] font-semibold uppercase" style={{ color: 'rgba(43,34,29,0.35)' }}>ZANOBSHOP.MA</p>
              <p className="text-[8px] tracking-[0.2em] uppercase mt-0.5" style={{ color: 'rgba(43,34,29,0.22)' }}>MORE THAN JEWELRY</p>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div style={{ maxWidth: 480 }}>

            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--zanob-gold)' }}>
              {lang === 'fr' ? "Plus qu'un bijou, une histoire" : 'More than jewelry, a story'}
            </p>

            <h1 className="font-cormorant font-semibold leading-[1.05] mb-4" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)', color: 'var(--zanob-text)' }}>
              {lang === 'fr' ? "L'élégance qui" : 'The elegance that'}<br />
              {lang === 'fr' ? 'vous ressemble' : 'resembles you'}
            </h1>

            {/* Gold underline accent */}
            <div className="w-10 h-[2px] mb-5 rounded-full" style={{ background: 'var(--zanob-gold)' }} />

            <p className="text-base font-light mb-7 leading-relaxed" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
              {lang === 'fr' ? 'Bijoux raffinés, intemporels et tendance' : 'Refined, timeless and trendy jewelry'}
            </p>

            <a href="#catalogue" className="btn-primary mb-8 inline-flex">
              {lang === 'fr' ? 'Découvrir la collection' : 'Discover the collection'}
              <ChevronRight className="w-4 h-4" />
            </a>

            {/* Trust icons row */}
            <div className="flex flex-wrap items-center gap-5 mt-8 pt-6" style={{ borderTop: '1px solid var(--zanob-surface)' }}>
              {[
                { icon: <Diamond style={{ width: 14, height: 14 }} />, label: lang === 'fr' ? 'Qualité sélectionnée' : 'Curated quality' },
                { icon: <Heart style={{ width: 14, height: 14 }} />, label: lang === 'fr' ? 'Des bijoux pensés pour vous' : 'Made for you' },
                { icon: <Star style={{ width: 14, height: 14 }} />, label: lang === 'fr' ? "L'élégance au quotidien" : 'Everyday elegance' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
                  <span style={{ color: 'var(--zanob-gold)' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CATEGORIES ══════════════════ */}
      {categories.length > 0 && (
        <section id="categories">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--zanob-surface)' }}>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="flex items-stretch group text-left transition-all duration-200 hover:z-10"
                  style={{ background: '#FFFFFF' }}
                >
                  {/* Left image — fixed height, fills left portion */}
                  <div className="overflow-hidden flex-shrink-0" style={{ width: '45%', minHeight: 140 }}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ minHeight: 140 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--zanob-surface)', minHeight: 140 }}>
                        <Diamond style={{ width: 28, height: 28, color: 'var(--zanob-gold)', opacity: 0.4 }} />
                      </div>
                    )}
                  </div>

                  {/* Right text — fond ivoire chaud */}
                  <div className="flex-1 flex flex-col justify-center px-5 py-6" style={{ background: 'var(--zanob-bg)' }}>
                    <p className="text-[9px] font-semibold tracking-[0.22em] uppercase mb-1" style={{ color: 'var(--zanob-gold)' }}>
                      {catSubtitle(cat.name)}
                    </p>
                    <h3 className="font-cormorant font-semibold text-xl leading-tight mb-3" style={{ color: 'var(--zanob-text)' }}>
                      {displayName(cat.name)}
                    </h3>
                    <span
                      className="inline-flex items-center gap-1 text-[12px] font-medium w-fit transition-colors group-hover:gap-1.5"
                      style={{ color: 'var(--zanob-text)', borderBottom: '1px solid var(--zanob-nude)', paddingBottom: 1 }}
                    >
                      {lang === 'fr' ? 'Découvrir' : 'Discover'}
                      <ChevronRight style={{ width: 13, height: 13 }} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ PRODUCTS ══════════════════ */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--zanob-gold)' }}>
              {lang === 'fr' ? 'Nos coups de cœur' : 'Our favorites'}
            </p>
            <h2 className="font-cormorant font-semibold text-[2rem] leading-tight" style={{ color: 'var(--zanob-text)' }}>
              {lang === 'fr' ? 'Nos bijoux préférés' : 'Our favorite jewelry'}
            </h2>
            <div className="w-8 h-[2px] rounded-full mt-2" style={{ background: 'var(--zanob-gold)' }} />
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            {/* Trust mini */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { icon: <Truck style={{ width: 15, height: 15 }} />, text: lang === 'fr' ? 'Livraison partout au Maroc' : 'Delivery across Morocco', sub: lang === 'fr' ? 'Rapide et sécurisée' : 'Fast & secure' },
                { icon: <CreditCard style={{ width: 15, height: 15 }} />, text: lang === 'fr' ? 'Paiement à la livraison' : 'Pay on delivery', sub: lang === 'fr' ? 'En toute confiance' : 'Safe & trusted' },
                { icon: <RefreshCw style={{ width: 15, height: 15 }} />, text: lang === 'fr' ? 'Échange sous 3 jours' : '3-day exchange', sub: lang === 'fr' ? 'Satisfait ou échangé' : 'Satisfied or exchanged' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span style={{ color: 'var(--zanob-gold)' }}>{item.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: 'var(--zanob-text)' }}>{item.text}</p>
                    <p className="text-[10px]" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#catalogue"
              className="flex items-center gap-1 text-[12px] font-medium transition-colors"
              style={{ color: 'var(--zanob-text)', borderBottom: '1px solid var(--zanob-nude)', paddingBottom: 1 }}
            >
              {lang === 'fr' ? 'Voir toute la boutique' : 'View all'} ({activeProducts.length})
              <ChevronRight style={{ width: 13, height: 13 }} />
            </a>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="px-4 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0 border"
            style={selectedCategory === 'ALL'
              ? { background: 'var(--zanob-text)', color: '#fff', borderColor: 'var(--zanob-text)' }
              : { background: '#fff', color: 'var(--zanob-text-muted)', borderColor: 'var(--zanob-surface)' } as React.CSSProperties}
          >
            {tr.filterAll}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className="px-4 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0 border"
              style={selectedCategory === c.id
                ? { background: 'var(--zanob-gold)', color: '#fff', borderColor: 'var(--zanob-gold)' }
                : { background: '#fff', color: 'var(--zanob-text-muted)', borderColor: 'var(--zanob-surface)' } as React.CSSProperties}
            >
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Product grid — 6 columns */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: 'var(--zanob-surface)' }}>
            <ShoppingBag className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--zanob-surface)' }} />
            <h3 className="text-xl font-cormorant font-semibold mb-2" style={{ color: 'var(--zanob-text)' }}>{tr.emptyTitle}</h3>
            <p className="text-sm" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>{tr.emptySubtitle}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.stockQuantity === 0;
              const inWishlist = wishlist.has(p.id);

              return (
                <div
                  key={p.id}
                  className="group flex flex-col cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                >
                  {/* Square image */}
                  <div className="relative overflow-hidden rounded-xl mb-3" style={{ aspectRatio: '1/1', background: 'var(--zanob-bg)' }}>
                    {p.mainImage ? (
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--zanob-surface)' }}>
                        <Diamond style={{ width: 28, height: 28, color: 'var(--zanob-gold)', opacity: 0.4 }} />
                      </div>
                    )}

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition"
                      style={{ background: 'rgba(255,255,255,0.85)' }}
                    >
                      <Heart
                        style={{ width: 13, height: 13 }}
                        className={inWishlist ? '' : ''}
                        fill={inWishlist ? 'var(--zanob-gold)' : 'none'}
                        color={inWishlist ? 'var(--zanob-gold)' : 'var(--zanob-text-muted)'}
                      />
                    </button>

                    {/* Badges */}
                    {(p.promoPrice || p.isNewArrival) && (
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {p.promoPrice && <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">{tr.badgePromo}</span>}
                        {p.isNewArrival && <span className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'var(--zanob-gold)' }}>{tr.badgeNew}</span>}
                      </div>
                    )}

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-lg" style={{ background: '#fff', color: 'var(--zanob-text-muted)' } as React.CSSProperties}>{tr.badgeOutOfStock}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <p className="text-[13px] font-medium leading-snug line-clamp-1 mb-1" style={{ color: 'var(--zanob-text)' }}>
                    {p.name}
                  </p>
                  <p className="text-[13px] font-bold" style={{ color: 'var(--zanob-gold)' }}>
                    {p.promoPrice || p.price} {settings.currency}
                    {p.promoPrice && (
                      <span className="ml-2 text-[11px] font-normal line-through" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
                        {p.price}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════════════ PRODUCT MODAL ══════════════════ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(43,34,29,0.65)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8" style={{ background: '#fff', border: '1px solid var(--zanob-surface)' }}>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition"
              style={{ background: 'var(--zanob-bg)', color: 'var(--zanob-text-muted)', border: '1px solid var(--zanob-surface)' } as React.CSSProperties}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex items-center justify-center p-8" style={{ background: 'var(--zanob-bg)', minHeight: 280 }}>
                <img
                  src={selectedProduct.mainImage}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-96 object-contain rounded-2xl"
                />
              </div>

              <div className="p-8 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--zanob-gold)' }}>
                      SKU: {selectedProduct.sku}
                    </span>
                    <h2 className="font-cormorant font-semibold text-3xl mt-1 leading-tight" style={{ color: 'var(--zanob-text)' }}>
                      {selectedProduct.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold" style={{ color: 'var(--zanob-gold)' }}>
                      {selectedProduct.promoPrice || selectedProduct.price} {settings.currency}
                    </span>
                    {selectedProduct.promoPrice && (
                      <span className="text-sm line-through" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
                        {selectedProduct.price} {settings.currency}
                      </span>
                    )}
                  </div>

                  <div>
                    {selectedProduct.stockQuantity === 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-500 px-3 py-1.5 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5" /> {tr.stockOut}
                      </span>
                    ) : selectedProduct.stockQuantity <= selectedProduct.lowStockThreshold ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5" /> {tr.stockLow(selectedProduct.stockQuantity)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {tr.stockIn(selectedProduct.stockQuantity)}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed pt-4" style={{ borderTop: '1px solid var(--zanob-surface)', color: 'var(--zanob-text-muted)' } as React.CSSProperties}>
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setOrderProduct(selectedProduct); setSelectedProduct(null); }}
                    disabled={selectedProduct.stockQuantity === 0}
                    className="btn-primary w-full justify-center py-4 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={selectedProduct.stockQuantity === 0 ? { background: 'var(--zanob-surface)', color: 'var(--zanob-text-muted)' } as React.CSSProperties : undefined}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {tr.orderBtn}
                  </button>
                  <p className="text-center text-xs" style={{ color: 'var(--zanob-text-muted)' } as React.CSSProperties}>{tr.deliveryNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer id="contact" style={{ background: 'var(--zanob-text)', color: '#fff' }}>
        <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, var(--zanob-gold), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="space-y-4">
              <div>
                <h3 className="font-cormorant font-semibold text-2xl">{settings.storeName}</h3>
                <p className="text-xs mt-0.5 font-medium tracking-widest" style={{ color: 'var(--zanob-gold)' }}>{settings.tagline}</p>
              </div>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {lang === 'fr' ? 'Bijoux chics pour toutes les occasions. Livraison rapide partout au Maroc.' : 'Chic jewelry for every occasion. Fast delivery across Morocco.'}
              </p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 {settings.storeName}. {tr.footerRights}</p>
              <p className="text-[10px] leading-snug max-w-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>{tr.footerPrivacy}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm tracking-wide">{tr.footerShowroom}</h4>
              <ul className="space-y-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <li className="flex items-start gap-2.5"><MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--zanob-gold)' }} /><span>{settings.address}</span></li>
                <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--zanob-gold)' }} /><span>{settings.phone}</span></li>
                <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--zanob-gold)' }} /><span>{settings.email}</span></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm tracking-wide">{tr.footerOrders}</h4>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{tr.footerTeam}</p>
              <div className="flex gap-2">
                {[
                  { label: 'Instagram', href: settings.instagramUrl },
                  { label: 'Facebook', href: settings.facebookUrl },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-medium transition"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {s.label}
                  </a>
                ))}
              </div>
              <button onClick={() => onNavigate('admin')} className="text-[10px] block mt-2 transition" style={{ color: 'rgba(255,255,255,0.15)' }}>
                Admin ↗
              </button>
            </div>
          </div>
        </div>
      </footer>

      {orderProduct && (
        <OrderForm product={orderProduct} currency={settings.currency} lang={lang} onClose={() => setOrderProduct(null)} />
      )}
      <SocialProofToast products={products} lang={lang} />
    </div>
  );
};
