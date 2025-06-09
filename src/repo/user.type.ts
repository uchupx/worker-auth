export type UserModel = {
  id?: string;
  username: string;
  email: string;
  password: string

  createdAt: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}


export type UserCreateModel = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>;

export function toUserModel(queryResponse: any): UserModel {
  if (!queryResponse) {
    throw new Error('Invalid query response: response is null or undefined');
  }

  return {
    id: queryResponse.id ?? undefined,
    username: queryResponse.username,
    email: queryResponse.email,
    password: queryResponse.passsword, 
    createdAt: new Date(queryResponse.createdAt),
    deletedAt: queryResponse.deletedAt ? new Date(queryResponse.deletedAt) : undefined,
    updatedAt: queryResponse.updatedAt ? new Date(queryResponse.updatedAt) : undefined,
  };
}
