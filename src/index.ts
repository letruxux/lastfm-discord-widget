import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";
import { env } from "./env";
import { loadConfigs, saveConfigs, type UserConfig } from "./config";
import { buildSocialData, update } from "./widget";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commandsData = [
  new SlashCommandBuilder()
    .setName("lfm-widget-setup")
    .setDescription("link your last.fm account and make your widget")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("your last.fm username")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("period")
        .setDescription("top albums to show (default: 1month)")
        .setRequired(false)
        .addChoices(
          { name: "Week", value: "7day" },
          { name: "Month", value: "1month" },
          { name: "3 Months", value: "3month" },
          { name: "6 Months", value: "6month" },
          { name: "Year", value: "12month" },
          { name: "All Time", value: "overall" },
        ),
    )
    .setContexts(
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    )
    .setIntegrationTypes(
      ApplicationIntegrationType.UserInstall,
      ApplicationIntegrationType.GuildInstall,
    ),

  new SlashCommandBuilder()
    .setName("lfm-widget-stop")
    .setDescription("stop updating your last.fm widget")
    .setContexts(
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    )
    .setIntegrationTypes(
      ApplicationIntegrationType.UserInstall,
      ApplicationIntegrationType.GuildInstall,
    ),
];

client.once("ready", async () => {
  console.log(`logged in as ${client.user!.tag}`);

  const rest = new REST().setToken(env.TOKEN);
  await rest.put(Routes.applicationCommands(env.APP_ID), {
    body: commandsData,
  });
  console.log("slash ok!");

  await runUpdates();
  setInterval(runUpdates, Number.parseInt(env.UPDATE_EVERY) * 60 * 1000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName.endsWith("setup")) {
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
    const periodLabel: Record<string, string> = {
      overall: "all-time",
      "7day": "last week",
      "1month": "last month",
      "3month": "last 3 months",
      "6month": "last 6 months",
      "12month": "last year",
    };
    await interaction.reply({
      content: `linked to @${username} (${periodLabel[period] || period}). check your widget!`,
      ephemeral: true,
    });
    updateUser(interaction.user.id);
  }

  if (interaction.commandName.endsWith("remove")) {
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
});

async function updateUser(userId: string, userConfig?: UserConfig) {
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

async function runUpdates() {
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

client.login(env.TOKEN);
