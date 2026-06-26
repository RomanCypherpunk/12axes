export function resolvePersonalityImageSrc(imagePath?: string): string {
  const path = imagePath?.trim();
  if (!path) {
    return '';
  }

  if (/^(?:https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const normalizedPath = path
    .replace(/^\/+/, '')
    .replace(/^public\//, '');

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${normalizedPath}`;
}

export function personalityInitials(name?: string): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}
