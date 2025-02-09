const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getskin')
		.setDescription('Skin a player.').addStringOption(option =>
            option.setName('name')
                .setDescription('The player\'s username')
                .setRequired(true)
        ),

	async execute(interaction) {
        await interaction.deferReply();
        await interaction.editReply({ files: [`https://mineskin.eu/armor/body/${interaction.options.getString('name')}/100.png`] })
	},
};
