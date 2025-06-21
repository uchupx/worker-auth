import app from "@app/config/app";
import type { UserRepo } from "@app/repo/user";
import type { UserModel } from "@app/repo/user.type";

export class UserService {
  private userRepo: UserRepo

  constructor(userRepo: UserRepo) {
    const config = app.getConfig

    this.userRepo = userRepo
  }


  public async getUser(id: string): Promise<UserModel> {
    const user = await this.userRepo.getUserById(id)
    if (user === null) {
      throw new Error("User not found")
    }

    delete user.password

    return user
  }
}
