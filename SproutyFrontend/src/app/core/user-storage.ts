/** Per-user localStorage key, so each account has its own mock data (until the backend has /api/plants). */
export function userKey(name: string): string {
  let id = 'anon';
  try { id = JSON.parse(localStorage.getItem('user') ?? 'null')?.id ?? 'anon'; } catch { /* ignore */ }
  return `sprouty.${name}.${id}`;
}
