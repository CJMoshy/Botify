import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../index.d.ts"

export default {
    data: new SlashCommandBuilder().setName("wave").setDescription(
        "wave at botify!",
    ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply(`Hello there, ${interaction.user.username}!`);
    },
} as Command;
