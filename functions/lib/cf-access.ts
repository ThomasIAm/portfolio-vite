// Verifies Cloudflare Access JWTs (Cf-Access-Jwt-Assertion header).
// Fails closed: missing config, header, or invalid token => not authorized.

export interface AccessEnv {
  CF_ACCESS_TEAM_DOMAIN?: string; // e.g. "myteam.cloudflareaccess.com"
  CF_ACCESS_AUD?: string; // Application Audience (AUD) tag
}

interface Jwk extends JsonWebKey {
  kid: string;
}

let certCache: { domain: string; keys: Jwk[]; fetchedAt: number } | null = null;
const CERT_TTL_MS = 60 * 60 * 1000;

function b64urlToBytes(input: string): Uint8Array {
  const b64 = input.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function decodeJson<T>(part: string): T {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(part))) as T;
}

async function getKeys(domain: string, forceRefresh = false): Promise<Jwk[]> {
  if (!forceRefresh && certCache && certCache.domain === domain && Date.now() - certCache.fetchedAt < CERT_TTL_MS) {
    return certCache.keys;
  }
  const res = await fetch(`https://${domain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`Failed to fetch Access certs: ${res.status}`);
  const { keys } = (await res.json()) as { keys: Jwk[] };
  certCache = { domain, keys, fetchedAt: Date.now() };
  return keys;
}

export async function verifyAccessJwt(request: Request, env: AccessEnv): Promise<boolean> {
  const domain = env.CF_ACCESS_TEAM_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const aud = env.CF_ACCESS_AUD;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!domain || !aud || !token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const header = decodeJson<{ alg: string; kid: string }>(parts[0]);
    const payload = decodeJson<{ aud: string | string[]; iss: string; exp: number; nbf?: number }>(parts[1]);
    if (header.alg !== 'RS256') return false;

    let keys = await getKeys(domain);
    let jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) {
      keys = await getKeys(domain, true); // key rotation
      jwk = keys.find((k) => k.kid === header.kid);
    }
    if (!jwk) return false;

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
    if (!valid) return false;

    const now = Math.floor(Date.now() / 1000);
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(aud)) return false;
    if (payload.iss !== `https://${domain}`) return false;
    if (typeof payload.exp !== 'number' || payload.exp < now) return false;
    if (payload.nbf && payload.nbf > now + 60) return false;
    return true;
  } catch (err) {
    console.error('Access JWT verification failed:', err);
    return false;
  }
}
