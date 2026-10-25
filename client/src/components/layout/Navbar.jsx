import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, HelpCircle, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { api } from '../../services/api';

export default function Navbar() {
  const location = useLocation();
  const [serverOnline, setServerOnline] = useState(null);

  useEffect(() => {
    let mounted = true;
    const checkServer = async () => {
      try {
        await api.getHealth();
        if (mounted) setServerOnline(true);
      } catch {
        if (mounted) setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-borderSubtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-accent/30 flex items-center justify-center text-accent group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(199,168,106,0.3)] transition-all">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-wider text-textPrimary group-hover:text-accent transition-colors">
                AI MYSTERY ROOM
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-textSecondary font-mono -mt-1">
                Investigation Bureau
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/#how-it-works"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/#how-it-works')
                  ? 'text-accent bg-surface-elevated'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-surface-elevated/50'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">How It Works</span>
              </span>
            </Link>

            <Link
              to="/create"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold text-background bg-accent hover:bg-accent-hover shadow-md hover:shadow-[0_0_20px_rgba(199,168,106,0.4)] transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Mystery</span>
            </Link>

            {/* Server Status Indicator */}
            <div className="pl-2 border-l border-borderSubtle">
              <div
                title={serverOnline === true ? "Backend connected" : serverOnline === false ? "Backend disconnected" : "Checking backend..."}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
                  serverOnline === true
                    ? "bg-stateSuccess/10 text-stateSuccess border-stateSuccess/30"
                    : serverOnline === false
                    ? "bg-stateError/10 text-stateError border-stateError/30"
                    : "bg-surface-elevated text-textSecondary border-borderSubtle"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  serverOnline === true ? "bg-stateSuccess animate-pulse" : serverOnline === false ? "bg-stateError" : "bg-textSecondary"
                }`} />
                <span className="hidden md:inline">
                  {serverOnline === true ? "API Online" : serverOnline === false ? "Offline" : "Checking"}
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
