import type { ChatInputCommandInteraction } from "discord.js";
import { loadConfigs, saveConfigs } from "./config";
import { periodLabels } from "./commands";
import { updateUser } from "./updater";

export async function handleSetupCommand(interaction: ChatInputCommandInteraction) {
  const username = interaction.options.getString("username", true);
  const period = interaction.options.getString("period") || "1month";
  const configs = loadConfigs();
  const existing = configs.find((c) => c.discordId === interaction.user.id);
  if (existing) {
    existing.lastfmUsername = username;
    existing.period = period;
  } else {
    configs.push({ discordId: interaction.user.id, lastfmUsername: username, period });
  }
  saveConfigs(configs);
  await interaction.reply({
    content: `linked to @${username} (${periodLabels[period] || period}). check your widget!`,
    ephemeral: true,
  });
  updateUser(interaction.user.id);
}

export async function handleRemoveCommand(interaction: ChatInputCommandInteraction) {
  const configs = loadConfigs();
  const filtered = configs.filter((c) => c.discordId !== interaction.user.id);
  if (filtered.length === configs.length) {
    await interaction.reply({
      content: "you aren't even linked 🤣🤣🤣🤣",
      ephemeral: true,
    });
  } else {
    saveConfigs(filtered);
    await interaction.reply({
      content: "ok! removed you from the bot",
      ephemeral: true,
    });
  }
}
