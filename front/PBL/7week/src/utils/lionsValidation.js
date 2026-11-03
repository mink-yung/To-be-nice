export function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function isValidPhone(s) {
  const digits = String(s).replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

export function normalizeWebsiteHref(raw) {
  const s = (raw || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

export function isValidWebsiteUrl(raw) {
  const s = (raw || '').trim();
  if (!s) return true;
  try {
    const u = new URL(normalizeWebsiteHref(s));
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    return Boolean(u.hostname && u.hostname.length > 0);
  } catch {
    return false;
  }
}

export function parseSkills(csv) {
  return (csv || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
