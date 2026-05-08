/**
 * Resume + AI analysis DTOs.
 *
 * Endpoints:
 *   POST   /api/resumes/upload                          (multipart "file")
 *   GET    /api/resumes
 *   DELETE /api/resumes/{id}
 *   POST   /api/resumes/{resumeId}/analyze/{jobId}
 *
 * The README documents the AI engine as a keyword-matching system with
 * stopword filtering, skill alias mapping, and contextual suggestions.
 */

export interface Resume {
  id: number | string;
  fileName: string;
  originalFileName?: string;
  fileSize?: number;
  contentType?: string;
  uploadedAt: string;
}

/** Result returned by POST /api/resumes/{resumeId}/analyze/{jobId}. */
export interface ResumeAnalysis {
  /** 0–100 — % match between resume and job description. */
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  /** Contextual improvement suggestions, one per bullet. */
  suggestions: string[];
  /** Optional: skills the engine extracted from the resume. */
  extractedSkills?: string[];
  /** Optional: identifiers echoed back. */
  resumeId?: number | string;
  jobId?: number | string;
  analyzedAt?: string;
}
