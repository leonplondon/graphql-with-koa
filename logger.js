const winston = require('winston');
const path = require('path');

module.exports = (artifact) => winston
  .createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.label({ label: path.basename(artifact) }),
    ),
    exitOnError: false,
    level: 'info',
    transports: [
      new winston.transports.Console({
        level: 'verbose',
        format: winston.format.combine(
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        level: 'info',
        filename: 'app.log',
        format: winston.format.combine(
          winston.format.logstash(),
        ),
      }),
    ],
  });
