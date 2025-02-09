const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bedrockserver')
        .setDescription('Figure out if a Bedrock server is online')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The IP of the server')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('port')
                .setDescription('The port the server runs on (default 25565)')
        ),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${interaction.options.getString('server')}:${interaction.options.getInteger('port') || 25565}`);
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
