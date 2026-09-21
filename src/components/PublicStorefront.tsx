import React, { useState, useMemo } from 'react';
import { OrderForm } from './OrderForm';
import { SocialProofToast } from './SocialProofToast';
import {
  Search,
  Heart,
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
  CreditCard,
  RefreshCw,
  User,
  Menu,
  Diamond,
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
  const featuredProducts = useMemo(() => activeProducts.filter((p) => p.isFeatured), [activeProducts]);

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

  const navLinks = [
    { label: lang === 'fr' ? 'Accueil' : 'Home', href: '#' },
    { label: lang === 'fr' ? 'Boutique' : 'Shop', href: '#catalogue' },
    ...categories.slice(0, 4).map((c) => ({ label: c.name, href: '#catalogue', catId: c.id })),
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="bg-[#F3EEEA] text-[#2B221D] min-h-screen font-jost">

      {/* ══════════════════════════════════════════
          TOP ANNOUNCEMENT BAR
      ══════════════════════════════════════════ */}
      <div className="bg-[#F3EEEA] border-b border-[#E8E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-[#7A6E68]">
              <Truck className="w-3.5 h-3.5 text-[#B28A69]" />
              {lang === 'fr' ? 'Livraison partout au Maroc' : 'Delivery across Morocco'}
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[#7A6E68]">
              <CreditCard className="w-3.5 h-3.5 text-[#B28A69]" />
              {lang === 'fr' ? 'Paiement à la livraison' : 'Pay on delivery'}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-[#7A6E68]">
              <RefreshCw className="w-3.5 h-3.5 text-[#B28A69]" />
              {lang === 'fr' ? 'Échange sous 3 jours' : 'Exchange within 3 days'}
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[#7A6E68] italic">
            {lang === 'fr' ? 'Des bijoux pour chaque histoire' : 'Jewelry for every story'}
            <Heart className="w-3 h-3 text-[#B28A69]" />
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STOREFRONT NAVBAR
      ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E1DA] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="#" className="flex-shrink-0">
              <div className="flex flex-col leading-none">
                <span className="font-cormorant font-semibold text-lg sm:text-xl tracking-[0.12em] text-[#2B221D] uppercase">
                  {settings.storeName || 'ZANOBSHOP.MA'}
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#B28A69] uppercase font-medium">
                  {settings.tagline || 'Bijoux qui font sens'}
                </span>
              </div>
            </a>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={() => link.catId && setSelectedCategory(link.catId)}
                  className="px-3 py-2 text-[13px] font-medium text-[#7A6E68] hover:text-[#2B221D] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3 right-3 h-px bg-[#B28A69] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#7A6E68] hover:text-[#2B221D] rounded-lg hover:bg-[#F3EEEA] transition"
              >
                <Search className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </button>

              {/* Lang */}
              <div className="hidden sm:flex items-center text-[11px] font-semibold bg-[#F3EEEA] rounded-lg p-0.5">
                <button
                  onClick={() => onSetLang('fr')}
                  className={`px-2 py-1 rounded-md transition ${lang === 'fr' ? 'bg-[#B28A69] text-white' : 'text-[#7A6E68] hover:text-[#2B221D]'}`}
                >FR</button>
                <button
                  onClick={() => onSetLang('en')}
                  className={`px-2 py-1 rounded-md transition ${lang === 'en' ? 'bg-[#B28A69] text-white' : 'text-[#7A6E68] hover:text-[#2B221D]'}`}
                >EN</button>
              </div>

              {/* Account → admin */}
              <button
                onClick={() => onNavigate('admin')}
                className="p-2 text-[#7A6E68] hover:text-[#2B221D] rounded-lg hover:bg-[#F3EEEA] transition"
                title="Espace admin"
              >
                <User style={{ width: 18, height: 18 }} />
              </button>

              {/* Cart placeholder */}
              <button className="relative p-2 text-[#7A6E68] hover:text-[#2B221D] rounded-lg hover:bg-[#F3EEEA] transition">
                <ShoppingBag style={{ width: 18, height: 18 }} />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#B28A69] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#7A6E68] hover:text-[#2B221D] rounded-lg hover:bg-[#F3EEEA] transition"
              >
                <Menu style={{ width: 18, height: 18 }} />
              </button>
            </div>
          </div>

          {/* Search bar (expandable) */}
          {searchOpen && (
            <div className="pb-3 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B28A69]" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tr.searchPlaceholder}
                  className="w-full bg-[#F3EEEA] border border-[#E8E1DA] rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#B28A69] transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6E68]">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-[#E8E1DA] pt-3 space-y-1">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={() => { link.catId && setSelectedCategory(link.catId); setMobileMenuOpen(false); }}
                  className="block px-3 py-2 text-sm font-medium text-[#7A6E68] hover:text-[#2B221D] hover:bg-[#F3EEEA] rounded-lg transition"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-2 px-3 pt-2">
                <button onClick={() => onSetLang('fr')} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${lang === 'fr' ? 'bg-[#B28A69] text-white' : 'bg-[#F3EEEA] text-[#7A6E68]'}`}>FR</button>
                <button onClick={() => onSetLang('en')} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${lang === 'en' ? 'bg-[#B28A69] text-white' : 'bg-[#F3EEEA] text-[#7A6E68]'}`}>EN</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F3EEEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[560px] items-center gap-8 py-12 lg:py-0">

            {/* LEFT — text */}
            <div className="space-y-6 py-8 lg:py-16">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#B28A69] uppercase">
                {lang === 'fr' ? 'Plus qu\'un bijou, une histoire' : 'More than jewelry, a story'}
              </p>

              <h1 className="font-cormorant font-semibold leading-[1.05] text-[#2B221D]" style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)' }}>
                {lang === 'fr' ? "L'élégance qui" : 'The elegance that'}
                <br />
                {lang === 'fr' ? 'vous ressemble' : 'resembles you'}
              </h1>

              <p className="text-[#7A6E68] text-base font-light max-w-sm leading-relaxed">
                {lang === 'fr' ? 'Bijoux raffinés, intemporels et tendance' : 'Refined, timeless and trendy jewelry'}
              </p>

              <div className="flex items-center gap-3 flex-wrap pt-1">
                <a
                  href="#catalogue"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: '#B28A69' }}
                >
                  {lang === 'fr' ? 'Découvrir la collection' : 'Discover the collection'}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-[#E8E1DA]">
                {[
                  { icon: <Diamond style={{ width: 14, height: 14 }} className="text-[#B28A69]" />, label: lang === 'fr' ? 'Qualité sélectionnée' : 'Selected quality' },
                  { icon: <Heart style={{ width: 14, height: 14 }} className="text-[#B28A69]" />, label: lang === 'fr' ? 'Des bijoux pensés pour vous' : 'Jewelry made for you' },
                  { icon: <Star style={{ width: 14, height: 14 }} className="text-[#B28A69]" />, label: lang === 'fr' ? "L'élégance au quotidien" : 'Everyday elegance' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#7A6E68] font-medium">
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — featured product photo */}
            <div className="relative hidden lg:block h-full min-h-[500px]">
              {/* Decorative script text */}
              <div className="absolute top-16 right-0 text-right z-10 pointer-events-none">
                <p className="font-cormorant italic text-2xl text-[#B28A69]/60 leading-tight">
                  {lang === 'fr' ? 'La beauté' : 'The beauty'}
                  <br />
                  {lang === 'fr' ? 'au naturel' : 'au naturel'}
                </p>
                <div className="mt-3 text-right">
                  <p className="text-[9px] tracking-[0.3em] text-[#7A6E68] uppercase font-semibold">ZANOBSHOP.MA</p>
                  <p className="text-[9px] tracking-[0.2em] text-[#7A6E68]/60 uppercase">Maroc</p>
                  <div className="flex justify-end mt-1.5">
                    <Diamond style={{ width: 12, height: 12 }} className="text-[#B28A69]" />
                  </div>
                </div>
              </div>

              {featuredProducts[0] ? (
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden cursor-pointer group"
                  style={{ top: '2rem', bottom: '2rem', right: 0, left: '2rem' }}
                  onClick={() => setSelectedProduct(featuredProducts[0])}
                >
                  <img
                    src={featuredProducts[0].mainImage}
                    alt={featuredProducts[0].name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B221D]/60 via-transparent to-transparent" />
                  {/* Product info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star className="w-3 h-3 fill-[#B28A69] text-[#B28A69]" />
                      <span className="text-[10px] font-bold tracking-widest text-[#B28A69] uppercase">
                        {tr.featured}
                      </span>
                    </div>
                    <h3 className="font-cormorant font-semibold text-2xl text-white leading-tight">
                      {featuredProducts[0].name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-bold text-[#C9A882]">
                        {featuredProducts[0].promoPrice || featuredProducts[0].price} {settings.currency}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOrderProduct(featuredProducts[0]); }}
                        className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-semibold rounded-xl border border-white/20 transition"
                      >
                        {tr.orderBtn}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="absolute rounded-3xl flex items-center justify-center"
                  style={{ top: '2rem', bottom: '2rem', right: 0, left: '2rem', background: 'linear-gradient(135deg, #E8E1DA, #F3EEEA)' }}
                >
                  <div className="text-center opacity-40">
                    <Diamond style={{ width: 48, height: 48 }} className="text-[#B28A69] mx-auto mb-3" />
                    <p className="font-cormorant text-lg text-[#7A6E68]">Nouvelle collection</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#B28A69]/20 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => {
              const catSubtitles: Record<string, string> = {
                'bagues': lang === 'fr' ? 'INTEMPORELLES' : 'TIMELESS',
                'colliers': lang === 'fr' ? 'ÉLÉGANTS' : 'ELEGANT',
                'bracelets': lang === 'fr' ? 'RAFFINÉS' : 'REFINED',
                'boucles': lang === 'fr' ? 'TENDANCES' : 'TRENDING',
              };
              const subtitle = Object.entries(catSubtitles).find(([k]) => cat.name.toLowerCase().includes(k))?.[1]
                || (lang === 'fr' ? 'COLLECTION' : 'COLLECTION');

              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="relative group rounded-2xl overflow-hidden bg-white border border-[#E8E1DA] hover:border-[#B28A69]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B28A69]/10 text-left"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#E8E1DA] to-[#F3EEEA] flex items-center justify-center">
                        <Diamond style={{ width: 32, height: 32 }} className="text-[#B28A69]/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B221D]/40 via-transparent to-transparent" />
                  </div>

                  {/* Text */}
                  <div className="p-4">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-[#B28A69] uppercase mb-0.5">{subtitle}</p>
                    <h3 className="font-cormorant font-semibold text-lg text-[#2B221D]">{cat.name}</h3>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-[#7A6E68] font-medium group-hover:text-[#B28A69] transition-colors">
                      {lang === 'fr' ? 'Découvrir' : 'Discover'}
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          PRODUCTS — NOS BIJOUX PRÉFÉRÉS
      ══════════════════════════════════════════ */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#B28A69] uppercase mb-1">
              {lang === 'fr' ? 'Nos coups de cœur' : 'Our favorites'}
            </p>
            <h2 className="font-cormorant font-semibold text-3xl text-[#2B221D]">
              {lang === 'fr' ? 'Nos bijoux préférés' : 'Our favorite jewelry'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Trust mini-badges */}
            <div className="hidden md:flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-[11px] text-[#7A6E68]">
                <Truck style={{ width: 14, height: 14 }} className="text-[#B28A69]" />
                {lang === 'fr' ? 'Livraison partout au Maroc' : 'Delivery across Morocco'}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#7A6E68]">
                <CreditCard style={{ width: 14, height: 14 }} className="text-[#B28A69]" />
                {lang === 'fr' ? 'Paiement à la livraison' : 'Pay on delivery'}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#7A6E68]">
                <RefreshCw style={{ width: 14, height: 14 }} className="text-[#B28A69]" />
                {lang === 'fr' ? 'Échange sous 3 jours' : '3-day exchange'}
              </span>
            </div>
            <a href="#catalogue" className="flex items-center gap-1.5 text-xs font-semibold text-[#B28A69] hover:text-[#2B221D] transition whitespace-nowrap">
              {lang === 'fr' ? 'Voir toute la boutique' : 'View all'} ({activeProducts.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-[#2B221D] text-white shadow-sm'
                : 'bg-white border border-[#E8E1DA] text-[#7A6E68] hover:text-[#2B221D] hover:border-[#B28A69]/40'
            }`}
          >
            {tr.filterAll}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-[#B28A69] text-white shadow-sm'
                  : 'bg-white border border-[#E8E1DA] text-[#7A6E68] hover:text-[#2B221D] hover:border-[#B28A69]/40'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E1DA]">
            <ShoppingBag className="w-12 h-12 text-[#E8E1DA] mx-auto mb-4" />
            <h3 className="text-xl font-cormorant font-semibold text-[#2B221D] mb-2">{tr.emptyTitle}</h3>
            <p className="text-[#7A6E68] text-sm">{tr.emptySubtitle}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.stockQuantity === 0;
              const isLowStock = p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0;
              const inWishlist = wishlist.has(p.id);

              return (
                <div
                  key={p.id}
                  className="bg-white border border-[#E8E1DA] hover:border-[#B28A69]/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B28A69]/10"
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#2B221D]/0 group-hover:bg-[#2B221D]/8 transition-all duration-300" />

                    {/* Wishlist */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition"
                    >
                      <Heart
                        style={{ width: 13, height: 13 }}
                        className={inWishlist ? 'fill-[#B28A69] text-[#B28A69]' : 'text-[#7A6E68]'}
                      />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {p.promoPrice && (
                        <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg">{tr.badgePromo}</span>
                      )}
                      {p.isNewArrival && (
                        <span className="bg-[#B28A69] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg">{tr.badgeNew}</span>
                      )}
                      {isLowStock && (
                        <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-lg border border-amber-200">
                          {tr.badgeLowStock(p.stockQuantity)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3
                      className="font-cormorant font-semibold text-base text-[#2B221D] hover:text-[#B28A69] cursor-pointer line-clamp-1 leading-snug transition"
                      onClick={() => setSelectedProduct(p)}
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-sm font-bold text-[#B28A69]">
                          {p.promoPrice || p.price} {settings.currency}
                        </span>
                        {p.promoPrice && (
                          <span className="block text-[9px] text-[#7A6E68] line-through">{p.price} {settings.currency}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) setOrderProduct(p); }}
                        disabled={isOutOfStock}
                        className={`p-1.5 rounded-lg transition ${
                          isOutOfStock
                            ? 'bg-[#E8E1DA] text-[#7A6E68] cursor-not-allowed'
                            : 'bg-[#2B221D] hover:bg-[#B28A69] text-white hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <ShoppingBag style={{ width: 13, height: 13 }} />
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
        <div className="fixed inset-0 z-50 bg-[#2B221D]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 border border-[#E8E1DA]/50">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#F3EEEA] hover:bg-[#E8E1DA] text-[#7A6E68] hover:text-[#2B221D] border border-[#E8E1DA] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-[#F3EEEA] p-6 flex items-center justify-center min-h-72">
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
                    <span className="text-[10px] font-mono text-[#B28A69] uppercase tracking-widest">SKU: {selectedProduct.sku}</span>
                    <h2 className="font-cormorant font-semibold text-3xl text-[#2B221D] mt-1 leading-tight">{selectedProduct.name}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-[#B28A69]">
                      {selectedProduct.promoPrice || selectedProduct.price} {settings.currency}
                    </span>
                    {selectedProduct.promoPrice && (
                      <span className="text-sm text-[#7A6E68] line-through">{selectedProduct.price} {settings.currency}</span>
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

                  <p className="text-[#7A6E68] text-sm leading-relaxed border-t border-[#E8E1DA] pt-4">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => { setOrderProduct(selectedProduct); setSelectedProduct(null); }}
                    disabled={selectedProduct.stockQuantity === 0}
                    className="w-full py-4 rounded-2xl disabled:bg-[#E8E1DA] disabled:text-[#7A6E68] text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    style={{ background: selectedProduct.stockQuantity === 0 ? undefined : '#2B221D' }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {tr.orderBtn}
                  </button>
                  <p className="text-center text-xs text-[#7A6E68]">{tr.deliveryNote}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer id="contact" className="bg-[#2B221D] text-white mt-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#B28A69]/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="space-y-4">
              <div>
                <h3 className="font-cormorant font-semibold text-2xl text-white">{settings.storeName}</h3>
                <p className="text-xs text-[#B28A69] mt-0.5 font-medium tracking-wider">{settings.tagline}</p>
              </div>
              <p className="text-xs leading-relaxed text-white/50 max-w-xs">
                {lang === 'fr'
                  ? 'Bijoux chics et accessibles pour toutes les occasions. Livraison rapide au Maroc.'
                  : 'Chic and affordable jewelry for every occasion. Fast delivery across Morocco.'}
              </p>
              <p className="text-[10px] text-white/25">© 2026 {settings.storeName}. {tr.footerRights}</p>
              <p className="text-[10px] text-white/20 leading-snug max-w-xs">{tr.footerPrivacy}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-sm tracking-wide">{tr.footerShowroom}</h4>
              <ul className="space-y-3 text-xs text-white/55">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B28A69] flex-shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#B28A69] flex-shrink-0" />
                  <span>{settings.phone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#B28A69] flex-shrink-0" />
                  <span>{settings.email}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-sm tracking-wide">{tr.footerOrders}</h4>
              <p className="text-xs leading-relaxed text-white/55">{tr.footerTeam}</p>
              <div className="flex gap-2">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white/8 hover:bg-white/15 rounded-xl text-white/70 hover:text-white transition text-xs font-medium border border-white/10"
                >
                  Instagram
                </a>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white/8 hover:bg-white/15 rounded-xl text-white/70 hover:text-white transition text-xs font-medium border border-white/10"
                >
                  Facebook
                </a>
              </div>
              {/* Discreet admin link */}
              <button
                onClick={() => onNavigate('admin')}
                className="text-[10px] text-white/15 hover:text-white/40 transition mt-4 block"
              >
                Admin ↗
              </button>
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

      <SocialProofToast products={products} lang={lang} />
    </div>
  );
};
