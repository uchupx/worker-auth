import type {Config} from "./config/app";
import {handlers} from "./handler/grpc";
import * as grpc from "@grpc/grpc-js"
import {protos} from "./handler/grpc/loader";

export function InitRouteGRPC(app: grpc.Server, config: Config) {
    const handler = handlers()

    app.addService(protos.authProto.service, {
        GetUser: handler.authHandler.getUser.bind(handler.authHandler),
        Login: handler.authHandler.login.bind(handler.authHandler),
        RegisterUser: handler.authHandler.register.bind(handler.authHandler),
        ChangePassword: handler.authHandler.changePassword.bind(handler.authHandler),
        Logout: handler.authHandler.logout.bind(handler.authHandler)
    })
}
