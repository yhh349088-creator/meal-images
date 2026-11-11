/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Layers, Sliders, Cpu, CheckCircle } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onExploreFeatures }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background subtle radial ambient gradients */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/10 via-slate-900/0 to-transparent blur-3xl"
      />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Proposition and Actions */}
          <div className="lg:col-span-7">
            
            {/* Quiet category indicator - Zero Pill discipline */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-4 tracking-wide">
              <span>DIGITAL EMBROIDERY ENGINE</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">TAJIMA DST 2026</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">STITCH VECTORIZATION</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance leading-[1.12]">
              Turn Your Designs Into{' '}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Embroidery Files.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
              Transform artwork, company logos, and vector illustrations into production-ready Tajima DST embroidery files. Calibrate stitch density, pull compensation, and millimeter dimensions tailored for commercial embroidery machines.
            </p>

            <p className="mt-2 text-sm text-slate-400" dir="rtl">
              حوّل شعاراتك ورسوماتك إلى ملفات تطريز رقمية قياسية (Tajima DST) بدقة عالية ومسارات إبر مدروسة تناسب ماكينات التطريز الصناعية.
            </p>

            {/* CTA Action Row */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-md transition-all hover:bg-amber-400 active:scale-98 whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onExploreFeatures}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-5 py-3.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-colors hover:border-slate-700 hover:text-white active:scale-98 whitespace-nowrap"
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Proof highlights adjacent to CTA */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
              <div>
                <p className="font-mono text-xl font-bold text-white tabular-nums">0.1 mm</p>
                <p className="text-xs text-slate-400 mt-0.5">Tajima Coordinate Precision</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold text-white tabular-nums">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">Standard DST Compatibility</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold text-white tabular-nums">4 Types</p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, JPEG, WEBP</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase Container */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-[#0d111a] p-3 shadow-2xl shadow-black/80">
              
              {/* Image Frame with fallback */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900">
                <img
                  src="/src/assets/images/embroidery_hero_preview_1794403375225.jpg"
                  alt="Multi-thread digital embroidery with satin and tatami stitches on dark fabric"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    // Fallback to second image if first fails
                    e.currentTarget.src = "/src/assets/images/embroidery_sample_patch_1794403375063.jpg";
                  }}
                />
                
                {/* Visual Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Technical Calibration Overlay Bar */}
                <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-slate-700/60 bg-slate-950/90 p-3 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-amber-400" />
                      <span className="font-mono font-medium text-white">DST HEADER ST</span>
                    </div>
                    <span className="font-mono text-slate-400 tabular-nums">TAJIMA 0.1MM</span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Density</span>
                      <span className="font-mono text-slate-200">0.40 mm</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pull Comp</span>
                      <span className="font-mono text-slate-200">+0.2 mm</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Max Stitch</span>
                      <span className="font-mono text-slate-200">7.2 mm</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sub-card feature strip */}
              <div className="mt-3 flex items-center justify-between px-2 py-1 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-amber-400" />
                  <span>Stitch Path Calibration</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Hardware Ready</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
