const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger, avatar, port, bedrockPort } = require('../../functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bedrock')
        .setDescription('Figure out if a bedrock server is online')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The address of the server')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('port')
                .setDescription(`The port the server runs on (default ${port})`)
        )
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1),

    async execute(interaction) {
        await interaction.deferReply();

        const server = `${interaction.options.getString('server')}:${interaction.options.getInteger('port') || bedrockPort}`

        const response = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${server}`);
        if (!response.ok) {
            logger.error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        try {
            const widgetEmbed = new EmbedBuilder()
                .setColor(0x0099FF) // blue
                .setTitle('Server Status')
                .setAuthor({ name: 'Server Status', iconURL: avatar, url: 'https://github.com/midnightdoggo19/scan' })

                .setDescription(String(data.motd.clean)) // unformatted motd
                .setImage(`https://api.mcstatus.io/v2/icon/${server}`)
                .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Version', value: String(data.version.name_clean), inline: true }, // unformatted version name
                    { name: 'Players online', value: `${String(data.players.online)}/${String(data.players.max)}`, inline: true }, // how many online/max
                )

                .setTimestamp()
                .setFooter({ text: 'View this project on Github', iconURL: 'https://github.com/midnightdoggo19/scan' });

            await interaction.editReply({ embeds: [widgetEmbed] });
        } catch (error) {
            logger.error('Error:', error);
            await interaction.editReply('Failed to fetch server information.');
        }
    }
};
