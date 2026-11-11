/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Shield, FileText, Mail } from 'lucide-react';

interface TermsModalProps {
  type: 'terms' | 'privacy' | 'contact' | 'about' | null;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0c1017] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {type === 'terms' && (
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <FileText className="h-5 w-5" />
              <h2 className="text-xl font-bold text-white">Terms of Service</h2>
            </div>
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                Welcome to YAZOO DST AI. By accessing this platform and our digitizing services, you agree to comply with and be bound by the following terms and conditions.
              </p>
              <h3 className="font-semibold text-white text-sm">1. Digitizing & Machine Compatibility</h3>
              <p>
                YAZOO DST AI generates Tajima format (.DST) binary stitch files. While DST is the global standard across commercial multi-needle embroidery machines (Tajima, Barudan, Brother PR, Ricoma, Melco), users must always test stitch files on sample scrap fabric with equivalent stabilizer backing prior to volume production runs.
              </p>
              <h3 className="font-semibold text-white text-sm">2. Artwork Intellectual Property</h3>
              <p>
                You retain all rights and ownership to original graphic files uploaded to the platform. You represent that you possess the necessary licenses, trademarks, or copyrights for designs uploaded for embroidery conversion.
              </p>
              <h3 className="font-semibold text-white text-sm">3. Service Boundaries</h3>
              <p>
                YAZOO DST AI provides automated coordinate vectorization and stitch generation. Physical outcomes depend on machine tension, needle sharpness, thread weight (standard 40wt), and backing stabilizer.
              </p>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Shield className="h-5 w-5" />
              <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
            </div>
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                Your privacy and design confidentiality are central to our mission at YAZOO DST AI.
              </p>
              <h3 className="font-semibold text-white text-sm">1. Data Collection</h3>
              <p>
                We only store artwork files, generated embroidery stitch coordinates, and account credentials required to fulfill digitizing requests.
              </p>
              <h3 className="font-semibold text-white text-sm">2. Secure Storage & RLS</h3>
              <p>
                User accounts and file storage are protected by enterprise PostgreSQL Row-Level Security (RLS) via our Supabase infrastructure. Designs are accessible only by the authentic account owner.
              </p>
              <h3 className="font-semibold text-white text-sm">3. Zero Third-Party Selling</h3>
              <p>
                We do not sell, license, or publish your proprietary artwork, customer logos, or vector files to any external entity.
              </p>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <Mail className="h-5 w-5" />
              <h2 className="text-xl font-bold text-white">Contact & Support</h2>
            </div>
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                Have questions regarding machine calibration, hoop dimensions, or custom enterprise digitizing integration? Reach out to our technical engineering team:
              </p>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 font-mono">
                <div>
                  <span className="text-slate-400">Email:</span>{' '}
                  <span className="text-amber-400">support@yazoodst.ai</span>
                </div>
                <div>
                  <span className="text-slate-400">Platform:</span>{' '}
                  <span className="text-white">YAZOO DST AI — Automated Tajima Digitizing</span>
                </div>
                <div>
                  <span className="text-slate-400">Engine:</span>{' '}
                  <span className="text-emerald-400">stitch_engine.py / Tajima 0.1mm standard</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'about' && (
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <h2 className="text-xl font-bold text-white">About YAZOO DST AI</h2>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                YAZOO DST AI was established to deliver effortless, high-precision digitizing for custom apparel decorators, embroidery workshops, and high-volume uniform manufacturers.
              </p>
              <p>
                By translating pixel graphics into mathematically sound stitch sequences, underlays, and pull-compensated borders, we cut down punch times and eliminate thread breaks on the production floor.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
