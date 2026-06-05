import { update, type SocialData } from "./discord";
import { env } from "./env";
import { getTop4AlbumsLastMonth, getUserInfo } from "./lastfm";

async function buildSocialData(): Promise<SocialData> {
  const [top4Albums, userInfo] = await Promise.all([
    getTop4AlbumsLastMonth(),
    getUserInfo(),
  ]);

  const albumsData = top4Albums
    .map((album, i) => [
      {
        type: 3,
        name: `image${i + 1}`,
        value: {
          url: album.image,
        },
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
          value: {
            url: userInfo.image,
          },
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

function run() {
  buildSocialData()
    .then(update)
    .then(() => console.log("Updated social info successfully!"))
    .catch((e) => console.error("Failed to update social info:", e))
    .finally(() => console.log("Retrying in", env.UPDATE_EVERY!, "minutes..."));
}

run();
setInterval(run, Number.parseInt(env.UPDATE_EVERY!) * 60 * 1000);
