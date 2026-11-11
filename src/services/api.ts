/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ConversionJobResult, EmbroiderySettings } from './types';

/**
 * Backend API Client for YAZOO-DST-AI Backend (Render / FastAPI)
 * 
 * Target Endpoint: POST /convert/image
 * Environment Variable: VITE_API_BASE_URL
 * (No localhost hardcoded; configurable for production Render deployment)
 */

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // Default to relative in production if hosted on same domain or reverse proxy
  return '';
};

export const backendApi = {
  /**
   * Retrieves the currently configured backend endpoint
   */
  getBaseUrl(): string {
    return getApiBaseUrl();
  },

  /**
   * Health probe to verify connection with the YAZOO-DST-AI backend
   */
  async checkEngineHealth(): Promise<{ online: boolean; message: string; url: string }> {
    const baseUrl = getApiBaseUrl();
    const targetUrl = baseUrl ? `${baseUrl}/health` : '/health';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(targetUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        return { 
          online: true, 
          message: 'YAZOO-DST-AI Backend connected.', 
          url: baseUrl || window.location.origin 
        };
      }
      return { 
        online: false, 
        message: `سيرفر YAZOO-DST-AI استجاب برمز ${response.status}`, 
        url: baseUrl || 'Render Backend' 
      };
    } catch {
      return {
        online: false,
        message: baseUrl
          ? `جاري الاتصال بسيرفر الخلفية (${baseUrl}) أو السيرفر قيد التشغيل على Render.`
          : 'سيرفر YAZOO-DST-AI الخلفي قيد التجهيز على Render. قم بضبط VITE_API_BASE_URL في بيئة النشر.',
        url: baseUrl || 'Not Configured',
      };
    }
  },

  /**
   * Dispatches the image file and embroidery settings to POST /convert/image
   */
  async convertImageToDst(
    file: File,
    settings: EmbroiderySettings
  ): Promise<ConversionJobResult> {
    const baseUrl = getApiBaseUrl();
    const endpoint = baseUrl ? `${baseUrl}/convert/image` : '/convert/image';

    const formData = new FormData();
    // Supply both 'file' and 'image' keys for full backend compatibility
    formData.append('image', file);
    formData.append('file', file);
    formData.append('width_mm', String(settings.widthMm));
    formData.append('height_mm', String(settings.heightMm));
    formData.append('stitch_density', String(settings.stitchDensityValue));
    formData.append('fabric', settings.fabric);
    formData.append('pull_comp_mm', String(settings.pullCompensationMm));
    formData.append('primary_stitch', settings.primaryStitchFocus);
    formData.append('auto_trim', String(settings.autoTrimJumps));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for heavy stitch generation

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errDetail = `Status: ${response.status} ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson.detail) errDetail = errJson.detail;
          else if (errJson.message) errDetail = errJson.message;
        } catch {
          // ignore non-json error body
        }
        throw new Error(errDetail);
      }

      // Check whether response is a binary DST file or JSON metadata
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();

        // If backend returned base64 DST content directly
        let fileUrl = data.dst_download_url || data.dst_url || data.file_url || null;
        if (data.dst_base64) {
          const binaryStr = atob(data.dst_base64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/octet-stream' });
          fileUrl = URL.createObjectURL(blob);
        }

        return {
          jobId: data.job_id || String(Date.now()),
          status: 'completed',
          isBackendConnected: true,
          dstFileUrl: fileUrl,
          fileName: data.file_name || `${file.name.replace(/\.[^/.]+$/, '')}.dst`,
          totalStitches: data.total_stitches || data.stitch_count,
          colorChanges: data.color_changes,
          estimatedThreadLengthMeters: data.thread_length_meters,
          statusMessage: 'تم تحويل الملف بنجاح وتوليد مسارات تطريز Tajima DST الحقيقية.',
        };
      }

      // Backend returned raw binary DST file stream
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const dstFileName = `${file.name.replace(/\.[^/.]+$/, '')}.dst`;

      return {
        jobId: `dst_${Date.now()}`,
        status: 'completed',
        isBackendConnected: true,
        dstFileUrl: objectUrl,
        fileName: dstFileName,
        statusMessage: 'تم استلام وتوليد ملف Tajima DST من السيرفر بنجاح وهو جاهز للتحميل.',
      };

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      
      return {
        status: 'engine_unlinked',
        isBackendConnected: false,
        statusMessage: baseUrl 
          ? `تعذر الاتصال بـ YAZOO-DST-AI Backend على الرابط (${baseUrl}). تأكد من تشغيل خدمة Render وضبط CORS.`
          : 'سيرفر التحويل YAZOO-DST-AI Backend قيد التجهيز على Render. قم بضبط متغير VITE_API_BASE_URL في لوحة التحكم.',
        warnings: [
          `الوجهة المستهدفة: POST ${endpoint}`,
          `تفاصيل الخطأ: ${errorMsg}`,
          'لم يتم إنشاء ملف وهمي حفاظاً على الدقة الهندسية لماكينات التطريز.',
        ],
      };
    }
  },
};
