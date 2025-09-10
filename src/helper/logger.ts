import {createLogger, transports, format} from "winston";
import path from "path";

const logFilePath = path.join(process.cwd(), "logs", "app.log");

export const log = createLogger({
    defaultMeta: {
        app_name: "worker-auth",
        version: "1.0.0",
    },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.printf(({timestamp, level, message}) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            ),
        }),
        new transports.File({
            filename: logFilePath,
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
        }),
    ],
});

import fs from "fs";

const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {recursive: true});
}
