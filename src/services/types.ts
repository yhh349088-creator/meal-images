/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StitchType = 'satin' | 'tatami_fill' | 'running' | 'auto_detect';

export type FabricType = 
  | 'cotton_jersey'
  | 'pique_polo'
  | 'twill_cap'
  | 'fleece_hoodie'
  | 'canvas_tote'
  | 'leather_heavy';

export interface EmbroiderySettings {
  widthMm: number;
  heightMm: number;
  maintainAspectRatio: boolean;
  density: 'light' | 'standard' | 'dense'; // e.g. 0.45mm, 0.40mm, 0.35mm
  stitchDensityValue: number; // in mm (default 0.40)
  fabric: FabricType;
  pullCompensationMm: number; // 0.1 - 0.4 mm
  maxStitchLengthMm: number; // e.g. 7.0 mm (standard Tajima constraint)
  minStitchLengthMm: number; // e.g. 0.3 mm
  primaryStitchFocus: StitchType;
  autoTrimJumps: boolean;
}

export type ConversionStatus = 
  | 'idle'
  | 'file_selected'
  | 'uploading'
  | 'engine_unlinked'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ConversionJobResult {
  jobId?: string;
  status: ConversionStatus;
  statusMessage: string;
  isBackendConnected: boolean;
  dstFileUrl?: string | null;
  fileName?: string;
  totalStitches?: number;
  colorChanges?: number;
  estimatedThreadLengthMeters?: number;
  warnings?: string[];
}

export interface UserSubscription {
  tier: 'free' | 'pro' | 'studio';
  creditsRemaining: number;
  renewsAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  subscription?: UserSubscription;
}

export interface GeminiAnalysisProposal {
  complexityScore?: number;
  detectedColors?: string[];
  suggestedFabric?: FabricType;
  suggestedWidthMm?: number;
  suggestedStitchType?: StitchType;
  potentialIssues?: string[];
  notes?: string;
}
