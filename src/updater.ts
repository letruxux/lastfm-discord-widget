import { loadConfigs, type UserConfig } from "./config";
import { buildSocialData, update } from "./widget";
import { env } from "./env";

export async function updateUser(userId: string, userConfig?: UserConfig) {
  if (!userConfig) {
    const configs = loadConfigs();
    userConfig = configs.find((c) => c.discordId === userId);
  }

  if (!userConfig) {
    console.log(`user ${userId} not found`);
    return;
  }

  const data = await buildSocialData(userConfig.lastfmUsername, userConfig.period);
  await update(data, userConfig.discordId);
  console.log(
    `updated widget for @${userConfig.lastfmUsername} (${userConfig.discordId})`,
  );
}

export async function runUpdates() {
  const configs = loadConfigs();
  if (configs.length === 0) return;

  const results = await Promise.allSettled(
    configs.map(async (config) => updateUser(config.discordId, config)),
  );

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("failed:", result.reason);
    }
  }

  console.log(`next update in ${env.UPDATE_EVERY} mins`);
}
