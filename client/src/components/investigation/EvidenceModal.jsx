import React from 'react';
import { 
  X, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, MessageSquare, 
  Video, FileText, UserCheck, Image as ImageIcon, ShieldAlert, Clock, AlertTriangle 
} from 'lucide-react';

export default function EvidenceModal({
  evidence,
  isBookmarked,
  onToggleBookmark,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  suspects = []
}) {
  if (!evidence) return null;

  const getSuspectName = (id) => suspects.find(s => s.id === id)?.name || id;

  const renderContent = () => {
    switch (evidence.type) {
      case 'chat':
        return (
          <div className="rounded-xl bg-[#0F141C] border border-borderSubtle overflow-hidden">
            {/* Chat App Header */}
            <div className="bg-[#18202C] px-4 py-3 border-b border-borderSubtle flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-textPrimary">{evidence.content?.platform || 'Fictional Chat Archive'}</div>
                  <div className="text-[10px] text-textSecondary font-mono">{evidence.content?.channel || 'Direct Encrypted'}</div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stateWarning bg-stateWarning/10 px-2 py-0.5 rounded border border-stateWarning/20">
                Fictional Record
              </span>
            </div>

            {/* Chat Bubble Stream */}
            <div className="p-4 sm:p-6 space-y-3 max-h-96 overflow-y-auto font-sans">
              {(evidence.content?.messages || []).map((msg, idx) => {
                const isExternal = msg.sender?.toLowerCase().includes('unknown');
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isExternal ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] font-mono text-textSecondary mb-0.5 px-1">
                      {msg.sender} &bull; {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isExternal
                          ? 'bg-[#1C2533] text-textPrimary rounded-tl-none border border-borderSubtle'
                          : 'bg-accent/90 text-background font-medium rounded-tr-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'cctv':
        return (
          <div className="rounded-xl bg-black border border-borderSubtle overflow-hidden relative">
            {/* CCTV Scanlines & Header */}
            <div className="bg-[#12161F] px-4 py-2.5 border-b border-borderSubtle flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2 text-stateError">
                <span className="w-2.5 h-2.5 rounded-full bg-stateError animate-ping" />
                <span className="font-bold tracking-wider">{evidence.content?.cameraName || 'CAM-01'}</span>
              </div>
              <div className="text-textSecondary text-[11px]">
                {evidence.content?.location}
              </div>
            </div>

            {/* Video Simulator / Frame Storyboard */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="p-3 bg-surface-elevated/70 rounded-lg border border-borderSubtle flex items-center justify-between text-xs font-mono text-accent">
                <span>STATUS: {evidence.content?.status || 'RECORDING LOG ACTIVE'}</span>
                <span>WINDOW: {evidence.content?.recordingTimestamp}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(evidence.content?.frames || []).map((frame, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-surface/80 border border-borderSubtle relative overflow-hidden">
                    <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />
                    <div className="text-[10px] font-mono text-accent mb-1 flex items-center justify-between">
                      <span>FRAME #{idx + 1}</span>
                      <span className="text-textSecondary">{frame.time}</span>
                    </div>
                    <p className="text-xs text-textPrimary">{frame.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'document':
        return (
          <div className="rounded-xl bg-[#141923] border border-borderSubtle p-5 sm:p-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-borderSubtle pb-3 mb-4">
              <div className="font-bold text-accent tracking-wider uppercase text-sm">
                {evidence.content?.documentType || 'OFFICIAL RECORD'}
              </div>
              <span className="text-[10px] text-textSecondary uppercase">Classified Material</span>
            </div>

            {/* Email format */}
            {evidence.content?.subject && (
              <div className="space-y-2 mb-4 bg-surface-elevated/40 p-3 rounded border border-borderSubtle">
                <div><span className="text-textSecondary">FROM: </span><span className="text-textPrimary">{evidence.content.from}</span></div>
                <div><span className="text-textSecondary">TO: </span><span className="text-textPrimary">{evidence.content.to}</span></div>
                <div><span className="text-textSecondary">SUBJECT: </span><span className="text-accent font-semibold">{evidence.content.subject}</span></div>
                <div><span className="text-textSecondary">TIME: </span><span className="text-textPrimary">{evidence.content.timestamp}</span></div>
                <div className="pt-2 border-t border-borderSubtle font-sans text-textPrimary leading-relaxed">
                  {evidence.content.body}
                </div>
              </div>
            )}

            {/* Access Logs format */}
            {evidence.content?.records && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-borderSubtle text-textSecondary">
                      <th className="py-2">Time</th>
                      <th className="py-2">Badge Holder</th>
                      <th className="py-2">Door / Checkpoint</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderSubtle/40">
                    {evidence.content.records.map((r, rIdx) => (
                      <tr key={rIdx} className="hover:bg-surface-elevated/30">
                        <td className="py-1.5 text-accent">{r.time}</td>
                        <td className="py-1.5 text-textPrimary">{r.badgeHolder}</td>
                        <td className="py-1.5 text-textSecondary">{r.door}</td>
                        <td className="py-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                            r.status?.includes('GRANTED') ? 'bg-stateSuccess/10 text-stateSuccess' :
                            r.status?.includes('OVERRIDE') ? 'bg-stateWarning/20 text-stateWarning font-bold' : 'bg-stateError/10 text-stateError'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Forensic Findings format */}
            {evidence.content?.findings && (
              <div className="space-y-2">
                <span className="text-textSecondary font-semibold">FORENSIC OBSERVATIONS:</span>
                <ul className="list-disc list-inside space-y-1 text-textPrimary font-sans text-xs">
                  {evidence.content.findings.map((f, fIdx) => (
                    <li key={fIdx}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'witness_statement':
        return (
          <div className="rounded-xl bg-[#131720] border border-borderSubtle p-6">
            <div className="flex items-center space-x-3 mb-4 border-b border-borderSubtle pb-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-textPrimary text-sm">{evidence.content?.witnessName || 'Witness'}</h4>
                <p className="text-xs font-mono text-accent">{evidence.content?.witnessRole || 'Deposition'}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-surface-elevated/50 border border-borderSubtle text-xs sm:text-sm text-textPrimary italic leading-relaxed font-serif">
              "{evidence.content?.statement}"
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 rounded-lg bg-surface-elevated text-xs text-textSecondary">
            <pre className="whitespace-pre-wrap font-mono">{JSON.stringify(evidence.content, null, 2)}</pre>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-md animate-fade-in">
      <div className="max-w-3xl w-full bg-surface border border-accent/40 rounded-2xl flex flex-col max-h-[92vh] shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-borderSubtle bg-surface-elevated flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-accent/15 text-accent border border-accent/30 font-bold">
              {evidence.type}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
              evidence.importance === 'critical' ? 'bg-stateError/15 text-stateError border border-stateError/30 font-bold' :
              evidence.importance === 'high' ? 'bg-stateWarning/15 text-stateWarning border border-stateWarning/30' :
              'bg-surface text-textSecondary border border-borderSubtle'
            }`}>
              {evidence.importance} Priority
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(evidence.id)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                isBookmarked
                  ? 'bg-accent text-background border-accent'
                  : 'bg-surface hover:bg-surface-hover text-textSecondary hover:text-textPrimary border-borderSubtle'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark Clue'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-surface hover:bg-surface-hover text-textSecondary hover:text-textPrimary border border-borderSubtle transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-textPrimary mb-1">
              {evidence.title}
            </h3>
            <p className="text-xs sm:text-sm text-textSecondary">
              {evidence.summary}
            </p>
          </div>

          {/* Interactive Inspection UI */}
          {renderContent()}

          {/* Forensic Metadata & Source */}
          <div className="p-4 rounded-xl bg-surface-elevated/50 border border-borderSubtle text-xs space-y-2">
            <div className="text-[11px] font-semibold text-accent uppercase tracking-wider">
              Forensic Provenance & Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-textSecondary text-[11px]">
              <div>
                <span className="text-textPrimary font-medium">Source: </span>
                {evidence.sourceDescription}
              </div>
              {evidence.eventTimestamp && (
                <div>
                  <span className="text-textPrimary font-medium">Timestamp: </span>
                  {new Date(evidence.eventTimestamp).toLocaleString()}
                </div>
              )}
            </div>

            {/* Related Suspects */}
            {evidence.relatedSuspectIds?.length > 0 && (
              <div className="pt-2 border-t border-borderSubtle flex items-center space-x-2">
                <span className="text-textPrimary font-medium text-[11px]">Related Suspects:</span>
                <div className="flex flex-wrap gap-1.5">
                  {evidence.relatedSuspectIds.map(sId => (
                    <span key={sId} className="px-2 py-0.5 rounded bg-surface border border-borderSubtle text-[10px] font-mono text-accent">
                      {getSuspectName(sId)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Navigation Footer */}
        <div className="px-5 py-3 border-t border-borderSubtle bg-surface-elevated/60 flex items-center justify-between text-xs font-medium">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-borderSubtle disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Clue</span>
          </button>

          <span className="text-textSecondary text-[11px] font-mono">
            Evidence Item
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-borderSubtle disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Next Clue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
