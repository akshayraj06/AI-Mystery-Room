import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, Shield, FileText, Camera, MessageSquare, ArrowRight, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-borderSubtle bg-gradient-to-b from-surface/80 via-background to-background">
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
        
        {/* Glow ambient highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-elevated border border-accent/40 text-accent text-xs font-mono uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>AI-Powered Criminal Investigation Simulation</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-textPrimary leading-tight mb-6">
            Enter the Mystery.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#E5CE9F] to-accent">
              Follow the Evidence.
            </span><br />
            Uncover the Truth.
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-textSecondary mb-10 leading-relaxed font-sans">
            Craft your own scenario or dive into an AI-generated investigation. Interrogate suspect alibis, analyze WhatsApp transcripts, inspect CCTV logs, and unmask the canonical culprit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-lg font-semibold text-background bg-accent hover:bg-accent-hover shadow-[0_0_25px_rgba(199,168,106,0.35)] hover:shadow-[0_0_35px_rgba(199,168,106,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-5 h-5" />
              <span>Create a Mystery</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-lg font-medium text-textPrimary bg-surface-elevated hover:bg-surface-hover border border-borderSubtle transition-all"
            >
              <span>Explore How It Works</span>
            </a>
          </div>

          {/* Quick Example Teaser */}
          <div className="mt-14 max-w-2xl mx-auto p-4 rounded-lg bg-surface/60 border border-borderSubtle text-left text-xs font-mono text-textSecondary flex items-start space-x-3">
            <Key className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="text-accent font-semibold">Example Case Premise: </span>
              "A lead researcher is found unconscious inside a vault during a cyber security keynote. An encrypted flash drive is missing, and three colleagues were in the restricted wing..."
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-surface/30 border-b border-borderSubtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary mb-4">
              How the Investigation Works
            </h2>
            <p className="text-textSecondary">
              Every mystery follows strict logical consistency rules: clues, contradictions, and alibis all lead to a predetermined culprit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-xl bg-surface border border-borderSubtle hover:border-accent/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-elevated border border-borderSubtle flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform">
                <span className="font-display font-bold text-xl">1</span>
              </div>
              <h3 className="font-display font-bold text-xl text-textPrimary mb-2">Configure Scenario</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Provide a creative crime or unexplained incident. Select genre, difficulty (Easy, Medium, Hard), and number of suspects.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-xl bg-surface border border-borderSubtle hover:border-accent/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-elevated border border-borderSubtle flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform">
                <span className="font-display font-bold text-xl">2</span>
              </div>
              <h3 className="font-display font-bold text-xl text-textPrimary mb-2">Examine the Evidence</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Explore fictional WhatsApp chats, suspect dossiers, CCTV storyboards, and chronological logs to spot contradictions and deceit.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-xl bg-surface border border-borderSubtle hover:border-accent/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-elevated border border-borderSubtle flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform">
                <span className="font-display font-bold text-xl">3</span>
              </div>
              <h3 className="font-display font-bold text-xl text-textPrimary mb-2">Deliver the Verdict</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Select your culprit and submit your final verdict. Receive a server-verified verdict and the complete master resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg bg-surface border border-borderSubtle">
              <MessageSquare className="w-6 h-6 text-accent mb-3" />
              <h4 className="font-bold text-textPrimary mb-1">Fictional Chats</h4>
              <p className="text-xs text-textSecondary">Structured messaging logs showing conversations, timestamps, and deleted texts.</p>
            </div>

            <div className="p-5 rounded-lg bg-surface border border-borderSubtle">
              <Camera className="w-6 h-6 text-accent mb-3" />
              <h4 className="font-bold text-textPrimary mb-1">CCTV Simulations</h4>
              <p className="text-xs text-textSecondary">Honest timestamped surveillance stills and movement event logs.</p>
            </div>

            <div className="p-5 rounded-lg bg-surface border border-borderSubtle">
              <FileText className="w-6 h-6 text-accent mb-3" />
              <h4 className="font-bold text-textPrimary mb-1">Document Evidence</h4>
              <p className="text-xs text-textSecondary">Badges, receipts, memos, and confidential forensic lab notes.</p>
            </div>

            <div className="p-5 rounded-lg bg-surface border border-borderSubtle">
              <Shield className="w-6 h-6 text-accent mb-3" />
              <h4 className="font-bold text-textPrimary mb-1">Deterministic Truth</h4>
              <p className="text-xs text-textSecondary">Zero guessing: the culprit is locked securely on the server from generation start.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
