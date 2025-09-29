import type {Request, Response} from "express"
import {ClientService} from "@service/client.ts";
import type {Service} from "@service/interface.ts";
import {type Route, RouteMethod} from "@app/router.rest.ts";
import {type DefaultQuery, DefaultQuerySchema} from "@app/types/request.ts";
import {validate} from "@restApi/validator.ts";
import {errorResponse, paginationResponse, successResponse} from "@restApi/response.ts";
import {type ClientAddRequest, ClientAddSchema} from "@restApi/client.type.ts";
import HttpStatusCode from "@helper/enums/http.ts";

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
        if (!service || !(service instanceof ClientService)) {
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
            },
            {
                method: RouteMethod.Post,
                path: ClientHandler.path,
                func: this.add.bind(this),
                needAuth: true
            },
            {
                method: RouteMethod.Put,
                path: `${ClientHandler.path}/:id`,
                func: this.update.bind(this),
                needAuth: true
            }
        ]
    }

    public add(req: Request, res: Response): void {
        const [err, body] = validate<ClientAddRequest>(ClientAddSchema, req.body)
        if (err) {
            return errorResponse(res, err)
        }

        this.service.createClient(body.name, body.urls)
            .then(client => {
                successResponse(res, HttpStatusCode.CREATED, client)
            })
            .catch(err => {
                errorResponse(res, err)
            })
    }

    public list(req: Request, res: Response): void {
        const [err, body] = validate<DefaultQuery>(DefaultQuerySchema, req.query)
        if (err) {
            return errorResponse(res, err)
        }

        this.service.getClients(body)
            .then((clients) => {
                return paginationResponse(req, res, 200, clients, body)
            })
            .catch((err: any) => {
                return errorResponse(res, err)
            })

    }

    public update(req: Request, res: Response): void {
        const id = req.params.id;

        const [err, body] = validate<ClientAddRequest>(ClientAddSchema, req.body)
        if (err) {
            return errorResponse(res, err)
        }

        const updateData = {
            id: id,
            name: body.name,
            redirectUris: body.urls
        };

        this.service.updateClient(updateData)
            .then(client => {
                successResponse(res, HttpStatusCode.OK, client)
            })
            .catch(err => {
                errorResponse(res, err)
            })
    }
}
