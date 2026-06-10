import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { env } from "./env";
import { commandsData } from "./commands";
import { handleSetupCommand, handleRemoveCommand } from "./handlers";
import { runUpdates } from "./updater";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
    await handleSetupCommand(interaction);
  }

  if (interaction.commandName.endsWith("remove")) {
    await handleRemoveCommand(interaction);
  }
});

client.login(env.TOKEN);
