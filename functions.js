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

module.exports = { logger, avatar, javaPort, bedrockPort }