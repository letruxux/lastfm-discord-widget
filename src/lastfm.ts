import { absolutelyGetAlbumArt } from "./album-art";
import { env } from "./env";

export async function getTopAlbums(username: string, period: string) {
  const resp = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${env.LASTFM_KEY}&format=json&limit=4&period=${period}`,
  );

  const data = (await resp.json()) as any;

  const albums = Array.isArray(data.topalbums.album)
    ? data.topalbums.album
    : [data.topalbums.album];

  return await Promise.all(
    albums.map(async (album: any) => ({
      name: `${album.artist.name} - ${album.name}`,
      description: `${Number.parseInt(album.playcount).toLocaleString()} plays`,
      image:
        album.image.at(-1)["#text"] ||
        (await absolutelyGetAlbumArt(album.name, album.artist.name)),
    })) as {
      name: string;
      description: string;
      image: string;
    }[],
  );
}

export async function getUserInfo(username: string) {
  const resp = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${env.LASTFM_KEY}&format=json`,
  );
  const data = (await resp.json()) as any;
  return {
    username: data.user.name as string,
    playcount: Number.parseInt(data.user.playcount),
    image: data.user.image.at(-1)["#text"] as string,
  };
}
