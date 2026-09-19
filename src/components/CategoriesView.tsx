import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, X, Package, ImageIcon, CheckCircle2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Category } from '../types';
import { saveCategory, deleteCategory } from '../services/store';

const SUGGESTED_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80', label: 'Sacs' },
  { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80', label: 'Couture' },
  { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80', label: 'Bijoux' },
  { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80', label: 'Chaussures' },
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80', label: 'Mode' },
  { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80', label: 'Vêtements' },
  { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80', label: 'Tenue' },
  { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80', label: 'Robe' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop&q=80', label: 'Accessoires' },
  { url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80', label: 'Foulards' },
  { url: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&auto=format&fit=crop&q=80', label: 'Maroquinerie' },
  { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80', label: 'Parfums' },
];

export const CategoriesView: React.FC = () => {
  const { categories, products, user } = useStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData(c);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    saveCategory(formData as any);
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (user.role !== 'ADMIN') {
      alert('Seul un administrateur peut supprimer une catégorie.');
      return;
    }
    const count = products.filter((p) => p.categoryId === id).length;
    if (count > 0) {
      if (
        !confirm(
          `Attention : Cette catégorie contient ${count} produit(s). Êtes-vous sûr de vouloir la supprimer ?`
        )
      ) {
        return;
      }
    }
    deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            <span>Gestion des Catégories</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organisez vos collections pour faciliter la navigation de vos clients.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c) => {
          const count = products.filter((p) => p.categoryId === c.id).length;

          return (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <img
                    src={c.image}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>{count} produits</span>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-serif font-bold text-base text-white">{c.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-800/80 mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Modifier
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 flex-shrink-0">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingCategory ? 'Modifier la Catégorie' : 'Créer une Catégorie'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} id="category-form" className="p-6 space-y-4 text-xs">

                {/* Nom + Description côte à côte */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: Parfums Femme"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description</label>
                    <input
                      type="text"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="ex: Eaux de parfum orientales"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Galerie de suggestions — visible en premier */}
                <div>
                  <p className="text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Choisir une image
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {SUGGESTED_IMAGES.map((img) => {
                      const selected = formData.image === img.url;
                      return (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: img.url })}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                            selected
                              ? 'border-amber-400 ring-2 ring-amber-400/40'
                              : 'border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-end justify-center pb-1">
                            <span className="text-[9px] text-white font-semibold drop-shadow">{img.label}</span>
                          </div>
                          {selected && (
                            <div className="absolute top-1 right-1 bg-amber-400 rounded-full p-0.5">
                              <CheckCircle2 className="w-3 h-3 text-slate-950" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* URL personnalisée + Aperçu */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Ou coller une URL personnalisée</label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 h-24 relative bg-slate-950">
                      <img
                        src={formData.image}
                        alt="Aperçu"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="absolute bottom-2 right-2 bg-slate-950/70 text-amber-300 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                        Aperçu
                      </span>
                    </div>
                  )}
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="category-form"
                className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow text-xs"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
