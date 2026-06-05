function makeEnv() {
  const env: Record<string, string | undefined> = {
    TOKEN: process.env.TOKEN,
    APP_ID: process.env.APP_ID,
    USER_ID: process.env.USER_ID,
    LASTFM_KEY: process.env.LASTFM_KEY,
    LASTFM_USERNAME: process.env.LASTFM_USERNAME,
    LASTFM_PERIOD: process.env.LASTFM_PERIOD,
  };

  for (const key in env) {
    if (!env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    if (
      key === "LASTFM_PERIOD" &&
      !["overall", "7day", "1month", "3month", "6month", "12month"].includes(env[key])
    ) {
      throw new Error(`Invalid LASTFM_PERIOD: ${env[key]}`);
    }
  }

  return {
    ...env,
    FALLBACK_ALBUM_IMAGE:
      env.FALLBACK_ALBUM_IMAGE ||
      "https://images.steamusercontent.com/ugc/1839179120712206384/EF5BDF5AC5C1315B66BE5BB94E888894F3BC2445/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
  } as Record<string, string>;
}

export const env = makeEnv();
