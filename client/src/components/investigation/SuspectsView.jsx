import React, { useState } from 'react';
import { User, Shield, AlertCircle, FileText, CheckCircle2, Search, ExternalLink } from 'lucide-react';

export default function SuspectsView({ suspects = [], evidence = [], onSelectEvidence }) {
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  const getRelatedEvidence = (suspectId) => {
    return evidence.filter(e => e.relatedSuspectIds?.includes(suspectId));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-textPrimary">Suspect Roster</h2>
          <p className="text-xs sm:text-sm text-textSecondary">
            All persons of interest present at the scene during the incident window.
          </p>
        </div>
        <span className="text-xs font-mono text-accent bg-surface-elevated px-3 py-1.5 rounded-full border border-borderSubtle self-start">
          {suspects.length} Persons of Interest
        </span>
      </div>

      {/* Suspects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suspects.map((suspect, idx) => {
          const relatedItems = getRelatedEvidence(suspect.id);

          return (
            <div
              key={suspect.id}
              className="rounded-xl bg-surface border border-borderSubtle hover:border-accent/50 transition-all flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-[0_0_20px_rgba(199,168,106,0.15)]"
            >
              <div className="p-6">
                {/* Header with Avatar and Role */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-elevated border border-accent/20 flex items-center justify-center text-accent text-xl font-display font-bold shrink-0 group-hover:scale-105 transition-transform">
                    {suspect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-textPrimary truncate group-hover:text-accent transition-colors">
                      {suspect.name}
                    </h3>
                    <div className="text-xs font-mono text-accent/90 truncate">
                      {suspect.role}
                    </div>
                    <div className="text-[10px] text-textSecondary font-mono mt-0.5">
                      ID: {suspect.id}
                    </div>
                  </div>
                </div>

                {/* Claimed Alibi */}
                <div className="mb-4 p-3 rounded-lg bg-surface-elevated/60 border border-borderSubtle/60 text-xs">
                  <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1 flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Claimed Alibi</span>
                  </div>
                  <p className="text-textSecondary italic">"{suspect.alibi}"</p>
                </div>

                {/* Potential Motive */}
                <div className="mb-4 text-xs text-textSecondary">
                  <span className="font-semibold text-textPrimary block mb-1">Motive Theory:</span>
                  <p className="line-clamp-2">{suspect.motive}</p>
                </div>

                {/* Public Facts */}
                {suspect.publicFacts && suspect.publicFacts.length > 0 && (
                  <div className="text-xs text-textSecondary space-y-1">
                    <span className="font-semibold text-textPrimary block text-[11px] uppercase tracking-wider">
                      Known Facts:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {suspect.publicFacts.slice(0, 2).map((fact, fIdx) => (
                        <li key={fIdx} className="truncate">{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer with Evidence Links */}
              <div className="px-6 py-3 bg-surface-elevated/40 border-t border-borderSubtle flex items-center justify-between text-xs">
                <span className="text-[11px] text-textSecondary font-mono">
                  {relatedItems.length} Clues Linked
                </span>
                <button
                  onClick={() => setSelectedSuspect(suspect)}
                  className="text-accent hover:text-accent-hover font-semibold inline-flex items-center space-x-1 text-xs"
                >
                  <span>Dossier</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suspect Dossier Modal */}
      {selectedSuspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-xl w-full bg-surface border border-accent/40 rounded-2xl p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-accent/30 flex items-center justify-center text-2xl font-display font-bold text-accent">
                  {selectedSuspect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-textPrimary">{selectedSuspect.name}</h3>
                  <p className="text-sm font-mono text-accent">{selectedSuspect.role}</p>
                  <p className="text-xs text-textSecondary font-mono mt-0.5">Suspect ID: {selectedSuspect.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSuspect(null)}
                className="w-8 h-8 rounded-lg bg-surface-elevated border border-borderSubtle flex items-center justify-center text-textSecondary hover:text-textPrimary"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-sm text-textSecondary">
              <div>
                <h4 className="font-semibold text-textPrimary text-xs uppercase tracking-wider mb-1">Background</h4>
                <p className="leading-relaxed bg-surface-elevated/40 p-3 rounded-lg border border-borderSubtle/50 text-xs">
                  {selectedSuspect.background}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-textPrimary text-xs uppercase tracking-wider mb-1">Claimed Alibi</h4>
                <p className="leading-relaxed bg-surface-elevated/40 p-3 rounded-lg border border-borderSubtle/50 text-xs italic text-accent/90">
                  "{selectedSuspect.alibi}"
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-textPrimary text-xs uppercase tracking-wider mb-1">Investigative Motive</h4>
                <p className="leading-relaxed bg-surface-elevated/40 p-3 rounded-lg border border-borderSubtle/50 text-xs">
                  {selectedSuspect.motive}
                </p>
              </div>

              {selectedSuspect.publicFacts?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-textPrimary text-xs uppercase tracking-wider mb-1">Recorded Facts</h4>
                  <ul className="space-y-1.5 list-disc list-inside bg-surface-elevated/40 p-3 rounded-lg border border-borderSubtle/50 text-xs">
                    {selectedSuspect.publicFacts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Linked Evidence */}
              <div>
                <h4 className="font-semibold text-textPrimary text-xs uppercase tracking-wider mb-2">Connected Evidence Items</h4>
                <div className="space-y-2">
                  {getRelatedEvidence(selectedSuspect.id).map(e => (
                    <div
                      key={e.id}
                      onClick={() => {
                        setSelectedSuspect(null);
                        onSelectEvidence(e.id);
                      }}
                      className="p-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-borderSubtle cursor-pointer flex items-center justify-between text-xs group"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-accent" />
                        <span className="font-medium text-textPrimary group-hover:text-accent">{e.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-textSecondary uppercase">{e.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
