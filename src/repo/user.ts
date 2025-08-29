import type { Database } from "../database/mysql";
import { userQuery } from "./user.query";
import { toUserModel, type UserCreateModel, type UserModel } from "./user.type";

export class UserRepo {
  private db: Database;

  constructor( db: Database) {
    this.db = db;
  }

  public async getUserById(id: string): Promise<UserModel | null> {
    const result = this.db.execute(userQuery.findById, [id]);

    return result.then((rows: any[]) => {
      if (rows.length === 0) {
        return null;
      }

      const user = toUserModel(rows[0]);

      return user;
    })
  }


  public async getUserByUsername(username: string, clientSecret: string): Promise<UserModel | null> {
    const result = this.db.execute(userQuery.findByUsername, [username, clientSecret]);

    return result.then((rows: any[]) => {
      if (rows.length === 0) {
        return null;
      }

      const user = toUserModel(rows[0]);

      return user;
    })
  }

  public async createUser(user: UserCreateModel): Promise<UserModel> {
    const resDB = this.db.execute(userQuery.insert, [user.username, user.email, user.password, user.client_id]);
    return resDB.then((result: any) => {
      if (result.affectedRows === 0) {
        throw new Error('Failed to create user');
      }

      const userId = result.insertId;
      const userModel = toUserModel(user);

      userModel.id = userId;

      return userModel;
    });
  }

  public async updatePassword(user: UserModel): Promise<UserModel> {
      const resDB = this.db.execute(userQuery.updatePassword, [user.password, user.id]);
      return resDB.then(async (result: any) => {
          if (result.affectedRows === 0) {
              throw new Error('Failed to update password');
          }

          return user;
      })

  }
}
