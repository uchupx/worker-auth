import type {Database} from "@app/database/mysql.ts";
import {
    type ClientCreateModel,
    type ClientModel,
    type ClientUpdateModel,
    toClientModel
} from "@app/repo/client.type.ts";
import {clientQuery} from "@app/repo/client.query.ts";
import {paginationResponse} from "@restApi/response.ts";
import {pagianationQuery} from "@app/repo/query.ts";


export class ClientRepo {
    private db: Database;


    constructor(db: Database) {
        this.db = db;
    }

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
     * Get Clients by limit and offset
     * @param limit - limit of result
     * @param offset - start from num row
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