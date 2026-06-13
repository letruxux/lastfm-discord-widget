export interface EnvConfig {
  TOKEN: string;
  APP_ID: string;
  LASTFM_KEY: string;
  FALLBACK_ALBUM_IMAGE: string;
  LASTFM_PERIOD: string;
  UPDATE_EVERY: string;
  CARTS_API_KEY?: string;
}

function makeEnv(): EnvConfig {
  const raw: Record<string, string | undefined> = {
    TOKEN: process.env.TOKEN,
    APP_ID: process.env.APP_ID,
    LASTFM_KEY: process.env.LASTFM_KEY,
    FALLBACK_ALBUM_IMAGE: process.env.FALLBACK_ALBUM_IMAGE,
    LASTFM_PERIOD: process.env.LASTFM_PERIOD,
    UPDATE_EVERY: process.env.UPDATE_EVERY,
    CARTS_API_KEY: process.env.CARTS_API_KEY,
  };

  for (const key of ["TOKEN", "APP_ID", "LASTFM_KEY"] as const) {
    if (!raw[key]) throw new Error(`Missing environment variable: ${key}`);
  }

  const period = raw.LASTFM_PERIOD || "1month";
  if (!["overall", "7day", "1month", "3month", "6month", "12month"].includes(period)) {
    throw new Error(`Invalid LASTFM_PERIOD: ${period}`);
  }

  return {
    TOKEN: raw.TOKEN!,
    APP_ID: raw.APP_ID!,
    LASTFM_KEY: raw.LASTFM_KEY!,
    FALLBACK_ALBUM_IMAGE:
      raw.FALLBACK_ALBUM_IMAGE ||
      "https://images.steamusercontent.com/ugc/1839179120712206384/EF5BDF5AC5C1315B66BE5BB94E888894F3BC2445/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    LASTFM_PERIOD: period,
    CARTS_API_KEY: raw.CARTS_API_KEY,
    UPDATE_EVERY: raw.UPDATE_EVERY || "10",
  };
}

export const env = makeEnv();
