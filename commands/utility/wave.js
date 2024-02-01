const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wave')
        .setDescription('Waves hello to the user'),
    async execute(interaction) {
        await interaction.reply(`Hello there, ${interaction.user.username}!`)
    }
}