import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface UserConfig {
  discordId: string;
  lastfmUsername: string;
  period: string;
}

const CONFIG_PATH = join(import.meta.dir, "..", "data","config.json");

export function loadConfigs(): UserConfig[] {
  if (!existsSync(CONFIG_PATH)) return [];
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

export function saveConfigs(configs: UserConfig[]): void {
  writeFileSync(CONFIG_PATH, JSON.stringify(configs, null, 2));
}
