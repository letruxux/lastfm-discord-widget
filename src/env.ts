function makeEnv() {
  const raw: Record<string, string | undefined> = {
    TOKEN: process.env.TOKEN,
    APP_ID: process.env.APP_ID,
    USER_ID: process.env.USER_ID,
    LASTFM_KEY: process.env.LASTFM_KEY,
    LASTFM_USERNAME: process.env.LASTFM_USERNAME,
    LASTFM_PERIOD: process.env.LASTFM_PERIOD,
    UPDATE_EVERY: process.env.UPDATE_EVERY,
  };

  for (const key in raw) {
    if (!raw[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  const period = raw.LASTFM_PERIOD!;
  if (!["overall", "7day", "1month", "3month", "6month", "12month"].includes(period)) {
    throw new Error(`Invalid LASTFM_PERIOD: ${period}`);
  }

  const lastfmUsernames = raw.LASTFM_USERNAME!.split(",").map((u) => u.trim()).filter(Boolean);
  const userIds = raw.USER_ID!.split(",").map((u) => u.trim()).filter(Boolean);

  if (lastfmUsernames.length !== userIds.length) {
    throw new Error(
      `Mismatch between LASTFM_USERNAME (${lastfmUsernames.length}) and USER_ID (${userIds.length}) — they must have the same number of entries`,
    );
  }

  const users: { discordId: string; lastfmUsername: string }[] = lastfmUsernames.map((username, i) => ({
    discordId: userIds[i]!,
    lastfmUsername: username,
  }));

  return {
    TOKEN: raw.TOKEN!,
    APP_ID: raw.APP_ID!,
    USERS: users,
    LASTFM_KEY: raw.LASTFM_KEY!,
    LASTFM_PERIOD: period,
    UPDATE_EVERY: raw.UPDATE_EVERY!,
    FALLBACK_ALBUM_IMAGE:
      raw.FALLBACK_ALBUM_IMAGE ||
      "https://images.steamusercontent.com/ugc/1839179120712206384/EF5BDF5AC5C1315B66BE5BB94E888894F3BC2445/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
  };
}

export const env = makeEnv();
