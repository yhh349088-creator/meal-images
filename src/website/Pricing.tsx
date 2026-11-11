/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Info } from 'lucide-react';

export const Pricing: React.FC<{ onSelectPlan?: (plan: string) => void }> = ({ onSelectPlan }) => {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      badge: 'Evaluation',
      description: 'Ideal for testing logos and single-file digitizing for personal embroidery machines.',
      priceDisplay: 'Free Tier',
      subtext: 'No credit card required',
      features: [
        'Standard Tajima DST export',
        'Max 100mm hoop dimension',
        'Standard stitch density (0.40mm)',
        'Supported formats: PNG, JPG, WEBP',
        'Visual preview and dimension inspector',
      ],
      popular: false,
      ctaLabel: 'Start with Free Tier',
    },
    {
      id: 'pro',
      name: 'Professional',
      badge: 'Production Ready',
      description: 'For apparel decorators, custom embroidery shops, and commercial digitizers.',
      priceDisplay: 'Pro Membership',
      subtext: 'Billed monthly upon launch',
      features: [
        'Everything in Starter',
        'Large hoop dimensions up to 300mm',
        'Fine density calibration (0.30mm - 0.50mm)',
        'Adjustable pull compensation (0.1 - 0.4mm)',
        'Fabric tension presets (twill, pique, fleece, caps)',
        'Jump stitch and trim optimization',
      ],
      popular: true,
      ctaLabel: 'Register Interest',
    },
    {
      id: 'studio',
      name: 'Studio Enterprise',
      badge: 'High Volume',
      description: 'For garment factories, uniform suppliers, and multi-head production lines.',
      priceDisplay: 'Studio Tier',
      subtext: 'Custom scale & API access',
      features: [
        'Everything in Professional',
        'Direct Fast-API conversion access',
        'Multi-head industrial machine presets',
        'Encrypted Supabase storage integration',
        'Dedicated digitizing support',
      ],
      popular: false,
      ctaLabel: 'Contact for Enterprise',
    },
  ];

  const handlePlanClick = (planName: string) => {
    setSelectedNotice(`تم تسجيل اهتمامك بباقة ${planName}. سيتم تفعيل خطط الاشتراك وربط بوابات الدفع في مرحلة لاحقة دون خصم أي مبالغ الآن.`);
    if (onSelectPlan) onSelectPlan(planName);
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#080a0f] border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold tracking-wider text-amber-400 mb-2">
            MEMBERSHIP & ACCESS
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Transparent Digitizing Tiers
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Designed for individual embroiderers, commercial apparel brands, and industrial garment decorators.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-amber-300/80 bg-amber-950/30 border border-amber-800/40 px-3.5 py-1 rounded-full">
            <Info className="h-3.5 w-3.5" />
            <span>بوابات الدفع قيد التحضير للمرحلة التالية — لا يتم تحصيل أي مبالغ حالياً.</span>
          </div>
        </div>

        {/* Notice alert */}
        {selectedNotice && (
          <div className="mt-6 max-w-xl mx-auto rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 text-center">
            {selectedNotice}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-2xl flex flex-col justify-between p-7 transition-all ${
                p.popular
                  ? 'border-2 border-amber-500/80 bg-[#0e131d] shadow-xl shadow-amber-950/20'
                  : 'border border-slate-800 bg-[#0d1017] hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded">
                    {p.badge}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {p.description}
                </p>

                {/* Price block */}
                <div className="mt-6 border-y border-slate-800/80 py-4">
                  <div className="text-2xl font-bold text-white tracking-tight">
                    {p.priceDisplay}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {p.subtext}
                  </div>
                </div>

                {/* Features List */}
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => handlePlanClick(p.name)}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    p.popular
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                      : 'border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {p.ctaLabel}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
