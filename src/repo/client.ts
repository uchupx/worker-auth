import type {Database} from "@app/database/mysql.ts";
import {
    type ClientCreateModel,
    type ClientModel,
    type ClientUpdateModel,
    toClientModel
} from "@app/repo/client.type.ts";
import {clientQuery} from "@app/repo/client.query.ts";
import {pagianationQuery} from "@app/repo/query.ts";

/**
 * Repository class for managing client data in the database.
 * Provides CRUD operations and client-specific query methods.
 */
export class ClientRepo {
    private db: Database;

    /**
     * Create a new ClientRepo instance.
     * @param db - Database connection instance
     */
    constructor(db: Database) {
        this.db = db;
    }

    /**
     * Create a new client in the database.
     * @param client - The client data to create
     * @returns Promise<ClientModel> The created client with generated ID
     * @throws {Error} When client creation fails
     */
    public async createClient(client: ClientCreateModel): Promise<ClientModel> {
        const resDB = this.db.execute(clientQuery.insert, [client.name, client.secret, client.redirectUris]);
        return resDB.then((result: any) => {
            if (result.affectedRows === 0) {
                throw new Error('Failed to create client');
            }

            const clientId = result.insertId;
            const clientModel = toClientModel(client);

            clientModel.id = clientId;

            return clientModel;
        });
    }

    /**
     * Find a client by its secret key.
     * @param secret - The client secret key to search for
     * @returns Promise<ClientModel | null> The found client or null if not found
     */
    public async getClientBySecret(secret: string): Promise<ClientModel | null> {
        const result = this.db.execute(clientQuery.findBySecret, [secret]);

        return result.then((rows: any[]) => {
            if (rows.length === 0) {
                return null;
            }

            const client = toClientModel(rows[0]);

            return client;
        });
    }

    /**
     * Get a paginated list of clients.
     * @param limit - Maximum number of clients to return
     * @param offset - Number of clients to skip for pagination
     * @returns Promise<ClientModel[]> Array of clients within the specified range
     */
    public async getClients(limit: Number, offset: Number): Promise<ClientModel[]> {
        const query = pagianationQuery(clientQuery.finds, limit.valueOf(), offset.valueOf())
        const resDB = this.db.execute(query);

        return resDB.then((rows: any[]) => {
            if (rows.length == 0) {
                return [];
            }

            const data: ClientModel[] = []

            rows.forEach(i => {
                data.push(toClientModel(i))
            })

            return data
        });
    }

    /**
     * Find a client by its ID.
     * @param id - The client ID to search for
     * @returns Promise<ClientModel | null> The found client or null if not found
     */
    public async findById(id: string): Promise<ClientModel | null> {
        const resDB = this.db.execute(clientQuery.findById, [id])

        return resDB.then((rows: any[]) => {
            if (rows.length === 0) {
                return null
            }

            const client = toClientModel(rows[0])

            return client
        })
    }

    /**
     * Update an existing client's information.
     * @param client - The client data to update (must include ID)
     * @returns Promise<ClientModel> The updated client information
     * @throws {Error} When client update fails or client not found
     */
    public async update(client: ClientUpdateModel): Promise<ClientModel> {
        const resDB = this.db.execute(clientQuery.update, [client.name, client.redirectUris, client.id])

        return resDB.then(async (result: any) => {
            if (result.affectedRows === 0) {
                throw new Error("Failed to update client")
            }

            const data = await this.findById(client.id!)

            return data!
        })
    }
}
