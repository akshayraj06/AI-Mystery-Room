import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  ArrowLeft, RefreshCw, Trophy, Key, HelpCircle, FileText, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function VerdictPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [mystery, setMystery] = useState(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verdictResult, setVerdictResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // When VerdictPage opens, we need the mystery suspects so the user can choose
    let mounted = true;
    const fetchSessionAndMystery = async () => {
      try {
        // We can inspect the session's mysteryId
        // In local state, or fetch session
        // Let's create an endpoint or pass state, or find session
      } catch (err) {
        if (mounted) setError(err.message);
      }
    };
    fetchSessionAndMystery();
    return () => { mounted = false; };
  }, [sessionId]);

  // Let's make sure we have the mystery details. We can query `/api/v1/sessions/:sessionId/mystery` or retrieve via session.
  // Wait! Let's check our backend endpoints:
  // We have `POST /mysteries/:mysteryId/sessions` which returned { sessionId, mysteryId, token, status }.
  // Let's add a quick helper endpoint `GET /api/v1/sessions/:sessionId` on backend so the client can load the session and its mystery!
  // Let's check `sessionController.js` and add `GET /sessions/:sessionId` if not present.
  return (
    <VerdictContent
      sessionId={sessionId}
      selectedSuspectId={selectedSuspectId}
      setSelectedSuspectId={setSelectedSuspectId}
      confirmModalOpen={confirmModalOpen}
      setConfirmModalOpen={setConfirmModalOpen}
      submitting={submitting}
      setSubmitting={setSubmitting}
      verdictResult={verdictResult}
      setVerdictResult={setVerdictResult}
      error={error}
      setError={setError}
    />
  );
}

function VerdictContent({
  sessionId,
  selectedSuspectId,
  setSelectedSuspectId,
  confirmModalOpen,
  setConfirmModalOpen,
  submitting,
  setSubmitting,
  verdictResult,
  setVerdictResult,
  error,
  setError
}) {
  const [mystery, setMystery] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const sessionRes = await fetch(`/api/v1/sessions/${sessionId}`).then(r => r.json());
        if (sessionRes?.error) throw new Error(sessionRes.error.message);
        if (!mounted) return;
        setSession(sessionRes);

        const mysteryRes = await api.getMystery(sessionRes.mysteryId);
        if (!mounted) return;
        setMystery(mysteryRes);

        if (sessionRes.status === 'submitted' && sessionRes.verdict) {
          // If already submitted, reveal verdict
          setVerdictResult({
            alreadySubmitted: true,
            correct: sessionRes.verdict.isCorrect,
            selectedSuspectId: sessionRes.verdict.selectedSuspectId,
            score: sessionRes.verdict.score,
          });
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to initialize verdict view.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [sessionId]);

  const handleSubmitVerdict = async () => {
    if (!selectedSuspectId) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await api.submitVerdict(sessionId, selectedSuspectId);
      setVerdictResult(result);
      setConfirmModalOpen(false);

      if (result.correct) {
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit verdict.');
      setConfirmModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSuspect = mystery?.suspects?.find(s => s.id === selectedSuspectId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-center">
        <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-textSecondary uppercase tracking-widest">
          Securing Final Evidence Deliberation...
        </p>
      </div>
    );
  }

  // --- RESULT VIEW (POST-VERDICT) ---
  if (verdictResult) {
    const isWin = verdictResult.correct;
    const sol = verdictResult.solution;

    return (
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full animate-fade-in">
        {/* Banner */}
        <div className={`p-8 rounded-2xl border text-center relative overflow-hidden mb-8 ${
          isWin
            ? 'bg-stateSuccess/10 border-stateSuccess/40 text-stateSuccess'
            : 'bg-stateError/10 border-stateError/40 text-stateError'
        }`}>
          <div className="scanlines absolute inset-0 opacity-20 pointer-events-none" />

          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-surface-elevated border border-borderSubtle">
            {isWin ? (
              <CheckCircle2 className="w-10 h-10 text-stateSuccess" />
            ) : (
              <XCircle className="w-10 h-10 text-stateError" />
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-textPrimary tracking-tight mb-2">
            {isWin ? 'CASE SOLVED — ACCUSATION CONFIRMED' : 'CASE UNRESOLVED — WRONG CULPRIT ACCUSED'}
          </h1>

          <p className="text-sm sm:text-base text-textSecondary max-w-xl mx-auto mb-6">
            {isWin
              ? 'Your forensic analysis was accurate. The evidence corroborates your accusation.'
              : 'The evidence does not support your verdict. The true culprit was another person of interest.'}
          </p>

          {/* Score Badge */}
          {verdictResult.score !== undefined && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-surface-elevated border border-borderSubtle text-accent font-mono text-xs font-bold">
              <Trophy className="w-4 h-4" />
              <span>Investigation Score: {verdictResult.score} / 100 Points</span>
            </div>
          )}
        </div>

        {/* Canonical Solution Breakdown */}
        {sol && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-xl bg-surface border border-accent/40 shadow-xl space-y-6">
              <div className="border-b border-borderSubtle pb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold block mb-1">
                  Canonical Case Truth
                </span>
                <h2 className="font-display text-2xl font-bold text-textPrimary">
                  The Perpetrator: <span className="text-accent">{sol.culpritName}</span> ({sol.culpritId})
                </h2>
              </div>

              {/* Motive & Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="p-4 rounded-lg bg-surface-elevated/60 border border-borderSubtle space-y-1.5">
                  <span className="font-bold text-accent uppercase tracking-wider text-[11px] block">
                    Canonical Motive
                  </span>
                  <p className="text-textSecondary leading-relaxed">{sol.motive}</p>
                </div>

                <div className="p-4 rounded-lg bg-surface-elevated/60 border border-borderSubtle space-y-1.5">
                  <span className="font-bold text-accent uppercase tracking-wider text-[11px] block">
                    Method & Opportunity
                  </span>
                  <p className="text-textSecondary leading-relaxed">{sol.method} {sol.opportunity}</p>
                </div>
              </div>

              {/* Timeline Reconciliation */}
              <div className="p-4 rounded-lg bg-surface-elevated/60 border border-borderSubtle space-y-1.5 text-xs sm:text-sm">
                <span className="font-bold text-accent uppercase tracking-wider text-[11px] block">
                  Timeline Reconstruction
                </span>
                <p className="text-textSecondary leading-relaxed">{sol.timelineExplanation}</p>
              </div>

              {/* Red Herring Explanation */}
              {sol.redHerringExplanation && (
                <div className="p-4 rounded-lg bg-stateWarning/5 border border-stateWarning/30 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-stateWarning uppercase tracking-wider text-[11px] block">
                    How Misleading Clues Were Disproven (Red Herring Analysis)
                  </span>
                  <p className="text-textSecondary leading-relaxed">{sol.redHerringExplanation}</p>
                </div>
              )}

              {/* Evidence Reasoning */}
              {sol.evidenceReasoning?.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="font-bold text-textPrimary uppercase tracking-wider text-[11px] block">
                    Forensic Proof Corroboration
                  </span>
                  <div className="space-y-2">
                    {sol.evidenceReasoning.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-surface-elevated/40 border border-borderSubtle text-xs">
                        <span className="font-mono text-accent font-semibold block mb-0.5">{item.evidenceId}:</span>
                        <p className="text-textSecondary">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Next Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                to={`/investigation/${session?.mysteryId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-surface-elevated hover:bg-surface-hover text-sm font-semibold text-textPrimary border border-borderSubtle"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Review Evidence Room</span>
              </Link>

              <Link
                to="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-accent text-background hover:bg-accent-hover text-sm font-semibold shadow-[0_0_20px_rgba(199,168,106,0.3)]"
              >
                <span>Start New Investigation &rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- SELECTION VIEW (PRE-VERDICT) ---
  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <Link
          to={`/investigation/${session?.mysteryId}`}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-accent hover:underline mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Investigation Dashboard</span>
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
          Deliver Final Verdict
        </h1>
        <p className="text-sm text-textSecondary mt-2">
          Select the person of interest responsible for the incident. Your choice will be deterministically checked against the server's canonical truth.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-stateError/10 border border-stateError/30 flex items-start space-x-3 text-stateError text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Suspect Selection Radio Cards */}
      <div className="space-y-4 mb-8">
        {(mystery?.suspects || []).map(suspect => {
          const isSelected = selectedSuspectId === suspect.id;

          return (
            <div
              key={suspect.id}
              onClick={() => setSelectedSuspectId(suspect.id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-accent/10 border-accent shadow-[0_0_20px_rgba(199,168,106,0.25)]'
                  : 'bg-surface hover:bg-surface-elevated border-borderSubtle'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg border ${
                  isSelected
                    ? 'bg-accent text-background border-accent'
                    : 'bg-surface-elevated text-accent border-borderSubtle'
                }`}>
                  {suspect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-textPrimary">{suspect.name}</h3>
                  <p className="text-xs font-mono text-accent">{suspect.role}</p>
                  <p className="text-xs text-textSecondary italic mt-1 line-clamp-1">"{suspect.alibi}"</p>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isSelected ? 'border-accent bg-accent text-background' : 'border-borderSubtle'
              }`}>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Action */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!selectedSuspectId}
          onClick={() => setConfirmModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg font-semibold text-background bg-accent hover:bg-accent-hover shadow-[0_0_20px_rgba(199,168,106,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Accuse Selected Suspect</span>
        </button>
      </div>

      {/* Confirmation Dialog (Spec §6.3: Require explicit confirmation) */}
      {confirmModalOpen && selectedSuspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full bg-surface border border-accent/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-stateWarning/10 border border-stateWarning/30 flex items-center justify-center text-stateWarning mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="font-display text-xl font-bold text-textPrimary">
              Confirm Accusation
            </h3>

            <p className="text-xs sm:text-sm text-textSecondary leading-relaxed">
              Are you sure you want to formally name <strong className="text-accent">{selectedSuspect.name}</strong> as the sole perpetrator?
              <br /><br />
              This verdict is final and cannot be modified once submitted.
            </p>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-xs font-semibold text-textSecondary border border-borderSubtle"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitVerdict}
                className="px-6 py-2.5 rounded-lg bg-accent text-background hover:bg-accent-hover text-xs font-semibold shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Evaluating...' : 'Confirm & Deliver Verdict'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
