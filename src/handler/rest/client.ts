import type { Request, Response } from "express"
import {ClientService} from "@service/client.ts";
import type {Service} from "@service/interface.ts";
import {type Route, RouteMethod} from "@app/router.rest.ts";
import {type DefaultQuery, DefaultQuerySchema} from "@app/types/request.ts";
import {validate} from "@restApi/validator.ts";
import {errorResponse, paginationResponse} from "@restApi/response.ts";
import {date} from "joi";

export class ClientHandler {
    static readonly path = "/client"

    private readonly service: ClientService

    /**
     * Client handler
     * endpoints:
     * -
     * @param service
     */
    constructor(service: Service | undefined) {
        if (!service|| !(service instanceof ClientService)) {
            throw new Error("ClientHandler requires an instance of ClientService")
        }

        this.service = service
    }


    routes(): Array<Route> {
        return [
            {
                method: RouteMethod.Get,
                path: ClientHandler.path,
                func: this.list.bind(this),
                needAuth: true
            }
        ]
    }

    public list(req: Request, res: Response): void{
        const[err, body] = validate<DefaultQuery>(DefaultQuerySchema, req.query)
        if (err) {
            return errorResponse(res, err)
        }

        this.service.getClients(body)
            .then((clients) => {
                return paginationResponse(req, res, 200, clients,body)
            })
            .catch((err: any) => {
                return errorResponse(res, err)
            })

    }
}