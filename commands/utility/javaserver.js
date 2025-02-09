const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('javaserver')
        .setDescription('Figure out if a Java server is online')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The address of the server')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('port')
                .setDescription('The port the server runs on (default 25565)')
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${interaction.options.getString('server')}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        try {
            const widgetEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Server Status')
                .setAuthor({ name: 'Midnight Doggo', iconURL: 'https://avatars.githubusercontent.com/u/71900479?v=4' })
                .setDescription(`Players online: ${String(data.players.max)}/${String(data.players.online)}`)
                .setImage(`https://api.mcstatus.io/v2/widget/java/${interaction.options.getString('server')}:${interaction.options.getInteger('port') || 25565}`)
                .setTimestamp()

            await interaction.editReply({ embeds: [widgetEmbed] });
        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply('Failed to fetch server widget.');
        }
    }
};
