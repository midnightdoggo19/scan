const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logger, nameValidation } = require('../../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skin')
		.setDescription('Images of players')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The player\'s username')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('type')
            .setDescription('Type of image')
            .setRequired(true)
            .addChoices(
				{ name: 'Body', value: 'full_front' },
				{ name: 'Head', value: 'head' },
				{ name: 'Face', value: 'face' },
                { name: 'Bust', value: 'bust' },
                { name: 'Skin', value: 'skin' },
			)
        )
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1),

	async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        const imageType = interaction.options.getString('type');
        try { await nameValidation(name); } catch (NameInvalid) { interaction.editReply(`${name} is not a valid Minecraft username!`); return; };

        if ( imageType == 'full_front' ) {
            await interaction.editReply({ files: [`https://mineskin.eu/armor/body/${name}/100.png`] });
        }
        else if ( imageType == 'head' ) {
            await interaction.editReply({ files: [`https://mineskin.eu/headhelm/${name}/100.png`] });
        }
        else if ( imageType == 'face' ) {
            await interaction.editReply({ files: [`https://mineskin.eu/helm/${name}/100.png`] });
        }
        else if ( imageType == 'bust' ) {
            await interaction.editReply({ files: [`https://mineskin.eu/armor/bust/${name}/100.png`] });
        }
        else if ( imageType == 'skin') {
            await interaction.editReply({ files: [`https://mineskin.eu/skin/${name}` + '.png'] }); // get skin, make image
        }
        else {
            logger.error('Invalid option!')
            await interaction.editReply('Invalid option!');
        }
	},
};
