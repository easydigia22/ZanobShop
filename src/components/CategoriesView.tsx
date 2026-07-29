import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, X, Package } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Category } from '../types';
import { saveCategory, deleteCategory } from '../services/store';

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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingCategory ? 'Modifier la Catégorie' : 'Créer une Catégorie'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Sacs & Maroquinerie"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  URL de l'image de couverture
                </label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
