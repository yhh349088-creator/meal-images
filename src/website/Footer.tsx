/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Crosshair } from 'lucide-react';

interface FooterProps {
  onOpenTerms: (type: 'terms' | 'privacy' | 'contact' | 'about') => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms, onNavigateHome }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080c] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500 text-slate-950 font-bold">
                <Crosshair className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                YAZOO <span className="text-amber-400">DST AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Industrial vectorization and digital embroidery digitizing platform. Built to convert images into verified Tajima DST stitch binary files for multi-needle embroidery machines.
            </p>
            <p className="text-xs text-slate-400" dir="rtl">
              منصة YAZOO DST AI — تحويل التصاميم إلى ملفات تطريز رقمية قياسية جاهزة للإنتاج.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Platform
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={onNavigateHome}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features & Engine
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing & Tiers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Legal & Support
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onOpenTerms('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About YAZOO
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTerms('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTerms('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTerms('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 YAZOO DST AI. All rights reserved. Tajima is a registered trademark of its respective owner.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Format: Tajima DST</span>
            <span aria-hidden="true">·</span>
            <span>Version: 2026.1-PROD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
