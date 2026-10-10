import React from 'react';
import {
  X,
  History,
  Trash2,
  Calendar,
  Briefcase,
  ArrowRight,
  Download,
} from 'lucide-react';
import { TailoringSession } from '../../types/resume';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TailoringSession[];
  onRestoreSession: (session: TailoringSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  onRestoreSession,
  onDeleteSession,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `careerforge_sessions_backup_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#0a0a0a] border-l border-[#222222] h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#1f1f1f] flex items-center justify-between bg-[#0d0d0d]">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-[#262626] flex items-center justify-center text-sky-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tailoring History</h3>
              <p className="text-[11px] text-neutral-400">
                {sessions.length} saved resume iterations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        {sessions.length > 0 && (
          <div className="px-4 py-2 bg-[#111111] border-b border-[#1f1f1f] flex items-center justify-between text-xs">
            <button
              onClick={handleExportJson}
              className="text-neutral-400 hover:text-sky-400 flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClearAll}
              className="text-neutral-400 hover:text-rose-400 flex items-center space-x-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-30 text-neutral-400" />
              <p className="text-xs">No previous tailoring sessions found.</p>
              <p className="text-[11px] text-neutral-600">
                Completed tailoring runs are automatically saved here.
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#111111] border border-[#222222] hover:border-neutral-500 rounded-xl p-3 space-y-2 transition-all"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>Resume Tailoring Run</span>
                  </h4>

                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-sky-400 border border-[#262626] shrink-0">
                    {session.result.matchScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-[#1f1f1f]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(session.createdAt)}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1 rounded"
                      title="Delete this session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onRestoreSession(session);
                        onClose();
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-[#333333] transition-all font-medium text-[11px]"
                    >
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
