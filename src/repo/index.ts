import type {ConnectionOptions} from "mysql2"
import {Database} from "../database/mysql"
import type {Repo} from "./interface"
import app from "../config/app"
import {UserRepo} from "./user"
import {ClientRepo} from "@app/repo/client.ts";

export const repos = (): { [key: string]: Repo } => {
    const config = app.getConfig
    const db = new Database({
        host: config.database.host,
        port: config.database.port,
        user: config.database.username,
        password: config.database.password,
        database: config.database.database,
    } as ConnectionOptions)

    return {
        userRepo: new UserRepo(db),
        clientRepo: new ClientRepo(db),
    }
}
