import React, { useState } from 'react';
import { 
  MessageSquare, Video, FileText, UserCheck, Image as ImageIcon, 
  Search, Bookmark, BookmarkCheck, CheckCircle2, Filter, AlertTriangle 
} from 'lucide-react';
import EvidenceModal from './EvidenceModal';

export default function EvidenceRoomView({
  evidence = [],
  suspects = [],
  discoveredIds = [],
  bookmarkedIds = [],
  onSelectEvidence,
  activeEvidenceId,
  onCloseModal,
  onToggleBookmark
}) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'chat': return <MessageSquare className="w-4 h-4 text-accent" />;
      case 'cctv': return <Video className="w-4 h-4 text-stateError" />;
      case 'document': return <FileText className="w-4 h-4 text-accent" />;
      case 'witness_statement': return <UserCheck className="w-4 h-4 text-stateSuccess" />;
      default: return <FileText className="w-4 h-4 text-accent" />;
    }
  };

  const filteredEvidence = evidence.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const activeEvidence = evidence.find(e => e.id === activeEvidenceId);
  const activeIdx = evidence.findIndex(e => e.id === activeEvidenceId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Evidence Room Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-textPrimary">Evidence Room</h2>
          <p className="text-xs sm:text-sm text-textSecondary">
            Examine forensic artifacts, recovered communication archives, and surveillance logs.
          </p>
        </div>

        {/* Search & Stats */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-textSecondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-elevated border border-borderSubtle text-xs text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:border-accent"
            />
          </div>
          <span className="text-xs font-mono text-accent bg-surface-elevated px-3 py-1.5 rounded-lg border border-borderSubtle whitespace-nowrap">
            {discoveredIds.length} / {evidence.length} Inspected
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { key: 'all', label: 'All Artifacts' },
          { key: 'chat', label: 'Chat Logs' },
          { key: 'cctv', label: 'CCTV Logs' },
          { key: 'document', label: 'Documents & Forensics' },
          { key: 'witness_statement', label: 'Witness Statements' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap border ${
              filterType === tab.key
                ? 'bg-accent text-background border-accent shadow-sm'
                : 'bg-surface hover:bg-surface-elevated text-textSecondary hover:text-textPrimary border-borderSubtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvidence.map((item) => {
          const isDiscovered = discoveredIds.includes(item.id);
          const isBookmarked = bookmarkedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectEvidence(item.id)}
              className="p-5 rounded-xl bg-surface border border-borderSubtle hover:border-accent/60 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-[0_0_20px_rgba(199,168,106,0.15)] relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-borderSubtle flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {isBookmarked && (
                      <span title="Bookmarked clue" className="text-accent">
                        <BookmarkCheck className="w-4 h-4 fill-accent/20" />
                      </span>
                    )}
                    {isDiscovered && (
                      <span title="Inspected" className="text-stateSuccess">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-textPrimary group-hover:text-accent transition-colors mb-2 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-textSecondary line-clamp-3 leading-relaxed mb-4">
                  {item.summary}
                </p>
              </div>

              {/* Card Footer with Priority & Provenance */}
              <div className="pt-3 border-t border-borderSubtle flex items-center justify-between text-[11px] font-mono">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                  item.importance === 'critical' ? 'bg-stateError/10 text-stateError border border-stateError/20 font-bold' :
                  item.importance === 'high' ? 'bg-stateWarning/10 text-stateWarning border border-stateWarning/20' :
                  'bg-surface-elevated text-textSecondary border border-borderSubtle'
                }`}>
                  {item.importance}
                </span>

                <span className="text-accent group-hover:underline font-sans font-semibold">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="py-16 text-center text-textSecondary bg-surface rounded-xl border border-borderSubtle">
          <Filter className="w-8 h-8 text-textSecondary mx-auto mb-2 opacity-50" />
          <p className="text-sm">No evidence items match the selected filter criteria.</p>
        </div>
      )}

      {/* Dedicated Evidence Viewer Modal */}
      {activeEvidence && (
        <EvidenceModal
          evidence={activeEvidence}
          isBookmarked={bookmarkedIds.includes(activeEvidence.id)}
          onToggleBookmark={onToggleBookmark}
          onClose={onCloseModal}
          onPrev={() => activeIdx > 0 && onSelectEvidence(evidence[activeIdx - 1].id)}
          onNext={() => activeIdx < evidence.length - 1 && onSelectEvidence(evidence[activeIdx + 1].id)}
          hasPrev={activeIdx > 0}
          hasNext={activeIdx < evidence.length - 1}
          suspects={suspects}
        />
      )}
    </div>
  );
}
