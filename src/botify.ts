import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Interaction,
} from "discord.js";

import "jsr:@std/dotenv/load";
import { Command } from "./index.d.ts";
import * as path from "jsr:@std/path";

const __dirname = import.meta.dirname as string;

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection object for commands
const commands = new Collection<string, Command>();

// Loader for command files
const commandsPath = path.join(__dirname, "commands");

// everything in the commands folder should be a command
for (const file of Deno.readDirSync(commandsPath)) {
    const filePath = path.join(commandsPath, file.name);
    const url = path.toFileUrl(filePath).href;
    import(url).then((module) => {
        const command = module.default;
        commands.set(command.data.name, command);
    }).catch((err) => console.error(`Error loading command ${filePath}:`, err));
}

// Event listener for slash commands
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command entitled, ${interaction.commandName} found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error executing this command",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error executing this command",
                ephemeral: true,
            });
        }
    }
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

// Login the bot
client.login(Deno.env.get("DISCORD_TOKEN"));
