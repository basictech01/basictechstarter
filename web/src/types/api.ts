/**
 * Stable numeric error codes the frontend branches on (guideline 04 §3, R6). Only the codes
 * actually handled in the UI are listed here — the full registry lives on the backend
 * (`backend/src/utils/errors.ts`).
 */
export const ERROR_CODES = {
  AREA_NOT_FOUND: 40001,
  AREA_TYPE_NOT_SUPPORTED: 40003,
  COMPARISON_AREA_TYPE_MISMATCH: 50003,
  COMPARISON_REQUIRES_TWO_AREAS: 50004,
} as const;
