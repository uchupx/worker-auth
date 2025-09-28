import type {ClientRepo} from "@app/repo/client.ts";
import type {ClientCreateModel, ClientModel} from "@app/repo/client.type.ts";
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
     * @returns ClientModel - client model with secret and redirect URIs
     */
    public async createClient(name: string): Promise<ClientModel> {
        const newClient = {
            name: name,
            secret: generateRandomHex(12),
            redirectUris: []
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
    public async getClients(query: DefaultQuery ): Promise<ClientModel[]> {
        const {limit, offset} = toLimitOffset(query)

        const clients = await this.clientRepo.getClients(limit, offset);

        return clients
    }
}