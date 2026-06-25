const COUNTRY_FLAGS_PATH = 'countries/flags/';

export function resolveCountryFlagSrc(flagPath?: string): string {
  const path = flagPath?.trim();
  if (!path) {
    return '';
  }

  if (/^(?:https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const normalizedPath = path
    .replace(/^\/+/, '')
    .replace(/^public\//, '');

  if (normalizedPath.startsWith(COUNTRY_FLAGS_PATH)) {
    return withBasePath(normalizedPath);
  }

  return withBasePath(`${COUNTRY_FLAGS_PATH}${normalizedPath}`);
}

export function flagFileName(flagPath?: string): string {
  const path = flagPath?.trim();
  if (!path) {
    return '';
  }
  const parts = path.replace(/\\/g, '/').split('/').filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] ?? '');
}

function withBasePath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
