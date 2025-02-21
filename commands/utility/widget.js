const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger, avatar, javaPort } = require('../../functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('widget')
        .setDescription('Get the widget of a Java server')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The address of the server')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('port')
               .setDescription(`The port the server runs on (default ${javaPort})`)
        )
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1),

    async execute(interaction) {
        await interaction.deferReply();
        try {
            const widgetEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Server Status')
                .setAuthor({ name: 'Server Status', iconURL: avatar, url: 'https://github.com/midnightdoggo19/scan' })
                .setImage(`https://api.mcstatus.io/v2/widget/java/${interaction.options.getString('server')}:${interaction.options.getInteger('port') || javaPort}`)
                .setTimestamp()

            await interaction.editReply({ embeds: [widgetEmbed] });
        } catch (error) {
            logger.error('Error:', error);
            await interaction.editReply('Failed to fetch server widget.');
        }
    }
};