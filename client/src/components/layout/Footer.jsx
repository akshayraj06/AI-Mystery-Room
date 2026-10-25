import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-borderSubtle bg-surface/60 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-textSecondary">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="font-semibold text-textPrimary">AI Mystery Room</span>
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="hidden sm:inline">&bull; Enter the mystery. Follow the evidence. Uncover the truth.</span>
          </div>

          {/* Mandatory Fictional Content Notice (Spec §13.4) */}
          <div className="bg-surface-elevated/70 border border-borderSubtle px-3 py-1.5 rounded text-[11px] text-textSecondary max-w-lg text-center md:text-right">
            <span className="text-accent font-medium">Fictional Disclaimer:</span> All cases, suspects, chat transcripts, documents, recordings, and media are entirely simulated and fictional AI constructs.
          </div>
        </div>
      </div>
    </footer>
  );
}
