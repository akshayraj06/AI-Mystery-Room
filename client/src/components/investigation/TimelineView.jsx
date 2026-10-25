import React from 'react';
import { Clock, CheckCircle2, AlertCircle, FileText, User } from 'lucide-react';

export default function TimelineView({ timeline = [], suspects = [], onSelectEvidence, onSelectSuspect }) {
  const getSuspect = (id) => suspects.find(s => s.id === id);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold text-textPrimary">Chronological Incident Timeline</h2>
        <p className="text-xs sm:text-sm text-textSecondary">
          Correlate timestamped events against suspect movements and physical logs.
        </p>
      </div>

      <div className="relative border-l-2 border-accent/30 pl-6 sm:pl-8 ml-3 sm:ml-4 space-y-8 py-4">
        {timeline.map((event, idx) => (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node marker */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-accent group-hover:bg-accent group-hover:scale-125 transition-all shadow-[0_0_10px_rgba(199,168,106,0.3)]" />

            {/* Event Card */}
            <div className="p-5 rounded-xl bg-surface border border-borderSubtle group-hover:border-accent/40 transition-all shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-accent flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </span>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                  event.isConfirmed !== false
                    ? 'bg-stateSuccess/10 text-stateSuccess border border-stateSuccess/20'
                    : 'bg-stateWarning/10 text-stateWarning border border-stateWarning/20'
                }`}>
                  {event.isConfirmed !== false ? 'Verified Event' : 'Claimed Event'}
                </span>
              </div>

              <p className="text-sm text-textPrimary leading-relaxed mb-4">
                {event.description}
              </p>

              {/* Linked Suspects & Evidence */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-borderSubtle/60 text-xs">
                {event.relatedSuspectIds?.length > 0 && (
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-textSecondary" />
                    <span className="text-textSecondary text-[11px]">Suspects:</span>
                    <div className="flex flex-wrap gap-1">
                      {event.relatedSuspectIds.map(sId => {
                        const s = getSuspect(sId);
                        return (
                          <span
                            key={sId}
                            className="px-2 py-0.5 rounded bg-surface-elevated text-accent text-[11px] font-mono border border-borderSubtle"
                          >
                            {s?.name || sId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {event.relatedEvidenceIds?.length > 0 && (
                  <div className="flex items-center space-x-1.5 ml-auto">
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    <div className="flex flex-wrap gap-1">
                      {event.relatedEvidenceIds.map(eId => (
                        <button
                          key={eId}
                          onClick={() => onSelectEvidence(eId)}
                          className="px-2 py-0.5 rounded bg-surface-elevated hover:bg-surface-hover text-textPrimary text-[11px] font-mono border border-borderSubtle underline"
                        >
                          View Clue
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
