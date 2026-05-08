import { api } from './api';
import type { Resume, ResumeAnalysis } from '@/types';

/**
 * Resume + AI analysis service.
 *
 * Endpoints:
 *   POST   /api/resumes/upload                          (multipart "file")
 *   GET    /api/resumes
 *   DELETE /api/resumes/{id}
 *   POST   /api/resumes/{resumeId}/analyze/{jobId}
 */
export const resumeService = {
  async list(): Promise<Resume[]> {
    const { data } = await api.get<Resume[]>('/resumes');
    return Array.isArray(data) ? data : [];
  },

  async upload(
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<Resume> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<Resume>('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (!onProgress) return;
        if (!e.total) {
          onProgress(50);
          return;
        }
        onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });
    return data;
  },

  async remove(id: number | string): Promise<void> {
    await api.delete(`/resumes/${id}`);
  },

  async analyze(resumeId: number | string, jobId: number | string): Promise<ResumeAnalysis> {
    const { data } = await api.post<ResumeAnalysis>(`/resumes/${resumeId}/analyze/${jobId}`);
    // Defensive defaults
    return {
      matchScore: Math.max(0, Math.min(100, Number(data?.matchScore ?? 0))),
      matchedKeywords: Array.isArray(data?.matchedKeywords) ? data.matchedKeywords : [],
      missingKeywords: Array.isArray(data?.missingKeywords) ? data.missingKeywords : [],
      suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
      extractedSkills: Array.isArray(data?.extractedSkills) ? data.extractedSkills : [],
      resumeId: data?.resumeId,
      jobId: data?.jobId,
      analyzedAt: data?.analyzedAt,
    };
  },
};
