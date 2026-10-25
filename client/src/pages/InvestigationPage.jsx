import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, Users, Eye, Clock, BookOpen, ShieldAlert, 
  ArrowRight, Loader2, AlertCircle, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import BriefingView from '../components/investigation/BriefingView';
import SuspectsView from '../components/investigation/SuspectsView';
import EvidenceRoomView from '../components/investigation/EvidenceRoomView';
import TimelineView from '../components/investigation/TimelineView';
import DetectiveNotes from '../components/investigation/DetectiveNotes';

export default function InvestigationPage() {
  const { mysteryId } = useParams();
  const navigate = useNavigate();

  const [mystery, setMystery] = useState(null);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('briefing');
  const [activeEvidenceId, setActiveEvidenceId] = useState(null);
  const [discoveredIds, setDiscoveredIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Case and Session
  useEffect(() => {
    let mounted = true;

    const loadCaseAndSession = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch public mystery case file
        const caseData = await api.getMystery(mysteryId);
        if (!mounted) return;
        setMystery(caseData);

        // 2. Fetch or create local/server session
        const sessionData = await api.createSession(mysteryId);
        if (!mounted) return;
        setSession(sessionData);

        // Preload any existing discovered IDs
        setDiscoveredIds(sessionData.discoveredEvidenceIds || []);
        setBookmarkedIds(sessionData.bookmarkedEvidenceIds || []);
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load investigation room.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCaseAndSession();
    return () => {
      mounted = false;
    };
  }, [mysteryId]);

  // Handle clicking an evidence item
  const handleSelectEvidence = async (evidenceId) => {
    setActiveEvidenceId(evidenceId);
    if (!discoveredIds.includes(evidenceId)) {
      const nextDiscovered = [...discoveredIds, evidenceId];
      setDiscoveredIds(nextDiscovered);
      if (session?.sessionId) {
        try {
          await api.getEvidence(session.sessionId, evidenceId);
          await api.updateProgress(session.sessionId, { discoveredEvidenceIds: nextDiscovered });
        } catch (err) {
          console.warn('Could not sync evidence discovery:', err);
        }
      }
    }
  };

  // Handle bookmarking / unbookmarking evidence
  const handleToggleBookmark = async (evidenceId) => {
    const isBookmarked = bookmarkedIds.includes(evidenceId);
    const nextBookmarked = isBookmarked
      ? bookmarkedIds.filter(id => id !== evidenceId)
      : [...bookmarkedIds, evidenceId];

    setBookmarkedIds(nextBookmarked);
    if (session?.sessionId) {
      try {
        await api.updateProgress(session.sessionId, { bookmarkedEvidenceIds: nextBookmarked });
      } catch (err) {
        console.warn('Could not sync bookmark state:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-center">
        <div className="space-y-4">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto" />
          <p className="text-sm font-mono text-textSecondary uppercase tracking-widest">
            Unsealing Evidence Archives...
          </p>
        </div>
      </div>
    );
  }

  if (error || !mystery) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md w-full bg-surface border border-stateError/30 p-8 rounded-xl">
          <AlertCircle className="w-10 h-10 text-stateError mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold text-textPrimary mb-2">Investigation Error</h2>
          <p className="text-sm text-textSecondary mb-6">{error || 'Case not found'}</p>
          <Link
            to="/create"
            className="px-5 py-2.5 rounded-lg bg-surface-elevated text-textPrimary text-xs font-semibold border border-borderSubtle"
          >
            Create New Case
          </Link>
        </div>
      </div>
    );
  }

  const bookmarkedItems = (mystery.evidence || []).filter(e => bookmarkedIds.includes(e.id));

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Top Case Bar */}
      <section className="bg-surface/95 border-b border-borderSubtle sticky top-16 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-stateWarning animate-ping shrink-0" />
            <h1 className="font-display font-bold text-lg sm:text-xl text-textPrimary truncate">
              {mystery.title}
            </h1>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-surface-elevated text-accent border border-accent/20">
              {mystery.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Clue Progress */}
            <div className="text-xs font-mono text-textSecondary hidden sm:block">
              Clues: <span className="text-accent font-semibold">{discoveredIds.length}</span>/{mystery.evidence?.length || 0}
            </div>

            {/* Submit Verdict CTA */}
            <button
              onClick={() => {
                if (session?.sessionId) {
                  navigate(`/verdict/${session.sessionId}`);
                }
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold text-background bg-accent hover:bg-accent-hover shadow-[0_0_15px_rgba(199,168,106,0.3)] transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Deliver Verdict</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-6 border-t border-borderSubtle/50 overflow-x-auto text-xs font-medium scrollbar-none">
          {[
            { key: 'briefing', label: 'Briefing', icon: FileText },
            { key: 'suspects', label: `Suspects (${mystery.suspects?.length || 0})`, icon: Users },
            { key: 'evidence', label: `Evidence Room (${mystery.evidence?.length || 0})`, icon: Eye },
            { key: 'timeline', label: `Timeline (${mystery.timeline?.length || 0})`, icon: Clock },
            { key: 'notes', label: `Journal & Notes (${bookmarkedIds.length})`, icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-accent text-accent'
                    : 'border-transparent text-textSecondary hover:text-textPrimary hover:border-borderSubtle'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Investigation Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {activeTab === 'briefing' && (
          <BriefingView
            mystery={mystery}
            session={session}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'suspects' && (
          <SuspectsView
            suspects={mystery.suspects}
            evidence={mystery.evidence}
            onSelectEvidence={(eId) => {
              setActiveTab('evidence');
              handleSelectEvidence(eId);
            }}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceRoomView
            evidence={mystery.evidence}
            suspects={mystery.suspects}
            discoveredIds={discoveredIds}
            bookmarkedIds={bookmarkedIds}
            activeEvidenceId={activeEvidenceId}
            onSelectEvidence={handleSelectEvidence}
            onCloseModal={() => setActiveEvidenceId(null)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            timeline={mystery.timeline}
            suspects={mystery.suspects}
            onSelectEvidence={(eId) => {
              setActiveTab('evidence');
              handleSelectEvidence(eId);
            }}
            onSelectSuspect={() => setActiveTab('suspects')}
          />
        )}

        {activeTab === 'notes' && (
          <DetectiveNotes
            sessionId={session?.sessionId}
            initialNotes={session?.notes || ''}
            bookmarkedEvidence={bookmarkedItems}
            onSelectEvidence={(eId) => {
              setActiveTab('evidence');
              handleSelectEvidence(eId);
            }}
            onRemoveBookmark={handleToggleBookmark}
          />
        )}
      </div>
    </div>
  );
}
