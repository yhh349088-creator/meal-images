/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, ShieldCheck, Factory, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#090c12] border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Emblem */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl border border-slate-800 bg-[#0e121a] p-3 shadow-xl">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                <img
                  src="/src/assets/images/embroidery_sample_patch_1794403375063.jpg"
                  alt="Industrial embroidered crest patch demonstrating satin borders and dense tatami fill"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-102"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/images/embroidery_hero_preview_1794403375225.jpg";
                  }}
                />
              </div>

              <div className="p-3">
                <p className="text-xs font-medium text-slate-300">
                  Precision Stitch Topology
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Engineered to prevent needle deflections, thread breakage, and puckering across multi-needle Tajima, Barudan, Brother, and Melco commercial units.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Mission and Solution */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="text-xs font-semibold tracking-wider text-amber-400 mb-2">
              ABOUT YAZOO DST AI
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              Empowering Modern Apparel Decorators with Seamless Digitizing
            </h2>

            <p className="mt-5 text-base text-slate-300 leading-relaxed">
              Traditional embroidery digitizing (punching) demands hours of manual node tracing, underlay mapping, and trial-and-error stitch density compensation in expensive software. 
            </p>

            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              <strong>YAZOO DST AI</strong> was engineered to automate this pipeline. By combining algorithmic edge vectorization with standard Tajima binary encoding, our platform converts your designs into clean, production-calibrated DST files in moments.
            </p>

            <div className="mt-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-sm text-slate-300" dir="rtl">
              <p className="font-semibold text-amber-400 mb-1">
                هدف منصة YAZOO DST AI:
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                توفير حل متكامل لأصحاب ورش ومشاغل ومصانع التطريز ومصممي الأزياء، لتحويل الشعارات والصور إلى أوامر تطريز رقمية دقيقة تضبط مسافات الغرز والتعويض الفيزيائي لانكماش الأقمشة، دون الحاجة للبرامج اليدوية المعقدة.
              </p>
            </div>

            {/* Core Values / Architectural Principles */}
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Native Tajima DST Standard</h4>
                  <p className="text-xs text-slate-400">Compatible with commercial Tajima machines, Barudan, Brother PR series, Ricoma, and SWF.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Fabric Pull Compensation</h4>
                  <p className="text-xs text-slate-400">Algorithmic underlay and edge push compensation calculated according to target garment stretch.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Preserving Your Custom Backend</h4>
                  <p className="text-xs text-slate-400">Built to seamlessly interface with Python stitch_engine.py and private Supabase storage.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
