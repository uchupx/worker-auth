import {createLogger, transports, format} from "winston";
import path from "path";
import App from "../config/app";

const conf = App.getConfig
const logFilePath = path.join(process.cwd(), conf.app.log_file);

export const log = createLogger({
    defaultMeta: {
        app_name: conf.app.name,
        version: conf.app.version,
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
import app from "@app/config/app.ts";

const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {recursive: true});
}
