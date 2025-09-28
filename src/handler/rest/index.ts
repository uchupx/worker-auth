import {services} from "@app/service";
import {AuthHandler} from "./auth";
import type {Handler} from "./interface";
import {ClientHandler} from "@restApi/client.ts";


export const handlers = (): { [key: string]: Handler } => {
    const svc = services()
    const authService = svc.auth
    const clientService = svc.client

    return {
        auth: (new AuthHandler(authService)),
        client: (new ClientHandler(clientService))
    }
} 
