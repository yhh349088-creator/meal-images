/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileCode2, 
  ScanSearch, 
  Activity, 
  Settings2, 
  ShieldCheck, 
  Sparkles,
  Clock
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      id: 'image-to-dst',
      number: '01',
      title: 'Image to DST',
      arabicTitle: 'تحويل الصور إلى DST',
      description: 'Convert raster graphics and transparent logos into binary Tajima DST format with sequential needle coordinates and jump stitch commands.',
      icon: FileCode2,
      isFuture: false,
      tag: 'Core Engine',
    },
    {
      id: 'design-analysis',
      number: '02',
      title: 'Design Analysis',
      arabicTitle: 'تحليل التصميم والألوان',
      description: 'Inspect color layers, shape boundaries, and segment density before punching to ensure clean thread trims and crisp embroidery outlines.',
      icon: ScanSearch,
      isFuture: false,
      tag: 'Vectorization',
    },
    {
      id: 'stitch-info',
      number: '03',
      title: 'Stitch Information',
      arabicTitle: 'معلومات الغرز والتطريز',
      description: 'Detailed stitch metrics including total penetrations, estimated bobbin and top thread consumption, color stops, and bounding box dimensions.',
      icon: Activity,
      isFuture: false,
      tag: 'Technical Telemetry',
    },
    {
      id: 'embroidery-settings',
      number: '04',
      title: 'Embroidery Settings',
      arabicTitle: 'إعدادات التطريز المتقدمة',
      description: 'Full control over physical embroidery parameters: exact millimeter width, target fabric profiles (twill, pique, fleece), and pull compensation.',
      icon: Settings2,
      isFuture: false,
      tag: 'Machine Calibration',
    },
    {
      id: 'secure-storage',
      number: '05',
      title: 'Secure File Storage',
      arabicTitle: 'تخزين سحابي آمن',
      description: 'Architecture ready for encrypted storage of your source art and generated DST production files, strictly governed by user access policies.',
      icon: ShieldCheck,
      isFuture: false,
      tag: 'Cloud Ready',
    },
    {
      id: 'ai-assistance',
      number: '06',
      title: 'AI Assistance',
      arabicTitle: 'المساعد الذكي (قيد التجهيز)',
      description: 'Future Gemini neural module in development for automatic stitch type recommendations (Satin vs Tatami), fabric tension suggestions, and defect alerts.',
      icon: Sparkles,
      isFuture: true,
      tag: 'Upcoming Roadmap',
    },
  ];

  return (
    <section id="features" className="relative py-20 lg:py-28 border-t border-slate-800/80 bg-[#090c12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-wider text-amber-400 mb-2">
            ENGINE CAPABILITIES
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Industrial-Grade Digital Digitizing Architecture
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Built to bridge visual designs with physical multi-needle machines. Everything you need to prepare clean, snag-free embroidery files.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative rounded-xl border border-slate-800/90 bg-[#0e121a] p-6 transition-all duration-300 hover:border-slate-700 hover:bg-[#121722]"
              >
                {/* Top Row: Icon + Human Editorial Number + Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-amber-400 transition-colors group-hover:border-amber-500/30 group-hover:bg-amber-500/10">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>{feat.number}</span>
                    <span aria-hidden="true">·</span>
                    <span className={feat.isFuture ? 'text-amber-400/90' : 'text-slate-400'}>
                      {feat.tag}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{feat.title}</span>
                  {feat.isFuture && (
                    <span className="flex items-center gap-1 text-[11px] font-normal text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Clock className="h-3 w-3" />
                      <span>Roadmap</span>
                    </span>
                  )}
                </h3>

                {/* Arabic Subtitle */}
                <p className="text-xs font-medium text-slate-400 mt-1" dir="rtl">
                  {feat.arabicTitle}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>

                {/* Honest indicator for AI module */}
                {feat.isFuture && (
                  <div className="mt-4 pt-3 border-t border-slate-800/70 text-xs text-slate-400">
                    ميزة مستقبلية قيد الإعداد البرمجي — لا تدّعي المنصة تشغيلها حالياً حتى يتم ربط Gemini رسمياً.
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
