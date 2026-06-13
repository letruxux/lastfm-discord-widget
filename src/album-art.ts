import { env } from "./env";

async function artworkBoiduDev(name: string, artist: string) {
  const url = `https://artwork.boidu.dev/?s=${encodeURIComponent(name)}&a=${encodeURIComponent(artist)}`;
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const json = (await resp.json()) as any;
  if (json.name !== name) return null;
  return json.static ?? null;
}

async function cartsImage(name: string, artist: string) {
  if (!env.CARTS_API_KEY) return null;
  const url = `https://carts.ltrx.lol/search?track=${encodeURIComponent(
    name,
  )}&artist=${encodeURIComponent(artist)}&providers=spotify,navidrome`;
  const resp = await fetch(url, { headers: { "x-api-key": env.CARTS_API_KEY } });
  if (!resp.ok) return null;
  const json = (await resp.json()) as { results: { url: string; confidence: number }[] };

  const highestConfidence = json.results.reduce(
    (acc, cur) => (cur.confidence > (acc?.confidence ?? 0) ? cur : acc),
    json.results[0],
  );

  return highestConfidence?.url ?? null;
}

export async function absolutelyGetAlbumArt(name: string, artist: string) {
  const [boidu, carts] = await Promise.all([
    artworkBoiduDev(name, artist),
    cartsImage(name, artist),
  ]);

  if (boidu) return boidu;
  if (carts) return carts;

  return env.FALLBACK_ALBUM_IMAGE;
}
