import {repos} from "../repo"
import type {UserRepo} from "../repo/user"
import {AuthService} from "./auth"
import type {Service} from "./interface"
import {UserService} from "./user"
import type {ClientRepo} from "@app/repo/client.ts";
import {ClientService} from "@service/client.ts";
import Redis from "@app/database/redis.ts";
import app from "@app/config/app.ts";
import type {RedisClientOptions} from "redis";

export const services = (): { [key: string]: Service } => {
    const config = app.getConfig
    const redisClientOption = {
        url: config.redis.url,
        database: config.redis.database,
    } as RedisClientOptions
    const repo = repos()
    const redis = new Redis(redisClientOption)
    const userRepo = repo.userRepo as UserRepo
    const clientRepo = repo.clientRepo as ClientRepo
    const authService = new AuthService(userRepo, clientRepo, redis)

    return {
        auth: authService,
        user: (new UserService(userRepo)),
        client: (new ClientService(clientRepo))
    }
}
