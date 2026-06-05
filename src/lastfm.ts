import { env } from "./env";

export async function getTop4AlbumsLastMonth() {
  const resp = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${env.LASTFM_USERNAME}&api_key=${env.LASTFM_KEY}&format=json&limit=4&period=7day`,
  );

  const data = (await resp.json()) as any;

  const albums = Array.isArray(data.topalbums.album)
    ? data.topalbums.album
    : [data.topalbums.album];

  return albums.map((album: any) => ({
    name: `${album.artist.name} - ${album.name}`,
    description: `${Number.parseInt(album.playcount).toLocaleString()} plays`,
    image: album.image.at(-1)["#text"] || env.FALLBACK_ALBUM_IMAGE,
  })) as {
    name: string;
    description: string;
    image: string;
  }[];
}

export async function getUserInfo() {
  const resp = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${env.LASTFM_USERNAME}&api_key=${env.LASTFM_KEY}&format=json`,
  );
  const data = (await resp.json()) as any;
  return {
    username: data.user.name as string,
    playcount: Number.parseInt(data.user.playcount),
    image: data.user.image.at(-1)["#text"] as string,
  };
}
