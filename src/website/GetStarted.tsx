/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Sliders, 
  Cpu, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Maximize2, 
  Lock, 
  Unlock,
  FileCheck,
  Info
} from 'lucide-react';
import type { EmbroiderySettings, ConversionJobResult, FabricType, StitchType } from '../services/types';
import { backendApi } from '../services/api';

interface GetStartedProps {
  onBackToHome: () => void;
}

export const GetStarted: React.FC<GetStartedProps> = ({ onBackToHome }) => {
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Embroidery Settings
  const [settings, setSettings] = useState<EmbroiderySettings>({
    widthMm: 100,
    heightMm: 100,
    maintainAspectRatio: true,
    density: 'standard',
    stitchDensityValue: 0.40,
    fabric: 'cotton_jersey',
    pullCompensationMm: 0.20,
    maxStitchLengthMm: 7.0,
    minStitchLengthMm: 0.3,
    primaryStitchFocus: 'auto_detect',
    autoTrimJumps: true,
  });

  // Conversion Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionJobResult | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Clean preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle image selection
  const handleFileChange = (file: File) => {
    // Check format
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('الصيغ المدعومة هي PNG و JPG و JPEG و WEBP فقط.');
      return;
    }
    setUploadError(null);

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setConversionResult(null);

    // Read natural dimensions
    const img = new Image();
    img.onload = () => {
      setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      // recalculate proportional height based on 100mm default width
      if (img.naturalWidth > 0) {
        const ratio = img.naturalHeight / img.naturalWidth;
        setSettings(prev => ({
          ...prev,
          heightMm: Math.round(prev.widthMm * ratio),
        }));
      }
    };
    img.src = objectUrl;
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Quick load sample artwork for immediate testing
  const handleLoadSample = async () => {
    try {
      const response = await fetch('/src/assets/images/embroidery_sample_patch_1794403375063.jpg');
      const blob = await response.blob();
      const sampleFile = new File([blob], 'sample_crest_patch.jpg', { type: 'image/jpeg' });
      handleFileChange(sampleFile);
    } catch (err) {
      console.warn('Could not load local sample file', err);
    }
  };

  // Width change handler with aspect ratio preservation
  const handleWidthChange = (val: number) => {
    const clampedWidth = Math.max(20, Math.min(300, val));
    if (settings.maintainAspectRatio && imgDimensions && imgDimensions.width > 0) {
      const ratio = imgDimensions.height / imgDimensions.width;
      setSettings(prev => ({
        ...prev,
        widthMm: clampedWidth,
        heightMm: Math.round(clampedWidth * ratio),
      }));
    } else {
      setSettings(prev => ({ ...prev, widthMm: clampedWidth }));
    }
  };

  // Density selector
  const handleDensityChange = (density: 'light' | 'standard' | 'dense') => {
    const map = {
      light: 0.45,
      standard: 0.40,
      dense: 0.35,
    };
    setSettings(prev => ({
      ...prev,
      density,
      stitchDensityValue: map[density],
    }));
  };

  // Fabric preset change
  const handleFabricChange = (fabric: FabricType) => {
    // Pull comp recommendations based on fabric stretch
    const pullMap: Record<FabricType, number> = {
      cotton_jersey: 0.25,
      pique_polo: 0.30,
      twill_cap: 0.15,
      fleece_hoodie: 0.35,
      canvas_tote: 0.10,
      leather_heavy: 0.10,
    };
    setSettings(prev => ({
      ...prev,
      fabric,
      pullCompensationMm: pullMap[fabric] ?? 0.20,
    }));
  };

  // Handle conversion trigger (Strictly Truthful: checks real backend engine)
  const handleStartConversion = async () => {
    if (!selectedFile) {
      setUploadError('يرجى اختيار أو رفع صورة أولاً قبل بدء التحويل.');
      return;
    }
    setUploadError(null);

    setIsProcessing(true);
    setConversionResult(null);

    try {
      // Dispatches to backend API service
      const result = await backendApi.convertImageToDst(selectedFile, settings);
      setConversionResult(result);
    } catch (err) {
      setConversionResult({
        status: 'failed',
        isBackendConnected: false,
        statusMessage: 'حدث خطأ غير متوقع أثناء معالجة الطلب.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pb-20">
      
      {/* Top Studio Bar */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-[#090c12]/95 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-md hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white">YAZOO DST AI Studio</span>
              <span className="hidden sm:inline text-slate-500">· Tajima Digitizing Calibration</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded border border-amber-500/30 hover:border-amber-500/60 transition-colors"
            >
              Load Sample Design
            </button>
          </div>

        </div>
      </div>

      {/* Main Studio Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Welcome Section */}
        <div className="rounded-2xl border border-slate-800/90 bg-[#0b0e16] p-6 sm:p-8 mb-8">
          <div className="max-w-3xl">
            <div className="text-xs font-mono font-medium text-amber-400 mb-1">
              DIGITIZING WORKSPACE 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to YAZOO DST AI
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Convert your graphic designs into machine-ready Tajima DST embroidery files. Upload your artwork, inspect dimensions and stitch boundaries, configure physical garment settings, and export verified needle instructions.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">Supported Formats:</span>
              <span className="font-mono text-amber-300">PNG</span>
              <span>·</span>
              <span className="font-mono text-amber-300">JPG</span>
              <span>·</span>
              <span className="font-mono text-amber-300">JPEG</span>
              <span>·</span>
              <span className="font-mono text-amber-300">WEBP</span>
              <span className="text-slate-500 hidden sm:inline">(Max recommended 25MB, transparent backgrounds preferred)</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Visual Workspace (Left) & Machine Settings (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload Dropzone & Interactive Preview */}
          <div className="lg:col-span-7 space-y-6">
            
            {uploadError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-3 text-xs text-rose-300 flex items-center justify-between">
                <span>{uploadError}</span>
                <button 
                  onClick={() => setUploadError(null)}
                  className="text-rose-400 hover:text-white text-xs px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Upload Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-slate-800 bg-[#0c1017] hover:border-slate-700 hover:bg-[#0f141e]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-amber-400 mb-4 shadow-inner">
                <Upload className="h-6 w-6" />
              </div>

              <h3 className="text-sm font-semibold text-white">
                {selectedFile ? 'Change Uploaded Artwork' : 'Upload Design'}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Drag and drop your file here, or click to browse
              </p>
              <p className="mt-2 text-[11px] text-slate-500 font-mono">
                PNG · JPG · JPEG · WEBP (Up to 25MB)
              </p>
            </div>

            {/* Preview Inspector */}
            {previewUrl && (
              <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-5 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <ImageIcon className="h-4 w-4 text-amber-400" />
                    <span>Design Preview & Stitch Calibration Grid</span>
                  </div>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200"
                  >
                    <Layers className="h-3 w-3" />
                    <span>Grid: {showGrid ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                {/* Viewport frame with subtle embroidery coordinate grid */}
                <div className="relative aspect-square w-full max-h-[460px] overflow-hidden rounded-xl bg-[#05070a] border border-slate-900 flex items-center justify-center p-4">
                  
                  {/* Grid Lines */}
                  {showGrid && (
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                      }}
                    />
                  )}

                  {/* Centering crosshairs */}
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-[1px] bg-amber-500/20" />
                      <div className="h-full w-[1px] bg-amber-500/20 absolute" />
                    </div>
                  )}

                  {/* Artwork Image */}
                  <img
                    src={previewUrl}
                    alt="Uploaded design for embroidery conversion"
                    className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-md"
                  />

                  {/* Physical millimeter overlay badge */}
                  <div className="absolute bottom-3 right-3 z-20 rounded bg-slate-950/80 border border-slate-800 px-2.5 py-1 text-[11px] font-mono text-amber-300 tabular-nums">
                    Physical: {settings.widthMm}mm × {settings.heightMm}mm
                  </div>
                </div>

                {/* Metadata strip */}
                {selectedFile && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono border-t border-slate-800/80 pt-3 text-slate-400">
                    <div>
                      <span className="text-slate-500 block">File:</span>
                      <span className="text-slate-200 truncate block">{selectedFile.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Resolution:</span>
                      <span className="text-slate-200 tabular-nums">
                        {imgDimensions ? `${imgDimensions.width}×${imgDimensions.height}px` : 'Calculating...'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">File Size:</span>
                      <span className="text-slate-200 tabular-nums">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tajima Axis:</span>
                      <span className="text-emerald-400">Centered (0,0)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Embroidery Calibration Settings & Conversion Trigger */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-2xl border border-slate-800 bg-[#0c1017] p-6 shadow-xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Embroidery Calibration</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">DST SPEC 2026</span>
              </div>

              {/* Millimeter Dimensions */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="text-slate-300 font-medium">Target Width (mm)</label>
                    <span className="font-mono text-amber-400 tabular-nums font-semibold">
                      {settings.widthMm} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={280}
                    step={1}
                    value={settings.widthMm}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>30 mm (Small Pocket)</span>
                    <span>100 mm (Chest)</span>
                    <span>280 mm (Jacket Back)</span>
                  </div>
                </div>

                {/* Target Height & Aspect Ratio Lock */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      Calculated Height
                    </label>
                    <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-mono text-slate-200">
                      <span>{settings.heightMm} mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      Aspect Ratio
                    </label>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, maintainAspectRatio: !prev.maintainAspectRatio }))}
                      className="flex items-center justify-between w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-slate-300 hover:text-white"
                    >
                      <span>{settings.maintainAspectRatio ? 'Locked' : 'Unlocked'}</span>
                      {settings.maintainAspectRatio ? <Lock className="h-3.5 w-3.5 text-amber-400" /> : <Unlock className="h-3.5 w-3.5 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {/* Stitch Density Presets */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-300 font-medium">Stitch Density</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {settings.stitchDensityValue} mm pitch
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['light', 'standard', 'dense'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDensityChange(d)}
                        className={`rounded-lg py-2 px-3 text-xs font-medium capitalize transition-all ${
                          settings.density === d
                            ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                            : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Type Preset */}
                <div className="pt-2">
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    Garment Fabric Preset
                  </label>
                  <select
                    value={settings.fabric}
                    onChange={(e) => handleFabricChange(e.target.value as FabricType)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="cotton_jersey">Cotton Jersey (T-Shirts / Soft Knits)</option>
                    <option value="pique_polo">Pique Polo (Textured Poly/Cotton)</option>
                    <option value="twill_cap">Twill Cap (Structured Baseball Caps)</option>
                    <option value="fleece_hoodie">Fleece / Terry (Heavy Sweatshirts)</option>
                    <option value="canvas_tote">Canvas / Duck (Tote Bags & Aprons)</option>
                    <option value="leather_heavy">Leather / Dense Substrates</option>
                  </select>
                </div>

                {/* Pull Compensation */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Pull Compensation</span>
                    <span className="font-mono text-amber-400 tabular-nums">
                      +{settings.pullCompensationMm.toFixed(2)} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.10}
                    max={0.40}
                    step={0.05}
                    value={settings.pullCompensationMm}
                    onChange={(e) => setSettings(prev => ({ ...prev, pullCompensationMm: Number(e.target.value) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Compensates for fabric shrinkage under high needle penetration tension.
                  </span>
                </div>

                {/* Primary Stitch Focus */}
                <div className="pt-2">
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    Stitch Generation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(
                      [
                        { id: 'auto_detect', label: 'Auto (Satin & Tatami)' },
                        { id: 'satin', label: 'Satin Priority (Borders)' },
                        { id: 'tatami_fill', label: 'Tatami Fill Priority' },
                        { id: 'running', label: 'Outline / Running' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, primaryStitchFocus: m.id as StitchType }))}
                        className={`rounded-lg p-2 text-left transition-colors ${
                          settings.primaryStitchFocus === m.id
                            ? 'border border-amber-500/80 bg-amber-500/10 text-white font-medium'
                            : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Conversion Action Button */}
              <div className="mt-8 pt-5 border-t border-slate-800">
                <button
                  type="button"
                  disabled={!selectedFile || isProcessing}
                  onClick={handleStartConversion}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-semibold transition-all ${
                    !selectedFile || isProcessing
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md active:scale-98'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Checking Engine & Processing...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="h-4 w-4" />
                      <span>Start Conversion</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Conversion Result & Truthful Status Area */}
            {conversionResult && (
              <div className={`rounded-2xl border p-5 transition-all ${
                conversionResult.status === 'completed'
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-amber-500/40 bg-amber-950/20'
              }`}>
                
                <div className="flex items-start gap-3">
                  {conversionResult.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">
                      {conversionResult.status === 'completed'
                        ? 'Conversion Successful'
                        : 'Engine Connection Status (حالة الربط)'}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {conversionResult.statusMessage}
                    </p>

                    {/* Specific truthful notes */}
                    {conversionResult.warnings && (
                      <div className="mt-2 space-y-1">
                        {conversionResult.warnings.map((w, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-amber-200/90 font-mono">
                            <span>·</span>
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stitch Telemetry from Real Backend */}
                    {conversionResult.totalStitches !== undefined && (
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Stitches</span>
                          <span className="text-emerald-400 font-bold tabular-nums">{conversionResult.totalStitches.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Color Stops</span>
                          <span className="text-white font-bold tabular-nums">{conversionResult.colorChanges ?? 1}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Thread Est.</span>
                          <span className="text-amber-400 font-bold tabular-nums">
                            {conversionResult.estimatedThreadLengthMeters ? `${conversionResult.estimatedThreadLengthMeters}m` : '0.1mm Tajima'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Technical payload summary ready for FastAPI */}
                    <div className="mt-3 p-3 rounded-lg border border-slate-800 bg-slate-950/80 text-[11px] font-mono text-slate-300">
                      <div className="text-slate-400 mb-1 font-sans text-xs">
                        Configured Payload for stitch_engine.py:
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span>Format: Tajima DST</span>
                        <span>Dimensions: {settings.widthMm}×{settings.heightMm}mm</span>
                        <span>Pitch: {settings.stitchDensityValue}mm</span>
                        <span>Pull Comp: +{settings.pullCompensationMm}mm</span>
                        <span>Fabric: {settings.fabric}</span>
                        <span>Stitch Mode: {settings.primaryStitchFocus}</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      {conversionResult.dstFileUrl ? (
                        <a
                          href={conversionResult.dstFileUrl}
                          download={conversionResult.fileName || 'design.dst'}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download DST</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <button
                            disabled
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-500 cursor-not-allowed"
                            title="Download is enabled when a verified Tajima DST is compiled by the live stitch_engine"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download DST</span>
                          </button>
                          <span className="text-[11px] text-slate-400">
                            (التحميل الفعلي متاح فور ربط السيرفر)
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
