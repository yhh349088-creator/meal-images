/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Upload, Eye, Sliders, Cpu, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload your design',
      arabicTitle: 'ارفع تصميمك',
      description: 'Upload high-resolution PNG, JPG, JPEG, or WEBP logos. Transparent backgrounds deliver clean vector edges.',
      icon: Upload,
    },
    {
      step: '02',
      title: 'Analyze your image',
      arabicTitle: 'معاينة وتحليل الصورة',
      description: 'Visual preview verifies dimensions, color separation boundaries, and fine graphic details before digitizing.',
      icon: Eye,
    },
    {
      step: '03',
      title: 'Configure embroidery settings',
      arabicTitle: 'ضبط إعدادات التطريز',
      description: 'Define target millimeter width, fabric profile (twill, pique, fleece), stitch density (0.35–0.45mm), and pull compensation.',
      icon: Sliders,
    },
    {
      step: '04',
      title: 'Generate DST file',
      arabicTitle: 'معالجة وتوليد كود التطريز',
      description: 'The digitizing engine calculates needle penetrations, jump stitches, trims, and generates the standard Tajima binary file.',
      icon: Cpu,
    },
    {
      step: '05',
      title: 'Download your result',
      arabicTitle: 'تحميل ملف DST الجاهز',
      description: 'Transfer the exported .DST file directly to your commercial embroidery machine via USB or machine network controller.',
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#080a0f] border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-wider text-amber-400 mb-2">
            STEP-BY-STEP WORKFLOW
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            How YAZOO DST AI Converts Visuals to Stitches
          </h2>
          <p className="mt-4 text-base text-slate-400">
            A linear, engineered digitizing sequence tailored for digital apparel production.
          </p>
        </div>

        {/* 5 Steps Linear Chain */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="relative rounded-xl border border-slate-800/80 bg-[#0d1017] p-5 flex flex-col justify-between transition-all duration-300 hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-amber-400">
                      STEP {st.step}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5" dir="rtl">
                    {st.arabicTitle}
                  </p>

                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Stage {idx + 1} of 5</span>
                  <span className="font-mono">DST 2026</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
