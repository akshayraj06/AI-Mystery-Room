import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, Loader2, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const STAGES = [
  { key: 'queued', label: 'Queuing Investigation Request' },
  { key: 'designing_case', label: 'Drafting Incident Blueprint & Motive' },
  { key: 'creating_suspects', label: 'Architecting Suspects & Alibis' },
  { key: 'creating_evidence', label: 'Synthesizing Evidence & Clues' },
  { key: 'validating', label: 'Auditing Logical Consistency & Timeline' },
  { key: 'ready', label: 'Investigation Room Assembled' }
];

export default function GenerationPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval = null;
    let isCancelled = false;

    const pollJob = async () => {
      try {
        const data = await api.getGenerationJob(jobId);
        if (isCancelled) return;
        setJob(data);

        if (data.status === 'ready' && data.mysteryId) {
          clearInterval(interval);
          setTimeout(() => {
            navigate(`/investigation/${data.mysteryId}`);
          }, 800);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setError(data.error?.message || 'Case generation encountered an unrecoverable logic or AI issue.');
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to poll generation status.');
        }
      }
    };

    pollJob();
    interval = setInterval(pollJob, 2500);

    return () => {
      isCancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [jobId, navigate]);

  const currentStageIndex = () => {
    if (!job) return 0;
    if (job.status === 'ready') return 5;
    const stageKey = job.progressStage || job.status;
    const found = STAGES.findIndex(s => s.key === stageKey);
    return found !== -1 ? found : 1;
  };

  const activeIdx = currentStageIndex();

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface border border-borderSubtle rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

        {error ? (
          <div>
            <div className="w-14 h-14 mx-auto rounded-full bg-stateError/10 border border-stateError/30 flex items-center justify-center text-stateError mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-textPrimary mb-2">Generation Failed</h2>
            <p className="text-sm text-textSecondary mb-6">{error}</p>
            <div className="flex items-center justify-center space-x-3">
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-sm font-medium text-textPrimary border border-borderSubtle"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Setup</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Spinning Radar / Magnifier */}
            <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
              <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-accent">
                <Search className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-textPrimary mb-2">
              Constructing Case Dossier
            </h2>
            <p className="text-xs text-textSecondary font-mono mb-8">
              Job ID: {jobId}
            </p>

            {/* Stages Progression */}
            <div className="space-y-3 text-left">
              {STAGES.map((stage, idx) => {
                const isDone = activeIdx > idx;
                const isCurrent = activeIdx === idx;

                return (
                  <div
                    key={stage.key}
                    className={`flex items-center space-x-3 text-xs p-2.5 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-accent/10 border border-accent/30 text-accent font-semibold'
                        : isDone
                        ? 'text-stateSuccess bg-surface-elevated/40'
                        : 'text-textSecondary/40'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-stateSuccess" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 shrink-0 animate-spin text-accent" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-borderSubtle shrink-0" />
                    )}
                    <span>{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
