/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GeminiAnalysisProposal } from './types';

/**
 * Gemini AI Integration Architecture (Prepared for Server-Side Proxy)
 * 
 * SECURITY MANDATE:
 * - Gemini API Keys are NEVER exposed in client-side code.
 * - All AI inference calls must pass through a secure backend proxy (`/api/ai/*`).
 * - In accordance with system instructions, no fake analysis data is simulated;
 *   features are marked truthfully as awaiting backend connection.
 */

export interface DesignAnalysisRequest {
  imageFile: File;
  targetFabric?: string;
  notes?: string;
}

export interface DesignProblemDiagnosis {
  hasSmallText: boolean;
  hasSubtleGradients: boolean;
  stitchFeasibilityRating: 'optimal' | 'moderate' | 'challenging';
  recommendations: string[];
}

export const geminiService = {
  /**
   * Status indicator: reports whether the server-side Gemini endpoint is active.
   */
  isAiModuleActive(): boolean {
    return false; // Truthful status: awaiting phase-2 API binding
  },

  /**
   * Analyze artwork for embroidery stitch feasibility:
   * Identifies color boundaries, gradient difficulties, and tiny text issues.
   * Ready to call `/api/ai/analyze-design`.
   */
  async analyzeArtwork(request: DesignAnalysisRequest): Promise<GeminiAnalysisProposal | null> {
    if (!this.isAiModuleActive()) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', request.imageFile);
    if (request.targetFabric) formData.append('fabric', request.targetFabric);

    const response = await fetch('/api/ai/analyze-design', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`AI Analysis server error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Recommend stitch types (Running, Satin, Tatami/Fill) and density based on design
   */
  async recommendStitchSettings(file: File): Promise<GeminiAnalysisProposal | null> {
    if (!this.isAiModuleActive()) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/ai/recommend-settings', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) return null;
    return response.json();
  },

  /**
   * Diagnose potential embroidery errors before sending to stitch_engine
   */
  async diagnosePreConversionErrors(file: File): Promise<DesignProblemDiagnosis | null> {
    if (!this.isAiModuleActive()) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/ai/diagnose-errors', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) return null;
    return response.json();
  },
};
