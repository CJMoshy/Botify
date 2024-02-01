const { SlashCommandBuilder } = require("discord.js")
const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

//new genai instance
const genAi = new GoogleGenerativeAI(process.env.API_KEY)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask Google GenAI')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message you want to ask Google AI')
                .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();
        // const message = await interaction.reply('loading')
        
        const model = genAi.getGenerativeModel({model: "gemini-pro"});
        const prompt = interaction.options.getString('message');
    
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text()

        const maxChars = 1900;
        let startIndex = 0;
        const textParts = [];

        while (startIndex < text.length){
            const chunk = text.substring(startIndex, startIndex + maxChars);
            textParts.push(chunk);
            startIndex += maxChars;
        }
        
        if (textParts.length > 0) {
            // Send the first part as the initial reply
            await interaction.editReply(textParts[0]);
    
            // If there are more parts, send them as follow-up messages
            for (let i = 1; i < textParts.length; i++) {
                await interaction.followUp(textParts[i]);
            }
        }
    }
}

