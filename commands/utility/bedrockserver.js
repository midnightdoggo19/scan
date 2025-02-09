const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bedrockserver')
        .setDescription('Figure out if a bedrock server is online')
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

        const response = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${interaction.options.getString('server')}:${interaction.options.getInteger('port') || 25565}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        try {
            const widgetEmbed = new EmbedBuilder()
                .setColor(0x0099FF) // blue
                .setTitle('Server Status')
                .setAuthor({ name: 'Midnight Doggo', iconURL: 'https://avatars.githubusercontent.com/u/71900479?v=4' })

                .setDescription(String(data.motd.clean)) // unformatted motd
                .setImage(`https://api.mcstatus.io/v2/icon/${interaction.options.getString('server')}:${interaction.options.getInteger('port') || 25565}`)
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Version', value: String(data.version.name_clean), inline: true }, // unformatted version name
                    { name: 'Players online', value: `${String(data.players.max)}/${String(data.players.online)}`, inline: true }, // how many online/max
                )

                .setTimestamp()
                .setFooter({ text: 'View this project on Github', iconURL: 'https://github.com/midnightdoggo19/scan' });

            await interaction.editReply({ embeds: [widgetEmbed] });
        } catch (error) {
            console.error('Error:', error);
            await interaction.editReply('Failed to fetch server information.');
        }
    }
};
