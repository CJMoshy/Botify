import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

import "dotenv/config";
import process from "node:process";
import { Command } from "../index.d.ts";

//new genai instance
const genAi = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-pro" });

export default {
    data: new SlashCommandBuilder()
        .setName("ask")
        .setDescription("Ask Google GenAI")
        .addStringOption((option) =>
            option.setName("message")
                .setDescription("The message you want to ask Google AI")
                .setRequired(true)
        ) as SlashCommandBuilder,

    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const prompt = interaction.options.getString("message")!;
        const result = await model.generateContent(
            `in 1500 characters or less, ${prompt}`,
        );
        const response = await result.response;
        if (response) {
            console.log(response);
        } else {
            interaction.followUp("Internal Server Error");
        }
        const text = response.text(); //get reponse text
        await interaction.editReply(text);
    },
} as Command;
