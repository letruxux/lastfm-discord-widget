import { env } from "./env";

export interface SocialData {
  data: {
    dynamic: {
      type: number;
      name: string;
      value:
        | {
            url: string;
          }
        | string;
    }[];
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
