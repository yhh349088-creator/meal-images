/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './website/Navbar';
import { Hero } from './website/Hero';
import { Features } from './website/Features';
import { HowItWorks } from './website/HowItWorks';
import { About } from './website/About';
import { Pricing } from './website/Pricing';
import { Footer } from './website/Footer';
import { GetStarted } from './website/GetStarted';
import { AuthModal } from './website/AuthModal';
import { TermsModal } from './website/TermsModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'studio'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'contact' | 'about' | null>(null);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: 'home' | 'studio', sectionId?: string) => {
    setCurrentView(view);
    if (view === 'home' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' ? (
          <>
            <Hero
              onGetStarted={() => setCurrentView('studio')}
              onExploreFeatures={() => {
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <Features />
            <HowItWorks />
            <About />
            <Pricing
              onSelectPlan={(plan) => {
                // If they choose free tier or any plan, offer quick path to studio
                if (plan === 'Starter') {
                  setCurrentView('studio');
                }
              }}
            />
          </>
        ) : (
          <GetStarted
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenTerms={(type) => setLegalModalType(type)}
        onNavigateHome={() => setCurrentView('home')}
      />

      {/* Authentication Modal (Supabase ready) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Legal & Support Modals */}
      <TermsModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}
