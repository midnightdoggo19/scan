const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { logger } = require('./index.js');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			logger.info(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		logger.info(`Started refreshing ${commands.length} application (/) commands.`);
		logger.info(`Bot ID: ${process.env.ID}`);
		const data = await rest.put(
			Routes.applicationCommands(process.env.ID),
			{ body: commands },
		);

		logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {

		console.error(error);
	}
})();

// deletes guild commands
// rest.put(Routes.applicationGuildCommands(process.env.ID, process.env.GUILD), { body: [] })
// 	.then(() => logger.info('Successfully deleted all guild commands.'))
// 	.catch(console.error);