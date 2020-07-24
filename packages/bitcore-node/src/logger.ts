import * as winston from 'winston';
import parseArgv from './utils/parseArgv';
import path from 'path'
import Sentry from 'winston-sentry';

let args = parseArgv([], ['DEBUG']);

const logLevel = args.DEBUG ? 'debug' : 'info';

const additionalTransports: Array<any> = [];

if (process.env.BITCORE_NODE_SENTRY_DNS !== 'false') {
  additionalTransports.push(new Sentry({
    level: logLevel,
    dsn: process.env.BITCORE_NODE_SENTRY_DNS
  }))
}

if (process.env.BITCORE_NODE_FILE_LOG === 'true') {
  additionalTransports.push(new winston.transports.File({
    colorize: true,
    level: logLevel,
    filename: path.join(__dirname, '../../app.log'),
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }))
}

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: logLevel
    }),
  ].concat(additionalTransports)
});

export default logger;
