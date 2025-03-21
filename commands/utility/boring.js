const { SlashCommandBuilder } = require('discord.js');
const { logger } = require('../../functions.js');
const levenshtein = require('js-levenshtein');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('boring')
		.setDescription('See how unique a username is')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The username')
                .setRequired(true)
        )
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1),

    async execute(interaction) {
        await interaction.deferReply();

        const name = interaction.options.getString('name');

        const words = await fetch('https://matdoes.dev/minecraft-uuids/api/words.txt') + await fetch('https://matdoes.dev/minecraft-uuids/api/suffixes.txt');
        const lev = await String(levenshtein(name, String(words)));

        if (lev >= 100) {
            await interaction.editReply('...what');
        } else {
            const score = 100 - lev;
            await interaction.editReply(`This name's uniqueness score is ${score}%!`);
            logger.info(`${name} was scored at ${lev}`);
        };
    }
};
