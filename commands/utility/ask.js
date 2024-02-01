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

        const message = await interaction.reply('loading')
        
        const model = genAi.getGenerativeModel({model: "gemini-pro"})
        const prompt = interaction.options.getString('message')
    
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        console.log(text)

        await message.edit(text).catch(error => {
            console.log(error)
        })

        
    }
}

