import React, { useState, useEffect } from 'react';
import { Bookmark, FileEdit, Save, CheckCircle2, BookmarkX } from 'lucide-react';
import { api } from '../../services/api';

export default function DetectiveNotes({ sessionId, initialNotes = '', bookmarkedEvidence = [], onSelectEvidence, onRemoveBookmark }) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSaveNotes = async () => {
    if (!sessionId) return;
    setSaving(true);
    try {
      await api.updateProgress(sessionId, { notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold text-textPrimary">Detective Journal & Bookmarked Clues</h2>
        <p className="text-xs sm:text-sm text-textSecondary">
          Record hypotheses, flag suspicious contradictions, and review bookmarked evidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bookmarked Clues Column */}
        <div className="p-5 rounded-xl bg-surface border border-borderSubtle">
          <div className="flex items-center space-x-2 text-accent font-semibold text-xs uppercase tracking-wider mb-3">
            <Bookmark className="w-4 h-4" />
            <span>Bookmarked Clues ({bookmarkedEvidence.length})</span>
          </div>

          {bookmarkedEvidence.length === 0 ? (
            <p className="text-xs text-textSecondary italic py-6 text-center">
              No clues bookmarked yet. Click the bookmark icon in the Evidence Room to pin important items here.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bookmarkedEvidence.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-surface-elevated border border-borderSubtle flex items-start justify-between gap-2 text-xs"
                >
                  <button
                    onClick={() => onSelectEvidence(item.id)}
                    className="text-left font-medium text-textPrimary hover:text-accent transition-colors flex-1"
                  >
                    <div className="font-semibold text-textPrimary truncate">{item.title}</div>
                    <div className="text-[10px] text-textSecondary uppercase font-mono">{item.type}</div>
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(item.id)}
                    title="Remove from journal"
                    className="text-textSecondary hover:text-stateError p-1"
                  >
                    <BookmarkX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes Editor Column */}
        <div className="md:col-span-2 p-5 rounded-xl bg-surface border border-borderSubtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-accent font-semibold text-xs uppercase tracking-wider">
                <FileEdit className="w-4 h-4" />
                <span>Private Theory Scratchpad</span>
              </div>
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-accent text-background text-xs font-semibold hover:bg-accent-hover transition-all disabled:opacity-50"
              >
                {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : saving ? 'Saving...' : 'Save Notes'}</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record contradictions, verify alibi windows, compare suspect motives..."
              className="w-full rounded-lg bg-surface-elevated border border-borderSubtle p-4 text-xs sm:text-sm text-textPrimary placeholder-textSecondary/40 focus:outline-none focus:border-accent font-sans leading-relaxed resize-y"
            />
          </div>
          <div className="text-[11px] text-textSecondary font-mono mt-2 text-right">
            Notes are confidential and persisted to your anonymous session.
          </div>
        </div>
      </div>
    </div>
  );
}
