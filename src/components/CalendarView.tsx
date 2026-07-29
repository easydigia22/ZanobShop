import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Play,
  Trash2,
  Plus,
  Send,
  Terminal,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { PostStatus } from '../types';
import { deleteSocialPost, publishPostNow } from '../services/store';

interface CalendarViewProps {
  onNavigateToAi: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigateToAi }) => {
  const { posts } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [triggerLog, setTriggerLog] = useState<string[]>([]);
  const [isRunningTrigger, setIsRunningTrigger] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous supprimer cette publication du calendrier ?')) {
      deleteSocialPost(id);
    }
  };

  const handlePublishNow = (id: string) => {
    publishPostNow(id);
    alert('Post publié immédiatement avec succès !');
  };

  const handleRunTriggerWorker = async () => {
    setIsRunningTrigger(true);
    setTriggerLog((prev) => [
      `[${new Date().toLocaleTimeString()}] 🚀 Lancement du worker Trigger.dev...`,
      ...prev,
    ]);

    try {
      const res = await fetch('/api/trigger/run-jobs', { method: 'POST' });
      const data = await res.json();

      setTimeout(() => {
        setTriggerLog((prev) => [
          `[${new Date().toLocaleTimeString()}] ✅ Tâche de vérification terminée: ${data.jobsRun[0].job} (Traité: ${data.jobsRun[0].processed})`,
          `[${new Date().toLocaleTimeString()}] 📊 Audit de stock: ${data.jobsRun[1].job} (${data.jobsRun[1].alertsFound} alertes)`,
          ...prev,
        ]);
        setIsRunningTrigger(false);
      }, 1000);
    } catch (err) {
      setTriggerLog((prev) => [
        `[${new Date().toLocaleTimeString()}] ❌ Erreur d'exécution Trigger.dev`,
        ...prev,
      ]);
      setIsRunningTrigger(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) => filterStatus === 'ALL' || p.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            <span>Calendrier Éditorial & Automatisation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualisez et gérez vos publications programmées avec planification automatique.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTriggerWorker}
            disabled={isRunningTrigger}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 transition flex items-center gap-1.5"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningTrigger ? 'animate-spin' : ''}`} />
            <span>Exécuter Trigger.dev Worker</span>
          </button>

          <button
            onClick={onNavigateToAi}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Post IA</span>
          </button>
        </div>
      </div>

      {/* Trigger.dev Worker Logs Drawer */}
      {triggerLog.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Console de Tâches Asynchrones (Trigger.dev Logs)</span>
          </div>
          <div className="bg-black/80 p-3 rounded-xl border border-slate-800 space-y-1 max-h-32 overflow-y-auto text-emerald-300">
            {triggerLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Status Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-slate-400 font-medium mr-2">Filtrer par statut:</span>
        {['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterStatus === st
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Scheduled Posts List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 font-semibold text-[10px] uppercase border border-slate-800">
                  {p.platform}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    p.status === 'PUBLISHED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : p.status === 'SCHEDULED'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 relative">
                <img src={p.image} alt={p.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>

              <h3 className="font-bold text-white text-sm line-clamp-1">{p.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-line">
                {p.content}
              </p>

              <div className="flex flex-wrap gap-1 text-[10px] text-amber-400 font-mono">
                {p.hashtags?.map((h, idx) => (
                  <span key={idx}>{h}</span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {new Date(p.scheduledFor).toLocaleString('fr-FR')}
                </span>
                <span>Par {p.createdBy}</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                {p.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handlePublishNow(p.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publier Direct</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
