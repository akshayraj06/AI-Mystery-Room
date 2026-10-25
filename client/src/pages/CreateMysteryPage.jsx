import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle, RefreshCw, Compass, Users, ShieldAlert, Check } from 'lucide-react';
import { api } from '../services/api';

const PRESET_EXAMPLES = [
  {
    title: "The Silicon Vault Incident",
    premise: "A lead cryptography researcher is found unconscious inside a secure server room during a company gala. A prototype quantum key has vanished from the hardware safe. Three colleagues had badge access, and security logs show a 4-minute camera blackout.",
    genre: "crime",
    difficulty: "medium",
    suspectCount: 4,
    setting: "Cybersecurity Tech Firm, Zurich",
    tone: "realistic thriller"
  },
  {
    title: "The Manor Library Will",
    premise: "An eccentric antiquarian is discovered poisoned at his mahogany desk on the night his final testament was to be signed. The draft of the will is burned in the fireplace, and the rain prevented anyone from leaving the estate grounds.",
    genre: "noir",
    difficulty: "hard",
    suspectCount: 4,
    setting: "Blackwood Manor, Yorkshire",
    tone: "classic detective noir"
  },
  {
    title: "The Orbital Airlock Breach",
    premise: "During an atmospheric telemetry test on Station Epsilon, the research airlock opened prematurely, jettisoning the only bio-sample container into orbit. Emergency overrides could only be authorized from three terminals.",
    genre: "sci-fi",
    difficulty: "medium",
    suspectCount: 3,
    setting: "Orbital Research Station Epsilon",
    tone: "hard sci-fi suspense"
  }
];

export default function CreateMysteryPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    premise: '',
    genre: 'crime',
    difficulty: 'medium',
    suspectCount: 4,
    setting: '',
    tone: 'realistic suspense',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'suspectCount' ? parseInt(value, 10) : value
    }));
  };

  const loadExample = (example) => {
    setFormData({
      premise: example.premise,
      genre: example.genre,
      difficulty: example.difficulty,
      suspectCount: example.suspectCount,
      setting: example.setting,
      tone: example.tone
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.premise.trim()) {
      setError('Please provide a mystery premise or crime scenario.');
      return;
    }
    if (formData.premise.length > 3000) {
      setError('Scenario exceeds maximum allowed length (3,000 characters).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.createMystery(formData);
      if (response?.jobId) {
        navigate(`/jobs/${response.jobId}`);
      } else {
        throw new Error('No job identifier returned by server.');
      }
    } catch (err) {
      setError(err.message || 'Failed to start mystery generation.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
          Create an Investigation
        </h1>
        <p className="text-textSecondary mt-2">
          Define the premise, choose the challenge level, and let the AI architect a consistent fictional case.
        </p>
      </div>

      {/* Preset Inspirations */}
      <div className="mb-8 p-4 rounded-xl bg-surface border border-borderSubtle">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Scenarios for Quick Play</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadExample(ex)}
              className="text-left p-3 rounded-lg bg-surface-elevated/60 hover:bg-surface-elevated border border-borderSubtle hover:border-accent/40 transition-all text-xs group"
            >
              <div className="font-semibold text-textPrimary group-hover:text-accent mb-1">{ex.title}</div>
              <div className="text-textSecondary line-clamp-2 text-[11px]">{ex.premise}</div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-stateError/10 border border-stateError/30 flex items-start space-x-3 text-stateError text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 sm:p-8 rounded-xl border border-borderSubtle">
        {/* Scenario Textarea */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="premise" className="block text-sm font-semibold text-textPrimary">
              Incident or Mystery Scenario <span className="text-accent">*</span>
            </label>
            <span className={`text-xs font-mono ${formData.premise.length > 2800 ? 'text-stateWarning' : 'text-textSecondary'}`}>
              {formData.premise.length} / 3000
            </span>
          </div>
          <textarea
            id="premise"
            name="premise"
            rows={5}
            required
            value={formData.premise}
            onChange={handleChange}
            placeholder="Describe the crime or unexplained mystery, victims, location, and the general setting..."
            className="w-full rounded-lg bg-surface-elevated border border-borderSubtle px-4 py-3 text-sm text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y"
          />
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full rounded-lg bg-surface-elevated border border-borderSubtle px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
            >
              <option value="crime">Crime / Suspense</option>
              <option value="noir">Classic Noir</option>
              <option value="thriller">Psychological Thriller</option>
              <option value="sci-fi">Sci-Fi Investigation</option>
              <option value="heist">Heist & Theft</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full rounded-lg bg-surface-elevated border border-borderSubtle px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
            >
              <option value="easy">Easy (Direct clues, 3 suspects)</option>
              <option value="medium">Medium (Contradictions, 4 suspects)</option>
              <option value="hard">Hard (Subtle alibis, 4-5 suspects)</option>
            </select>
          </div>

          {/* Suspect Count */}
          <div>
            <label htmlFor="suspectCount" className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
              Suspect Count
            </label>
            <select
              id="suspectCount"
              name="suspectCount"
              value={formData.suspectCount}
              onChange={handleChange}
              className="w-full rounded-lg bg-surface-elevated border border-borderSubtle px-3 py-2.5 text-sm text-textPrimary focus:outline-none focus:border-accent"
            >
              <option value={3}>3 Suspects</option>
              <option value={4}>4 Suspects (Recommended)</option>
              <option value={5}>5 Suspects</option>
            </select>
          </div>
        </div>

        {/* Optional Context Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-borderSubtle/50">
          <div>
            <label htmlFor="setting" className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
              Setting (Optional)
            </label>
            <input
              type="text"
              id="setting"
              name="setting"
              value={formData.setting}
              onChange={handleChange}
              placeholder="e.g. Modern high-tech skyscraper in Tokyo"
              className="w-full rounded-lg bg-surface-elevated border border-borderSubtle px-3 py-2 text-sm text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="tone" className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
              Tone (Optional)
            </label>
            <input
              type="text"
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              placeholder="e.g. Atmospheric, dark, analytical"
              className="w-full rounded-lg bg-surface-elevated border border-borderSubtle px-3 py-2 text-sm text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Submission Button */}
        <div className="pt-4 flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg font-semibold text-background bg-accent hover:bg-accent-hover shadow-[0_0_20px_rgba(199,168,106,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Initializing Case...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Mystery</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
