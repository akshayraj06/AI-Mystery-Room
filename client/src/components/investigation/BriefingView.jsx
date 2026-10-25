import React from 'react';
import { MapPin, Clock, ShieldAlert, FileText, AlertTriangle, Users, Compass } from 'lucide-react';

export default function BriefingView({ mystery, session, onTabChange }) {
  if (!mystery) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Incident Overview Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-surface border border-borderSubtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
            {mystery.genre}
          </span>
          <span className="px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider bg-surface-elevated text-textSecondary border border-borderSubtle">
            Difficulty: {mystery.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider bg-stateWarning/10 text-stateWarning border border-stateWarning/20 flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Active Case</span>
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-textPrimary mb-4">
          {mystery.title}
        </h2>

        <p className="text-textSecondary leading-relaxed text-sm sm:text-base mb-6 font-sans">
          {mystery.caseBrief}
        </p>

        {/* Location & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-borderSubtle">
          <div className="flex items-start space-x-3 text-xs sm:text-sm text-textSecondary">
            <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="block font-semibold text-textPrimary">Incident Location</span>
              <span>{mystery.incident?.location || 'Unspecified Crime Scene'}</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-xs sm:text-sm text-textSecondary">
            <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="block font-semibold text-textPrimary">Incident Window</span>
              <span>{new Date(mystery.incident?.incidentTime || Date.now()).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Incident Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-surface border border-borderSubtle">
          <div className="flex items-center space-x-2 text-accent mb-3">
            <FileText className="w-5 h-5" />
            <h3 className="font-display font-bold text-lg text-textPrimary">Initial Incident Log</h3>
          </div>
          <p className="text-sm text-textSecondary leading-relaxed">
            {mystery.incident?.description}
          </p>
          <div className="mt-4 p-3 rounded bg-surface-elevated/70 border border-borderSubtle text-xs text-textSecondary font-mono">
            Note: All digital locks and recorded logs within a 2-hour window have been sequestered into the Evidence Room.
          </div>
        </div>

        {/* Investigation Directive */}
        <div className="p-6 rounded-xl bg-surface border border-borderSubtle flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-accent mb-3">
              <Compass className="w-5 h-5" />
              <h3 className="font-display font-bold text-lg text-textPrimary">Investigative Directive</h3>
            </div>
            <ul className="text-sm text-textSecondary space-y-2.5 list-disc list-inside">
              <li>Review the <strong className="text-textPrimary">{mystery.suspects?.length || 0} suspects</strong> to compare claimed alibis.</li>
              <li>Inspect the <strong className="text-textPrimary">{mystery.evidence?.length || 0} evidence items</strong> in the Evidence Room for contradictions.</li>
              <li>Reconstruct the event sequence on the <strong className="text-textPrimary">Timeline</strong>.</li>
              <li>Identify the canonical culprit before delivering your final verdict.</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onTabChange('suspects')}
              className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface-hover text-xs font-semibold text-textPrimary border border-borderSubtle transition-all"
            >
              Inspect Suspects &rarr;
            </button>
            <button
              onClick={() => onTabChange('evidence')}
              className="px-4 py-2 rounded-lg bg-accent text-background hover:bg-accent-hover text-xs font-semibold transition-all"
            >
              Enter Evidence Room &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
