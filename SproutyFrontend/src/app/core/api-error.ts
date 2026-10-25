import { HttpErrorResponse } from '@angular/common/http';

/** Turns a backend error (ProblemDetails / validation errors) into a friendly message. */
export function apiErrorMessage(e: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const err = e as HttpErrorResponse;
  if (err?.status === 0) return "Can't reach the server. Make sure the backend is running.";
  const body = err?.error;
  if (err?.status === 400 && body?.errors) {
    const first = (Object.values(body.errors) as string[][])[0]?.[0];
    if (first) return first;
  }
  if (typeof body?.detail === 'string') return body.detail;
  return fallback;
}
