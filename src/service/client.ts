import type {ClientRepo} from "@app/repo/client.ts";
import type {ClientCreateModel, ClientModel, ClientUpdateModel} from "@app/repo/client.type.ts";
import {ErrorHandler} from "@helper/error.ts";
import HttpStatusCode from "@helper/enums/http.ts";
import {generateRandomHex} from "@helper/string.ts";
import {type DefaultQuery, toLimitOffset} from "@app/types/request.ts";


export class ClientService {
    private clientRepo: ClientRepo

    constructor(clientRepo: ClientRepo) {
        this.clientRepo = clientRepo;
    }

    /**
     * Create a new client
     * @param name - Name of the client
     * @param urls
     * @returns ClientModel - client model with secret and redirect URIs
     */
    public async createClient(name: string, urls: Array<string>): Promise<ClientModel> {
        const newClient = {
            name: name,
            secret: generateRandomHex(12),
            redirectUris: urls
        } as ClientCreateModel

        const result = await this.clientRepo.createClient(newClient)
        if (!result) {
            throw new ErrorHandler("Failed to create client", null, HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        return result
    }

    /**
     * Get list of clients pagination
     * @param query -  query from url
     * @returns Promise<ClientModel[]> - promise list of clients
     */
    public async getClients(query: DefaultQuery): Promise<ClientModel[]> {
        const {limit, offset} = toLimitOffset(query)

        const clients = await this.clientRepo.getClients(limit, offset);

        return clients
    }

    /**
     * Action update client
     * @param client - Client Update model
     */
    public async updateClient(client: ClientUpdateModel): Promise<ClientModel> {
        let isExist = await this.clientRepo.findById(client.id!)

        if (!isExist) {
            throw new ErrorHandler("data not found", null, 404)
        }

        isExist = await this.clientRepo.update(client)

        return isExist
    }
}