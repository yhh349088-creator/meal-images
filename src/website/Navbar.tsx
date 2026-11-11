/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Crosshair, Sparkles, Download } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'studio';
  onNavigate: (view: 'home' | 'studio', sectionId?: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (sectionId) {
      if (currentView !== 'home') {
        onNavigate('home', sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark */}
        <button 
          onClick={() => handleNavClick()}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-sm shadow-amber-950/40">
            <Crosshair className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            YAZOO <span className="text-amber-400">DST AI</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single-Line, 4-5 links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => handleNavClick()}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'home' ? 'text-white font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            About
          </button>
        </nav>

        {/* Zone 3: Actions (Download ZIP, Login & Primary CTA) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href="/yazoo-dst-ai-production.zip"
            download="yazoo-dst-ai-production.zip"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-amber-300 hover:border-amber-500/50 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="تحميل ملف المشروع الكامل ZIP"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download ZIP</span>
          </a>
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition-all hover:bg-amber-400 active:scale-95 whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Get Started</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => onNavigate('studio')}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950"
          >
            Get Started
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#0c1017] px-4 pt-3 pb-6 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick()}
              className="text-left py-2 hover:text-amber-400"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="text-left py-2 hover:text-amber-400"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-2 hover:text-amber-400"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="text-left py-2 hover:text-amber-400"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left py-2 hover:text-amber-400"
            >
              About
            </button>
            <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="text-xs font-medium text-slate-300 hover:text-white"
              >
                Sign In / Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('studio');
                }}
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950"
              >
                Launch Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
