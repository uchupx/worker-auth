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
export function toClientModel(queryResponse: any): ClientModel {
    if (!queryResponse) {
        throw new Error('Invalid query response: response is null or undefined');
    }

    let urls = queryResponse.redirectUris;
    if (typeof urls === 'string') {
        urls = JSON.parse(urls);
    }

    return {
        id: queryResponse.id ?? undefined,
        name: queryResponse.name,
        secret: queryResponse.secret,
        redirectUris: urls || [],
        createdAt: new Date(queryResponse.createdAt),
        deletedAt: queryResponse.deletedAt ? new Date(queryResponse.deletedAt) : undefined,
        updatedAt: queryResponse.updatedAt ? new Date(queryResponse.updatedAt) : undefined,
    }
}