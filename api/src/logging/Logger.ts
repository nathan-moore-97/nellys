import { createLogger, format, LeveledLogMethod, transports } from 'winston';

const logLevel = process.env.LOG_LEVEL || 'warn';

const timestampFormat = format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'});

const logger = createLogger({
    level: logLevel,
    format: format.combine(
        timestampFormat,
        format.json(),
    ),
    transports: [
        new transports.File({ filename: 'nellys_error.log', level: 'error' }),
        new transports.File({ filename: 'nellys.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            timestampFormat,
            format.colorize(),
            format.simple()
        )
    }));
}

export const logAsync = (logFunction: LeveledLogMethod, ...args: unknown[]) => new Promise(() => logFunction(args));

export default logger;