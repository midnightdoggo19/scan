const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides info on a Minecraft server')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The IP of the server')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${interaction.options.getString('server')}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            await interaction.editReply(data.online ? 'Server is online!' : 'Server is offline.');
        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply('Failed to fetch server status.');
        }
    }
};
