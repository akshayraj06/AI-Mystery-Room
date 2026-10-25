import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md w-full bg-surface border border-borderSubtle p-8 rounded-xl">
        <HelpCircle className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-textPrimary mb-2">404 - Case Not Found</h1>
        <p className="text-sm text-textSecondary mb-6">
          The requested investigation file, evidence item, or route does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-accent text-background font-semibold hover:bg-accent-hover text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Bureau</span>
        </Link>
      </div>
    </div>
  );
}
