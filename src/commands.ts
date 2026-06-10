import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} from "discord.js";

export const commandsData = [
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

export const periodLabels: Record<string, string> = {
  overall: "all-time",
  "7day": "last week",
  "1month": "last month",
  "3month": "last 3 months",
  "6month": "last 6 months",
  "12month": "last year",
};
