import {repos} from "../repo"
import type {UserRepo} from "../repo/user"
import {AuthService} from "./auth"
import type {Service} from "./interface"
import {UserService} from "./user"
import type {ClientRepo} from "@app/repo/client.ts";
import {ClientService} from "@service/client.ts";

export const services = (): { [key: string]: Service } => {
    const repo = repos()
    const userRepo = repo.userRepo as UserRepo
    const clientRepo = repo.clientRepo as ClientRepo
    const authService = new AuthService(userRepo, clientRepo)

    return {
        auth: authService,
        user: (new UserService(userRepo)),
        client: (new ClientService(clientRepo))
    }
}
