export function getSubdomain(url: string | URL) {
  const { hostname } = new URL(url);

  const parts = hostname.split(".");

  if (parts.length > 2) {
    return parts.slice(0, parts.length - 2).join(".");
  }

  return null;
}
