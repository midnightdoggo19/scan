require('dotenv').config();
const winston = require('winston');

const avatar = 'https://minecraft.wiki/images/Unknown_server.png?0968f';

const javaPort = 25565;
const bedrockPort = 19132;

const logger = winston.createLogger({
	level: process.env.LOGLEVEL || 'info',
	format: winston.format.combine(
		  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		  winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
	),
	transports: [
		  new winston.transports.Console(),
		  new winston.transports.File({ filename: process.env.LOGFILE || 'scan.log' }),
	]
});

async function nameValidation (name) {
	const profile = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`);
	if (!profile.ok) {
		throw new 'NameInvalid';
	}
	else {
		return name;
	};
};

module.exports = { logger, nameValidation, avatar, javaPort, bedrockPort }