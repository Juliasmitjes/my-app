type SocialUrls = {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
};

export type SocialLink = {
  platform: string;
  href: string;
  label: string;
};

export function splitBodyIntoColumns(value: string): [string, string] {
  const fallback =
    'Vertel hier in een paar zinnen wie je bent, waar je voor staat en waarom bezoekers juist met jou willen werken.';
  const normalized = (value || fallback).replace(/\s+/g, ' ').trim();
  if (!normalized) return [fallback, fallback];

  const sentences = normalized.match(/[^.!?]+[.!?]?/g)?.map(part => part.trim()).filter(Boolean) ?? [];
  if (sentences.length >= 2) {
    const midpoint = Math.ceil(sentences.length / 2);
    return [sentences.slice(0, midpoint).join(' '), sentences.slice(midpoint).join(' ')];
  }

  const words = normalized.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const firstColumn = words.slice(0, midpoint).join(' ');
  return [firstColumn, words.slice(midpoint).join(' ') || firstColumn];
}

export function buildSocialLinks(socials: SocialUrls): SocialLink[] {
  const entries = [
    { key: 'linkedin', platform: 'linkedin', label: 'LinkedIn' },
    { key: 'instagram', platform: 'instagram', label: 'Instagram' },
    { key: 'facebook', platform: 'facebook', label: 'Facebook' }
  ] as const;

  return entries.flatMap(entry => {
    const raw = socials[entry.key]?.trim();
    return raw ? [{ platform: entry.platform, href: normalizeUrl(raw), label: entry.label }] : [];
  });
}

export function getFileLabel(value: File | string | null, fallback: string): string {
  if (value instanceof File) return value.name;
  if (typeof value !== 'string' || !value.trim()) return fallback;
  const parts = value.split(/[\\/]/);
  return parts[parts.length - 1] || fallback;
}

function normalizeUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
