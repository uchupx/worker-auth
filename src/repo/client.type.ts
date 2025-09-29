export type ClientModel = {
    id?: string;
    name: string;
    secret: string;
    redirectUris: string[];

    createdAt: Date;
    deletedAt?: Date;
    updatedAt?: Date;
}


export type ClientCreateModel = Omit<ClientModel, 'id' | 'createdAt' | 'updatedAt'>;
export type ClientUpdateModel = Omit<ClientModel, 'secret' | 'createdAt' | 'updatedAd'>;

export function toClientModel(queryResponse: any): ClientModel {
    if (!queryResponse) {
        throw new Error('Invalid query response: response is null or undefined');
    }

    let urls = queryResponse.redirect_uris;

    if (typeof urls === 'string') {
        try {
            urls = JSON.parse(urls);
        } catch (e) {
            urls = []
        }
    }

    return {
        id: queryResponse.id ?? undefined,
        name: queryResponse.name,
        secret: queryResponse.secret,
        redirectUris: urls || [],
        createdAt: new Date(queryResponse.created_at),
        deletedAt: queryResponse.deleted_at ? new Date(queryResponse.deleted_at) : undefined,
        updatedAt: queryResponse.updated_at ? new Date(queryResponse.updated_at) : undefined,
    }
}