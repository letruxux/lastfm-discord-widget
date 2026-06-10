import { env } from "./env";
import { getTopAlbums, getUserInfo } from "./lastfm";

export interface SocialData {
  data: {
    dynamic: {
      type: number;
      name: string;
      value: { url: string } | string;
    }[];
  };
}

const periodLabels: Record<string, string> = {
  overall: "All-time top albums",
  "7day": "Last week's top albums",
  "1month": "Last month's top albums",
  "3month": "Last 3 months' top albums",
  "6month": "Last 6 months' top albums",
  "12month": "Last year's top albums",
};

export async function buildSocialData(lastfmUsername: string, period: string): Promise<SocialData> {
  const [albums, userInfo] = await Promise.all([
    getTopAlbums(lastfmUsername, period),
    getUserInfo(lastfmUsername),
  ]);

  const albumsData = albums
    .slice(0, 4)
    .map((album, i) => [
      { type: 3, name: `image${i + 1}`, value: { url: album.image } },
      { type: 1, name: `name${i + 1}`, value: album.name },
      { type: 1, name: `description${i + 1}`, value: album.description },
    ])
    .flat();

  return {
    data: {
      dynamic: [
        ...albumsData,
        { type: 3, name: "lastfmlogo", value: { url: userInfo.image } },
        { type: 1, name: "lastfmusername", value: userInfo.username },
        { type: 1, name: "scrobbles", value: `${userInfo.playcount.toLocaleString()} scrobbles` },
        { type: 1, name: "period", value: periodLabels[period] || "Top albums" },
      ],
    },
  };
}

export async function update(socialData: SocialData, userId: string) {
  const resp = await fetch(
    `https://discord.com/api/v9/applications/${env.APP_ID}/users/${userId}/identities/0/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${env.TOKEN}`,
        "User-Agent": "DiscordBot (https://github.com/discord/discord-api-docs, 1.0.0)",
      },
      body: JSON.stringify(socialData),
    },
  );
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`${resp.status}\n${text}`);
  }
}
