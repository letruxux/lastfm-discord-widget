import { update, type SocialData } from "./discord";
import { env } from "./env";
import { getTop4AlbumsLastMonth, getUserInfo } from "./lastfm";

async function buildSocialData(lastfmUsername: string): Promise<SocialData> {
  const [albums, userInfo] = await Promise.all([
    getTop4AlbumsLastMonth(lastfmUsername),
    getUserInfo(lastfmUsername),
  ]);

  const albumsData = albums
    .slice(0, 4)
    .map((album, i) => [
      {
        type: 3,
        name: `image${i + 1}`,
        value: { url: album.image },
      },
      {
        type: 1,
        name: `name${i + 1}`,
        value: album.name,
      },
      {
        type: 1,
        name: `description${i + 1}`,
        value: album.description,
      },
    ])
    .flat();

  return {
    data: {
      dynamic: [
        ...albumsData,
        {
          type: 3,
          name: "lastfmlogo",
          value: { url: userInfo.image },
        },
        {
          type: 1,
          name: "lastfmusername",
          value: userInfo.username,
        },
        {
          type: 1,
          name: "scrobbles",
          value: `${userInfo.playcount.toLocaleString()} scrobbles`,
        },
      ],
    },
  };
}

async function run() {
  const results = await Promise.allSettled(
    env.USERS.map(async (user) => {
      const data = await buildSocialData(user.lastfmUsername);
      await update(data, user.discordId);
      console.log(`Updated widget for ${user.lastfmUsername} (${user.discordId})`);
    }),
  );

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Failed to update a user:", result.reason);
    }
  }

  console.log(`Done. Refreshing in ${env.UPDATE_EVERY} minutes...`);
}

run();
setInterval(run, Number.parseInt(env.UPDATE_EVERY) * 60 * 1000);
